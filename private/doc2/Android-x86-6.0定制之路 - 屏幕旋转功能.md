## 需求确立

### 描述

Android-x86-6.0 屏幕默认横屏展示，像 kiosk 模式的点餐机通常是立着的，也就是说需要竖屏展示。对于这个问题，以对 Android 的了解就是去设置里查找是否有支持屏幕旋转的功能，很遗憾 Android-x86-6.0 并没有支持，看来又要修改源码了。

### 确认

在 Settings.apk 里添加屏幕旋转的功能，实现屏幕方向的调整。

## 功能实现

通过查阅资料，发现了实现屏幕旋转的一个非常的简单的方式，利用`Settings.System.USER_ROTATION`这个系统数据库字段来实现，但是这有个缺陷，就是开机的动画不能随着设置好的屏幕方向旋转，不过这影响也不大，毕竟个人能力有限的。

在 Settings.apk，显示模块下添加屏幕旋转功能

### 资源文件

主要是多语言(仅支持中、英文)，旋转选项的静态数据

找到`packages/apps/Settings/res/values/strings.xml`文件，添加如下代码

```
<!-- Screen rotate title-->
    <string name="screen_rotate_title">Screen rotate</string>
    <!-- Screen rotate summary-->
    <string name="screen_rotate_summary">Control screen orientation</string>
```

找到`packages/apps/Settings/res/values-zh-rCN/strings.xml`文件，添加如下代码

```
  <!-- Screen rotate title-->
    <string name="screen_rotate_title">屏幕旋转</string>
    <!-- Screen rotate summary-->
    <string name="screen_rotate_summary">控制屏幕方向</string>
```

找到`packages/apps/Settings/res/values/arrays.xml`文件，添加如下代码

```
 <!-- Screen rotate settings.  These are shown in a list dialog. -->
    <string-array name="screen_rotate_entries">
        <item>0</item>
        <item>90</item>
        <item>180</item>
        <item>270</item>
    </string-array>

    <!-- Do not translate. -->
    <string-array name="screen_rotate_values" translatable="false">
        <!-- Do not translate. -->
        <item>0</item>
        <!-- Do not translate. -->
        <item>90</item>
        <!-- Do not translate. -->
        <item>180</item>
        <!-- Do not translate. -->
        <item>270</item>
    </string-array>
```

找到`packages/apps/Settings/res/values-zh-rCN/arrays.xml`文件，添加如下代码

```
<!-- Screen rotate settings.  These are shown in a list dialog. -->
  <string-array name="screen_rotate_entries">
    <item>0</item>
    <item>90</item>
    <item>180</item>
    <item>270</item>
  </string-array>
```

### 界面搭建

找到`packages/apps/Settings/res/xml/display_settings.xml`文件，添加如下代码

```
 <ListPreference
    android:key="screen_rotate"
    android:title="@string/screen_rotate_title"
    android:summary="@string/screen_rotate_summary"
    android:persistent="false"
    android:entries="@array/screen_rotate_entries"
    android:entryValues="@array/screen_rotate_values" />
```

### 具体实现

1.定义变量

```
private static final String KEY_SCREEN_ROTATE = "screen_rotate";
private ListPreference mScreenRotatePreference;
```

2.绑定控件

```
mScreenRotatePreference = (ListPreference) findPreference(KEY_SCREEN_ROTATE);
if (mScreenRotatePreference != null) {
    mScreenRotatePreference.setOnPreferenceChangeListener(this);
}
```

3.控件赋值

```
int index = Settings.System.getInt(getContentResolver(), Settings.System.USER_ROTATION, 0);
mScreenRotatePreference.setValueIndex(index);
```

4.选项切换实现

```
public void setScreenRotation(String value) {
    int rotation = 0;
    if (value.equals("0")) {
        rotation = Surface.ROTATION_0;
    } else if (value.equals("90")) {
        rotation = Surface.ROTATION_90;
    } else if (value.equals("180")) {
        rotation = Surface.ROTATION_180;
    } else if (value.equals("270")) {
        rotation = Surface.ROTATION_270;
    }
    Settings.System.putInt(getContentResolver(), Settings.System.USER_ROTATION, rotation);
}

@Override
public boolean onPreferenceChange(Preference preference, Object objValue) {
    final String key = preference.getKey();
    if (key.equals(KEY_SCREEN_ROTATE)) {
        setScreenRotation((String) objValue);
    }
}
```

### 默认值修改

**关闭重力感应**

修改 Settings.System.USER_ROTATION 数据库字段实现屏幕旋转，必须关闭重力感应，对应 Settings.System.ACCELEROMETER_ROTATION 数据库字段，这里直接去修改数据库的默认值

找到`base/packages/SettingsProvider/res/values/defaults.xml`文件

将

```
<bool name="def_accelerometer_rotation">false</bool>
```

替换为

```
<bool name="def_accelerometer_rotation">false</bool>
```

**屏幕方向默认竖屏**

找到`base/packages/SettingsProvider/res/values/defaults.xml`文件

将

```
 <integer name="def_user_rotation">0</integer>
```

替换为

```
<integer name="def_user_rotation">3</integer>
```

## 小结

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190412121011273.gif)

Settings.apk 添加屏幕旋转的功能就完成了，简单记录下

[Android-6.0 屏幕旋转补丁](https://download.csdn.net/download/ctrl_s/11107534)，提供下载
