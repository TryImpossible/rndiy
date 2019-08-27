## 需求确立

### 描述

当 App 进入 kiosk 模式，要求隐藏底部虚拟键、禁止下拉出现状态栏，这样保证我们的 App 一直处于系统前台运行。

**1.** 通过`getWindow().getDecorView().setSystemUiVisibility(Options)`控制 SystemUi 是否可见就行了，但是并没有做到真正的隐藏，当触措屏幕的时候状态栏和导航栏还是显示出来了，显然这种实现方式并不能满足需求。

```
View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
//                    | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    | View.SYSTEM_UI_FLAG_IMMERSIVE;
            decorView.setSystemUiVisibility(uiOptions);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
```

**2.** 模拟系统设置的**应用锁**功能，尝试在自己的 App 里实现应用锁的达到锁定应用，隐藏状态栏和导航栏。很不容易，的确用代码实现了应用锁功能，但是坑的是 App 进入锁定模式时，系统会给出解锁方法的提示，而且屏蔽不了。对于使用**应用锁**进入 Kiosk 模式，请查看[react-native-kiosk-mode]()

### 确认

简单整理下需求：

- Settings.apk 设置 -> 显示下， 添加系统栏显示功能，控制显示与隐藏
- 通过广播的方法动态显示、隐藏系统栏（状态栏和导航栏）

## 功能实现

### 定义广播

找到`frameworks/base/core/java/android/content/Intent.java`文件，在文件末尾插入如下代码：

```
public static final String ACTION_SYSTEM_BAR_SHOW = "android.intent.action.SYSTEM_BAR_SHOW"; // 显示系统栏
public static final String ACTION_SYSTEM_BAR_HIDE = "android.intent.action.SYSTEM_BAR_HIDE"; // 隐藏系统栏
```

### 过虑广播

找到`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/phone/PhoneStatusBar.java`文件，定位至 926 行，修改代码接收定义的广播：

```
    // receive broadcasts
    IntentFilter filter = new IntentFilter();
    filter.addAction(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
    filter.addAction(Intent.ACTION_SCREEN_OFF);
    filter.addAction(Intent.ACTION_SCREEN_ON);
    filter.addAction(Intent.ACTION_SYSTEM_BAR_SHOW);
    filter.addAction(Intent.ACTION_SYSTEM_BAR_HIDE);
    context.registerReceiverAsUser(mBroadcastReceiver, UserHandle.ALL, filter, null, null);
```

### 根据广播显示、隐藏

下面的代码主要是判断接收的广播，调用对应的方法

```
private BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            if (DEBUG) Log.v(TAG, "onReceive: " + intent);
            String action = intent.getAction();
            if (Intent.ACTION_CLOSE_SYSTEM_DIALOGS.equals(action)) {
                if (isCurrentProfile(getSendingUserId())) {
                    int flags = CommandQueue.FLAG_EXCLUDE_NONE;
                    String reason = intent.getStringExtra("reason");
                    if (reason != null && reason.equals(SYSTEM_DIALOG_REASON_RECENT_APPS)) {
                        flags |= CommandQueue.FLAG_EXCLUDE_RECENTS_PANEL;
                    }
                    animateCollapsePanels(flags);
                }
            }
            else if (Intent.ACTION_SCREEN_OFF.equals(action)) {
                notifyNavigationBarScreenOn(false);
                notifyHeadsUpScreenOff();
                finishBarAnimations();
                resetUserExpandedStates();
            }
            else if (Intent.ACTION_SCREEN_ON.equals(action)) {
                notifyNavigationBarScreenOn(true);
            }
            else if (Intent.ACTION_SYSTEM_BAR_SHOW.equals(action)) {
                setSystemBarVisibility(View.VISIBLE);
            }
            else if (Intent.ACTION_SYSTEM_BAR_HIDE.equals(action)) {
                setSystemBarVisibility(View.GONE);
            }
        }
    };
```

下面的代码才是核心功能的实现，显示与隐藏 SystemBar

