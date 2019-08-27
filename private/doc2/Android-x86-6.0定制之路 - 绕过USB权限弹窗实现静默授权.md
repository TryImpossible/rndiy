## 需求确立

### 描述

**1.** 我们的 App 要求接入多个外部设备，像打印机、扫码器、读卡器和 POS 机等，其中打印机和扫码器就是使用 USB 连接的。遇到的问题是，我先接入打印机，再接入扫码器，发现打印机就连接不了，必须重新插拔下才行，但是单独连接打印机或者扫码器都是正常的。

后来谷歌找到相关问题：

> 假如有两个 USB 设备 A 和 B，先接入 A，再接入 B，发现在获取设备 A 的 UsbInterface 的时候，是空的，单接 A 或 B 都是可以正常工作的。

**2.** 首次插入 USB 设备时，会出现权限请求弹窗，不进行同意操作的话，USB 设备就识别不了，现在要求去掉权限请求弹窗，实现静默授权。

### 确认

简单整理：

- 同时识别多个 USB 设备
- USB 设备静默授权

## 功能实现

**同时识别多个 USB 设备**

找到`frameworks/base/services/usb/java/com/android/server/usb/UsbHostManager.java`文件

调试分析，识别不了 USB 设备的原因指向`addUsbConfiguration`方法：

```
 private void addUsbConfiguration(int id, String name, int attributes, int maxPower) {
        if (mNewConfiguration != null) { // 这里mNewConfiguration指向上一个USB设备的Configuration，然后被清理了
            mNewConfiguration.setInterfaces(
                    mNewInterfaces.toArray(new UsbInterface[mNewInterfaces.size()]));
            mNewInterfaces.clear();
        }

        mNewConfiguration = new UsbConfiguration(id, name, attributes, maxPower);
        mNewConfigurations.add(mNewConfiguration);
    }
```

解决此问题，`endUsbDeviceAdded`方法把 mNewConfiguration 和 mNewInterface 赋值为 null，以后执行`addConfiguration`方法时会针对新设备去新建这些对象，具体修改如下：

```
private void endUsbDeviceAdded() {
    if (DEBUG) {
        Slog.d(TAG, "usb:UsbHostManager.endUsbDeviceAdded()");
    }
    if (mNewInterface != null) {
        mNewInterface.setEndpoints(
                mNewEndpoints.toArray(new UsbEndpoint[mNewEndpoints.size()]));
    }
    if (mNewConfiguration != null) {
        mNewConfiguration.setInterfaces(
                mNewInterfaces.toArray(new UsbInterface[mNewInterfaces.size()]));
    }


    synchronized (mLock) {
        if (mNewDevice != null) {
            mNewDevice.setConfigurations(
                    mNewConfigurations.toArray(new UsbConfiguration[mNewConfigurations.size()]));
            mDevices.put(mNewDevice.getDeviceName(), mNewDevice);
            Slog.d(TAG, "Added device " + mNewDevice);
            getCurrentSettings().deviceAttached(mNewDevice);
            mUsbAlsaManager.usbDeviceAdded(mNewDevice);
        } else {
            Slog.e(TAG, "mNewDevice is null in endUsbDeviceAdded");
        }
        mNewDevice = null;
        mNewConfigurations = null;
        mNewInterfaces = null;
        mNewEndpoints = null;
        mNewConfiguration = null; // 添加
        mNewInterface = null; // 添加
    }
}
```

**USB 设备静默授权**

实现 USB 设备静默授权的话挺简单的，找到`frameworks/base/packages/SystemUI/src/com/android/systemui/usb /UsbPermissionActivity.java`文件，定位`onCreate`方法，

用

```
mPermissionGranted = true;
finish();
```

替换

```
setupAlert();
```

这样就去掉弹窗，实现静默授权了， 具体修改如下：

```
@Override
public void onCreate(Bundle icicle) {
super.onCreate(icicle);

    Intent intent = getIntent();
    mDevice = (UsbDevice)intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
    mAccessory = (UsbAccessory)intent.getParcelableExtra(UsbManager.EXTRA_ACCESSORY);
    mPendingIntent = (PendingIntent)intent.getParcelableExtra(Intent.EXTRA_INTENT);
    mUid = intent.getIntExtra(Intent.EXTRA_UID, -1);
    mPackageName = intent.getStringExtra("package");

    PackageManager packageManager = getPackageManager();
    ApplicationInfo aInfo;
    try {
        aInfo = packageManager.getApplicationInfo(mPackageName, 0);
    } catch (PackageManager.NameNotFoundException e) {
        Log.e(TAG, "unable to look up package name", e);
        finish();
        return;
    }
    String appName = aInfo.loadLabel(packageManager).toString();

    final AlertController.AlertParams ap = mAlertParams;
    ap.mIcon = aInfo.loadIcon(packageManager);
    ap.mTitle = appName;
    if (mDevice == null) {
        ap.mMessage = getString(R.string.usb_accessory_permission_prompt, appName);
        mDisconnectedReceiver = new UsbDisconnectedReceiver(this, mAccessory);
    } else {
        ap.mMessage = getString(R.string.usb_device_permission_prompt, appName);
        mDisconnectedReceiver = new UsbDisconnectedReceiver(this, mDevice);
    }
    ap.mPositiveButtonText = getString(android.R.string.ok);
    ap.mNegativeButtonText = getString(android.R.string.cancel);
    ap.mPositiveButtonListener = this;
    ap.mNegativeButtonListener = this;

    // add "always use" checkbox
    LayoutInflater inflater = (LayoutInflater)getSystemService(
            Context.LAYOUT_INFLATER_SERVICE);
    ap.mView = inflater.inflate(com.android.internal.R.layout.always_use_checkbox, null);
    mAlwaysUse = (CheckBox)ap.mView.findViewById(com.android.internal.R.id.alwaysUse);
    if (mDevice == null) {
        mAlwaysUse.setText(R.string.always_use_accessory);
    } else {
        mAlwaysUse.setText(R.string.always_use_device);
    }
    mAlwaysUse.setOnCheckedChangeListener(this);
    mClearDefaultHint = (TextView)ap.mView.findViewById(
                                                com.android.internal.R.id.clearDefaultHint);
    mClearDefaultHint.setVisibility(View.GONE);

// begin
// setupAlert();
mPermissionGranted = true;
finish();
// end
}

```

## 小结

在 Android-6.0 上，关于同时识别多个 USB 设备的 Bug 已经被官方修复了，这里还是讲下，算是作个笔记吧。至于如何去掉 USB 权限弹窗实现静默授权这里就修改了源码，也就那两行代码的，简单记录下吧