```
private void setSystemBarVisibility(int visibility) {
    if (DEBUG) Log.v(TAG, "setSystemBarVisibility: " + visibility);

    if (visibility == View.GONE && mNavigationBarView != null && mStatusBarWindow != null) {
        try {
            mWindowManager.removeViewImmediate(mNavigationBarView);
            mStatusBarWindow.setVisibility(View.GONE);
            Settings.System.putInt(mContext.getContentResolver(), Settings.System.SYSTEM_BAR_DISPLAY, 0);
        } catch (IllegalArgumentException e) {
            Log.w(TAG, "IllegalArgumentException: " + e);
        }
        mNavigationBarView = null;

    } else if (visibility == View.VISIBLE && mNavigationBarView == null && mStatusBarWindow != null) {
        try {
            makeNavigationBarView();
            addNavigationBar();
            mStatusBarWindow.setVisibility(View.VISIBLE);
            Settings.System.putInt(mContext.getContentResolver(), Settings.System.SYSTEM_BAR_DISPLAY, 1);
        } catch (WindowManager.BadTokenException e) {
            // ignore
            Log.w(TAG, "BadTokenException: " + e.getMessage());
        } catch (RuntimeException e) {
            // don't crash if something else bad happens, for example a
            // failure loading resources because we are loading from an app
            // on external storage that has been unmounted.
            Log.w(TAG, "RuntimeException: " + e);
        }
    }
}

private void makeNavigationBarView() {
    mNavigationBarView = (NavigationBarView) View.inflate(mContext, R.layout.navigation_bar, null);
    mNavigationBarView.setDisabledFlags(mDisabled1);
    mNavigationBarView.setBar(this);
    mNavigationBarView.setOnVerticalChangedListener(
            new NavigationBarView.OnVerticalChangedListener() {
                @Override
                public void onVerticalChanged(boolean isVertical) {
                    if (mAssistManager != null) {
                        mAssistManager.onConfigurationChanged();
                    }
                    mNotificationPanel.setQsScrimEnabled(!isVertical);
                }
            });
    mNavigationBarView.setOnTouchListener(new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            checkUserAutohide(v, event);
            return false;
        }
    });
}
```

### 系统设置添加系统栏显示功能

1.语言支持中文与英文

找到`packages/apps/Settings/res/values-zh-rCN/strings.xml`文件，插入以下代码：

```
 <!-- System Bar settings title-->
    <string name="system_bar_settings_title">系统栏显示</string>
    <!-- System Bar settings summary-->
    <string name="system_bar_settings_summary">控制系统栏显示或隐藏</string>
```

找到`apps/Settings/res/values/strings.xml`文件，插入以下代码：

```
 <!-- System Bar settings title-->
    <string name="system_bar_settings_title">System Bar Display</string>
    <!-- System Bar settings summary-->
    <string name="system_bar_settings_summary">Control System Bar show or hide</string>
```

2.构建系统栏显示 UI

找到`packages/apps/Settings/res/xml/display_settings.xml`文件，插入以下代码：

```
<SwitchPreference
    android:key="system_bar"
    android:title="@string/system_bar_settings_title"
    android:summary="@string/system_bar_settings_summary"
    android:persistent="false" />
```

3.调用广播实现切换

导入包

```
import static android.provider.Settings.System.SYSTEM_BAR_DISPLAY;
import android.content.Intent;
```

声明变量

```
private static final String KEY_SYSTEM_BAR = "system_bar";
private SwitchPreference mSystemBarPreference;
```

onCreate()方法中，初始化控件

```
mSystemBarPreference = (SwitchPreference) findPreference(KEY_SYSTEM_BAR);
if (mSystemBarPreference != null) {
    mSystemBarPreference.setOnPreferenceChangeListener(this);
}
```

updateState()方法，更新控件状态

```
 // update system bar
if (mSystemBarPreference != null) {
    int value = Settings.System.getInt(getContentResolver(), SYSTEM_BAR_DISPLAY, 1);
    mSystemBarPreference.setChecked(value == 1);
}
```

onPreferenceChange()回调方法，发送控制系统栏的广播

```
 if (preference == mSystemBarPreference) {
    boolean value = (Boolean) objValue;
    getContext().sendBroadcast(new Intent(value ? Intent.ACTION_SYSTEM_BAR_SHOW : Intent.ACTION_SYSTEM_BAR_HIDE));
    Settings.System.putInt(getContentResolver(), SYSTEM_BAR_DISPLAY, value ? 1 : 0);
}
```

## 用法

简单讲解下通过广播的方式控制系统栏的显示与隐藏

**adb**

```
adb shell am broadcast -a android.intent.action.SYSTEM_BAR_SHOW // 显示
adb shell am broadcast -a android.intent.action.SYSTEM_BAR_HIDE // 隐藏
```

**intent**

```
// 显示
Intent intent = new Intent();
intent.setAction("android.intent.action.SYSTEM_BAR_SHOW");
sendBroadcast(intent);

// 隐藏
Intent intent = new Intent();
intent.setAction("android.intent.action.SYSTEM_BAR_HIDE");
sendBroadcast(intent);
```

## 小结

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019040920444784.gif)

如何从源码的角度实现动态显示、隐藏系统栏(状态栏和导航栏)，具体实现也就这样了，这里仅是简单记录下。

[Android-6.0 动态显示、隐藏系统栏(状态栏和导航栏)](https://download.csdn.net/download/ctrl_s/11099606)，提供下载
