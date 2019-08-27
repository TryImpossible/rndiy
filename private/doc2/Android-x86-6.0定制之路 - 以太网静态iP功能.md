## 需求确立

### 描述

Android-x86-6.0 仅支持以太网动态获取 IP(DHCP)，现在客户要求设置静态 IP，即手动填写 ip 地址、网关、子网掩码、dns 服务器等信息。首先还是去 Settings.apk 查看是否支持此功能，很遗憾系统并不支持此功能，没法还是要去修改源码了。

### 确认

Settings.apk 添加以太网模块，包括以下功能：

- 启用以太网、禁用以太网
- 显示网络信息，包括 ip 地址、网关、子网掩码、dns 服务器
- 切换以太网模式，包括动态获取 ip 和手动填写 ip

## UI 搭建

### 多语言资源

找到`apps/Settings/res/values-zh-rCN/arrays.xml`文件，按照补丁文件修改：

```
    <item msgid="6131821495505931173">"红色"</item>
   </string-array>
     <!-- no translation found for usb_configuration_titles:0 (292902998500371970) -->
+  <string-array name="ethernet_ip_mode_entries">
+    <item>"动态获取"</item>
+    <item>"静态地址"</item>
+  </string-array>
 </resources>
```

找到`apps/Settings/res/values-zh-rCN/strings.xml`文件，按照补丁文件修改：

```
<resources xmlns:android="http://schemas.android.com/apk/res/android"
     xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">
+    <string name="ethernet_settings_title">"以太网"</string>
+    <string name="ethernet_settings">"以太网"</string>
+    <string name="ethernet_enable">"已启用"</string>
+    <string name="ethernet_disable">"已禁用"</string>
+    <string name="ethernet_ip_address">"IP地址"</string>
+    <string name="ethernet_netmask">"子网掩码"</string>
+    <string name="ethernet_gateway">"网关"</string>
+    <string name="ethernet_dns1">"首选 DNS 服务器"</string>
+    <string name="ethernet_dns2">"备选 DNS 服务器"</string>
+    <string name="ethernet_loading_tips">"获取中..."</string>
+    <string name="ethernet_ip_mode">"以太网IP模式"</string>
+    <string name="ethernet_ip_dhcp">"动态获取"</string>
+    <string name="ethernet_ip_static">"静态地址"</string>
+    <string name="ethernet_ip_static_cancel_button">"取消"</string>
+    <string name="ethernet_ip_static_connect_button">"连接"</string>
+    <string name="ethernet_ip_settings_invalid_ip">"请填写正确的格式"</string>
+
     <string name="yes" msgid="4676390750360727396">"是"</string>
     <string name="no" msgid="6731231425810196216">"否"</string>
     <string name="create" msgid="3578857613172647409">"创建"</string>
```

找到`packages/apps/Settings/res/values/arrays.xml`文件，按照补丁文件修改：

```
       <item>0</item>
     </string-array>

+    <string-array name="ethernet_ip_mode_entries">
+        <item>dhcp</item>
+        <item>static</item>
+    </string-array>
+
+    <string-array name="ethernet_ip_mode_values" translatable="false">
+        <item>dhcp</item>
+        <item>manual</item>
+    </string-array>
 </resources>
```

找到`packages/apps/Settings/res/values/strings.xml`文件，按照补丁文件修改：

```
<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">
+    <string name="ethernet_settings_title">"Ethernet"</string>
+    <string name="ethernet_settings">"Ethernet"</string>
+    <string name="ethernet_enable">"ethernet is enable"</string>
+    <string name="ethernet_disable">"ethernet is disable"</string>
+    <string name="ethernet_ip_address">"IP address"</string>
+    <string name="ethernet_netmask">"Netmask"</string>
+    <string name="ethernet_gateway">"Gateway"</string>
+    <string name="ethernet_dns1">"DNS server1"</string>
+    <string name="ethernet_dns2">"DNS server2"</string>
+    <string name="ethernet_loading_tips">"loading..."</string>
+    <string name="ethernet_ip_mode">"Ethernet ip mode"</string>
+    <string name="ethernet_ip_dhcp">"dpcp"</string>
+    <string name="ethernet_ip_static">"static"</string>
+    <string name="ethernet_ip_static_cancel_button">"cancel"</string>
+    <string name="ethernet_ip_static_connect_button">"connect"</string>
+    <string name="ethernet_ip_settings_invalid_ip">"Please fill in the correct format."</string>
+
     <!-- Strings for Dialog yes button -->
     <string name="yes">"Yes"</string>
     <!-- Strings for Dialog no button -->
```

以上修改，就是以太网模块的所用到的多语言资源

### 以太网模块入口

找到`packages/apps/Settings/res/xml/wireless_settings.xml`文件，按照补丁修改代码：

```
     <PreferenceScreen
+        android:fragment="com.android.settings.ethernet.EthernetSettings"
+        android:key="ethernet_settings"
+        android:title="@string/ethernet_settings_title" />
+
+    <PreferenceScreen
         android:key="mobile_network_settings"
         android:title="@string/network_settings_title"
         settings:keywords="@string/keywords_more_mobile_networks"
```

如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190412164236838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

### 以太网模块界面

找到`packages/apps/Settings/res/xml/`文件夹，添加`ethernet_settings.xml`布局文件，代码如下：

```
<?xml version="1.0" encoding="utf-8"?>
<!--$_FOR_ROCKCHIP_RBOX_$--><!--$_rbox_$_modify_$_chenzhi_20120309: add for ethernet--><!-- Copyright (C) 2008 The Android Open Source Project

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
-->

<PreferenceScreen xmlns:android="http://schemas.android.com/apk/res/android"
    android:title="@string/ethernet_settings">

    <SwitchPreference
        android:key="ethernet_settings"
        android:persistent="false"
        android:summary="@string/ethernet_enable"
        android:title="@string/ethernet_settings" />

    <Preference
        android:key="ethernet_ip_address"
        android:title="@string/ethernet_ip_address"
        android:summary="0.0.0.0"/>

    <Preference
        android:key="ethernet_netmask"
        android:title="@string/ethernet_netmask"
        android:summary="0.0.0.0"/>

    <Preference
        android:key="ethernet_gateway"
        android:title="@string/ethernet_gateway"
        android:summary="0.0.0.0"/>

    <Preference
        android:key="ethernet_dns1"
        android:title="@string/ethernet_dns1"
        android:summary="0.0.0.0"/>

    <Preference
        android:key="ethernet_dns2"
        android:title="@string/ethernet_dns2"
        android:summary="0.0.0.0"/>

    <ListPreference
        android:entries="@array/ethernet_ip_mode_entries"
        android:entryValues="@array/ethernet_ip_mode_values"
        android:key="ethernet_ip_mode"
        android:persistent="false"
        android:summary="@string/ethernet_ip_dhcp"
        android:title="@string/ethernet_ip_mode" />

</PreferenceScreen>
```

如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190412171642253.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

区域一是启用、禁用以太网，区域二是网络相关信息，区域三是以太网模式切换

### 以太网手动设置 IP 弹窗

找到`packages/apps/Settings/res/layout/`文件夹，创建`ethernet_static_ip_dialog.xml`布局文件，代码如下：

```
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:paddingLeft="20dp"
        android:paddingTop="12dp"
        android:paddingRight="20dp"
        android:paddingBottom="12dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="3dp"
            android:text="@string/ethernet_ip_address" />

        <EditText
            android:id="@+id/ethernet_ip_address"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="192.168.192.57" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="3dp"
            android:text="@string/ethernet_gateway" />

        <EditText
            android:id="@+id/ethernet_gateway"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="192.168.192.1" />


        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="3dp"
            android:text="@string/ethernet_netmask" />

        <EditText
            android:id="@+id/ethernet_netmask"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginLeft="1dp"
            android:hint="255.255.255.0" />


        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="3dp"
            android:text="@string/ethernet_dns1" />

        <EditText
            android:id="@+id/ethernet_dns1"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="192.168.192.1" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginLeft="3dp"
            android:text="@string/ethernet_dns2" />

        <EditText
            android:id="@+id/ethernet_dns2"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="114.114.114.114" />

    </LinearLayout>
</ScrollView>
```

如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190412173032373.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

## 功能实现

### 启用、禁用以太网功能

找到`frameworks/base/core/java/android/net/EthernetManager.java`文件，添加`setEthernetEnabled()`方法，修改如下：

```
+    void setEthernetEnabled(boolean enabled);
```

这里`setEthernetEnabled()`方法调用的是`EthernetServiceImpl.java`里的方法，使用了 aidl 技术，具体修改如下：

找到`frameworks/base/core/java/android/net/IEthernetManager.aidl`文件，声明以下方法：

```
+    public void setEthernetEnabled(boolean enabled) {
+        try {
+            mService.setEthernetEnabled(enabled);
+        } catch (NullPointerException | RemoteException e) {
+        }
+    }
```

找到`frameworks/opt/net/ethernet/java/com/android/server/ethernet/EthernetServiceImpl.java`文件，实现`setEthernetEnabled()`方法

```
+    @Override
+    public void reconnect() {
+        new Thread(new Runnable() {
+            @Override
+            public void run() {
+                Looper.prepare();
+                mTracker.start(mContext, mHandler);
+                mStarted.set(true);
+                Looper.loop();
+            }
+        }).start();
+    }
+
+    @Override
+    public void disconnect() {
+        new Thread(new Runnable() {
+            @Override
+            public void run() {
+                Looper.prepare();
+                mTracker.stop();
+                mStarted.set(false);
+                Looper.loop();
+            }
+        }).start();
+    }
+    @Override
+    public void setEthernetEnabled(boolean enabled) {
+        if (enabled) {
+            reconnect();
+            Settings.Global.putInt(mContext.getContentResolver(), ETHERNET_ENABLED, 1);
+        } else {
+            disconnect();
+            Settings.Global.putInt(mContext.getContentResolver(), ETHERNET_ENABLED, 0);
+        }
+    }
```

找到`packages/apps/Settings/src/com/android/settings/ethernet/EthernetSettings.java`文件，当启用、禁用以太网时调用`EthernetManager`中的`setEthernetEnabled()`方法

```
+    @Override
+    public boolean onPreferenceChange(Preference preference, Object objValue) {
+        if (preference == mEthernetSettingsPreference) {
+            boolean value = (Boolean) objValue;
+            mEthernetManager.setEthernetEnabled(value);
+            mEthernetSettingsPreference.setChecked(value);
+            mEthernetSettingsPreference.setSummary(value ? getResources().getString(R.string.ethernet_enable) : getResources().getString(R.string.ethernet_disable));
+            mEthernetModePreference.setEnabled(mEthernetManager.isEthernetEnabled());
+            refreshEthernetInfo(1500);
+        }
```

### 获取以太网信息功能

找到`frameworks/base/core/java/android/net/EthernetManager.java`文件，添加`getEthernetInfo()`方法，修改如下：

```
+    public EthernetInfo getEthernetInfo() {
+        try {
+            return mService.getEthernetInfo();
+        } catch (NullPointerException | RemoteException e) {
+            return null;
+        }
+    }
```

这里`getEthernetInfo()`方法调用的是`EthernetServiceImpl.java`里的方法，使用了 aidl 技术，具体修改如下：

找到`frameworks/base/core/java/android/net/IEthernetManager.aidl`文件，声明以下方法：

```
+    EthernetInfo getEthernetInfo();
```

找到`frameworks/opt/net/ethernet/java/com/android/server/ethernet/EthernetServiceImpl.java`文件，实现`getEthernetInfo()`方法

```
+    public EthernetInfo getEthernetInfo() {
+        String ipAddress = "0.0.0.0";
+        String gateway = "0.0.0.0";
+        String netmask = "0.0.0.0";
+        String dns1 = "0.0.0.0";
+        String dns2 = "0.0.0.0";
+
+        Pattern pattern = Pattern.compile("\\d+.\\d+.\\d+.\\d+");
+        Matcher matcher;
+
+        LinkProperties linkProperties = mTracker.getEthernetInfo();
+        Log.e(TAG, "linkProperties: " + linkProperties.toString());
+        List<LinkAddress> ipList = linkProperties.getLinkAddresses();
+        if (ipList != null && ipList.size() > 0) {
+            String linkAddresses = ipList.toString();
+            Log.e(TAG, "linkAddresses: " + linkAddresses);
+            if (!TextUtils.isEmpty(linkAddresses) && linkAddresses.length() > 1) {
+                ipAddress = linkAddresses.substring(1, linkAddresses.lastIndexOf("/"));
+                matcher = pattern.matcher(ipAddress);
+                while (matcher.find()) {
+                    if (!TextUtils.isEmpty(matcher.group())) {
+                        ipAddress = matcher.group();
+                    }
+                }
+            }
+
+            Log.e(TAG, "netmask: " + ipList.get(0).getPrefixLength());
+            if (ipList.get(0) != null) {
+                netmask = calcMaskByPrefixLength(ipList.get(0).getPrefixLength());
+            }
+        }
+
+        List<RouteInfo> routeList = linkProperties.getRoutes();
+        if (routeList != null && routeList.size() > 0) {
+            String routes = routeList.toString();
+            Log.e(TAG, "routes: " + routes);
+            matcher = pattern.matcher(routes);
+            while (matcher.find()) {
+                if (!TextUtils.isEmpty(matcher.group())) {
+                    gateway = matcher.group();
+                }
+            }
+        }
+
+        List<InetAddress> dnsList= linkProperties.getDnsServers();
+        if (dnsList != null && dnsList.size() > 0) {
+            String dnsServers = dnsList.toString();
+            Log.e(TAG, "dnsServers: " + dnsServers);
+            matcher = pattern.matcher(dnsServers);
+            int i = 0;
+            while (matcher.find()) {
+                i++;
+                if (!TextUtils.isEmpty(matcher.group())) {
+                    if (i == 1) {
+                        dns1 = matcher.group();
+                    } else if (i == 2) {
+                        dns2 = matcher.group();
+                    }
+                }
+            }
+        }
+
+        EthernetInfo info = new EthernetInfo();
+        info.setIpAddress(ipAddress);
+        info.setGateway(gateway);
+        info.setNetmask(netmask);
+        info.setDns1(dns1);
+        info.setDns2(dns2);
+        return info;
+    }
+
+    public static String calcMaskByPrefixLength(int length) {
+
+        int mask = 0xffffffff << (32 - length);
+        int partsNum = 4;
+        int bitsOfPart = 8;
+        int maskParts[] = new int[partsNum];
+        int selector = 0x000000ff;
+
+        for (int i = 0; i < maskParts.length; i++) {
+            int pos = maskParts.length - 1 - i;
+            maskParts[pos] = (mask >> (i * bitsOfPart)) & selector;
+        }
+
+        String result = "";
+        result = result + maskParts[0];
+        for (int i = 1; i < maskParts.length; i++) {
+            result = result + "." + maskParts[i];
+        }
+        return result;
+    }
+
```

这里调用了`EthernetNetworkFactory`的`getEthernetInfo()`方法，找到`frameworks/opt/net/ethernet/java/com/android/server/ethernet/EthernetNetworkFactory.java`文件，添加以下方法：

```
+    public LinkProperties getEthernetInfo() {
+        return mLinkProperties;
+    }
```

找到`packages/apps/Settings/src/com/android/settings/ethernet/EthernetSettings.java`文件，当进入以太网模块时调用`EthernetManager`中的`getEthernetInfo()`方法

```
+    private void refreshEthernetInfo(long delay) {
+        if (mEthernetSettingsPreference.isChecked()) {
+            mEthernetIPAdressPreference.setSummary(R.string.ethernet_loading_tips);
+            mEthernetGatewayPreference.setSummary(R.string.ethernet_loading_tips);
+            mEthernetNetmaskPreference.setSummary(R.string.ethernet_loading_tips);
+            mEthernetDNS1Preference.setSummary(R.string.ethernet_loading_tips);
+            mEthernetDNS2Preference.setSummary(R.string.ethernet_loading_tips);
+            new Handler().postDelayed(new Runnable() {
+                @Override
+                public void run() {
+                    EthernetInfo info = mEthernetManager.getEthernetInfo();
+                    mEthernetIPAdressPreference.setSummary(info.getIpAddress());
+                    mEthernetGatewayPreference.setSummary(info.getGateway());
+                    mEthernetNetmaskPreference.setSummary(info.getNetmask());
+                    mEthernetDNS1Preference.setSummary(info.getDns1());
+                    mEthernetDNS2Preference.setSummary(info.getDns2());
+                }
+            }, delay);
+         } else {
+            mEthernetIPAdressPreference.setSummary("0.0.0.0");
+            mEthernetGatewayPreference.setSummary("0.0.0.0");
+            mEthernetNetmaskPreference.setSummary("0.0.0.0");
+            mEthernetDNS1Preference.setSummary("0.0.0.0");
+            mEthernetDNS2Preference.setSummary("0.0.0.0");
+        }
+    }
```

### 以太网模式切换功能

找到`frameworks/base/core/java/android/net/EthernetManager.java`文件，添加`setEthernetIPMode()`方法，修改如下：

```
+    public void setEthernetIPMode(String mode, EthernetInfo info) {
+        try {
+            mService.setEthernetIPMode(mode, info);
+        } catch (NullPointerException | RemoteException e) {
+        }
+    }
```

这里`setEthernetIPMode()`方法调用的是`EthernetServiceImpl.java`里的方法，使用了 aidl 技术，具体修改如下：

找到`frameworks/base/core/java/android/net/IEthernetManager.aidl`文件，声明以下方法：

```
+    void setEthernetIPMode(String mode, in EthernetInfo info);
```

找到`frameworks/opt/net/ethernet/java/com/android/server/ethernet/EthernetServiceImpl.java`文件，实现`setEthernetIPMode()`方法

```
+    @Override
+    public void setEthernetIPMode(String mode, EthernetInfo info) {
+        Log.e(TAG, "String mode: " + mode + "mStarted.get(): " + mStarted.get());
+        mTracker.changeInterfaceState(false);
+        ContentResolver contentResolver = mContext.getContentResolver();
+        IpConfiguration ipConfiguration;
+        if (EthernetManager.ETHERNET_IP_MODE_DHCP.equals(mode)) {
+            ipConfiguration = new IpConfiguration(IpConfiguration.IpAssignment.DHCP, IpConfiguration.ProxySettings.NONE, null, null);
+            Settings.Global.putString(contentResolver, ETHERNET_IP_MODE, EthernetManager.ETHERNET_IP_MODE_DHCP);
+
+        } else if (EthernetManager.ETHERNET_IP_MODE_STATIC.equals(mode)) {
+            String ipAddress = info.getIpAddress();
+            String gateWay = info.getGateway();
+            String netMask = info.getNetmask();
+            String dns1 = info.getDns1();
+            String dns2 = info.getDns2();
+
+            StaticIpConfiguration staticIpConfiguration = new StaticIpConfiguration();
+            try {
+                staticIpConfiguration.domains = netMask;
+                staticIpConfiguration.gateway = InetAddress.getByName(gateWay);
+                staticIpConfiguration.ipAddress = new LinkAddress(InetAddress.getByName(ipAddress), 24);
+                staticIpConfiguration.dnsServers.add(InetAddress.getByName(dns1));
+                staticIpConfiguration.dnsServers.add(InetAddress.getByName(dns2));
+            } catch (UnknownHostException e) {
+                e.printStackTrace();
+            }
+            ipConfiguration = new IpConfiguration(IpConfiguration.IpAssignment.STATIC, IpConfiguration.ProxySettings.NONE, staticIpConfiguration, null);
+
+            Settings.Global.putString(contentResolver, ETHERNET_STATIC_IP, ipAddress);
+            Settings.Global.putString(contentResolver, ETHERNET_STATIC_GATEWAY, gateWay);
+            Settings.Global.putString(contentResolver, ETHERNET_STATIC_NETMASK, netMask);
+            Settings.Global.putString(contentResolver, ETHERNET_STATIC_DNS1, dns1);
+            Settings.Global.putString(contentResolver, ETHERNET_STATIC_DNS2, dns2);
+            Settings.Global.putString(contentResolver, ETHERNET_IP_MODE, EthernetManager.ETHERNET_IP_MODE_STATIC);
+        } else {
+            ipConfiguration = mEthernetConfigStore.readIpAndProxyConfigurations();
+        }
+        setConfiguration(ipConfiguration);
+    }
```

这里调用了`EthernetNetworkFactory`的`changeInterfaceState()`方法，找到`frameworks/opt/net/ethernet/java/com/android/server/ethernet/EthernetNetworkFactory.java`文件，添加以下方法：

```
+    public void changeInterfaceState(boolean up) {
+        if (!TextUtils.isEmpty(mIface)) {
+            updateInterfaceState(mIface, up);
+        }
+    }
```

找到`packages/apps/Settings/src/com/android/settings/ethernet/EthernetSettings.java`文件，当切换太网模式时调用`EthernetManager`中的`setEthernetIPMode()`方法

```
if (KEY_ETHERNET_IP_MODE.equals(preference.getKey())) {
+            try {
+                String value = ((String) objValue);
+                if (value.equals(EthernetManager.ETHERNET_IP_MODE_STATIC)) {
+                    ViewGroup mParent = (ViewGroup) mDialogView.getParent();
+                    if (mParent != null) {
+                        mParent.removeAllViews();
+                    }
+                    mDialog = mBuilder.show();
+                    setDialogCanConnect();
+                } else if (value.equals(EthernetManager.ETHERNET_IP_MODE_DHCP)) {
+                    mEthernetManager.setEthernetIPMode(EthernetManager.ETHERNET_IP_MODE_DHCP, null);
+                    mEthernetModePreference.setValue(EthernetManager.ETHERNET_IP_MODE_DHCP);
+                    mEthernetModePreference.setSummary(getResources().getString(R.string.ethernet_ip_dhcp));
+                    refreshEthernetInfo(1500);
+                }
+            } catch (NumberFormatException e) {
+                Log.e(TAG, "could not persist screen timeout setting", e);
+            }


+    private void keepDialog(DialogInterface mDialogLongInterface) {
+        try {
+            Field field = mDialogLongInterface.getClass().getSuperclass().getDeclaredField("mShowing");
+            field.setAccessible(true);//将mShowing设置为false表示对话框已关闭
+            field.set(mDialogLongInterface, false);
+        } catch (Exception e) {
+            e.printStackTrace();
+        }
+    }
+
+
+    private void closeDialog(DialogInterface mDialogInterface) {
+        try {
+            Field field = mDialogInterface.getClass().getSuperclass().getDeclaredField("mShowing");
+            field.setAccessible(true);
+            field.set(mDialogInterface, true);
+            mDialogInterface.dismiss();
+        } catch (Exception e) {
+            e.printStackTrace();
+        }
+
+    }
+
+    private void setDialogCanConnect() {
+        if (mEthernetIPAdressEditText != null) {
+            ipAddress = mEthernetIPAdressEditText.getText().toString();
+        }
+        if (mEthernetGatewayEditText != null) {
+            gateWay = mEthernetGatewayEditText.getText().toString();
+        }
+        if (mEthernetNetmaskEditText != null) {
+            netMask = mEthernetNetmaskEditText.getText().toString();
+        }
+        if (mEthernetDNS1EditText != null) {
+            dns1 = mEthernetDNS1EditText.getText().toString();
+        }
+        if (mEthernetDNS2EditText != null) {
+            dns2 = mEthernetDNS2EditText.getText().toString();
+        }
+        if (!TextUtils.isEmpty(ipAddress) && !TextUtils.isEmpty(gateWay) && !TextUtils.isEmpty(netMask)
+                && (!TextUtils.isEmpty(dns1) || !TextUtils.isEmpty(dns2))) {
+            if (mDialog != null)
+                mDialog.getButton(DialogInterface.BUTTON_POSITIVE).setEnabled(true);
+        } else {
+            if (mDialog != null)
+                mDialog.getButton(DialogInterface.BUTTON_POSITIVE).setEnabled(false);
+        }
+    }
+
+    private void connect(DialogInterface dialog) {
+        ipAddress = mEthernetIPAdressEditText.getText().toString();
+        if (TextUtils.isEmpty(ipAddress) || !isValidIpAddress(ipAddress)) {
+            Toast.makeText(getActivity(), R.string.ethernet_ip_settings_invalid_ip, Toast.LENGTH_LONG).show();
+            keepDialog(dialog);
+            return;
+        }
+        gateWay = mEthernetGatewayEditText.getText().toString();
+        if (TextUtils.isEmpty(gateWay) || !isValidIpAddress(gateWay)) {
+            Toast.makeText(getActivity(), R.string.ethernet_ip_settings_invalid_ip, Toast.LENGTH_LONG).show();
+            keepDialog(dialog);
+            return;
+        }
+        netMask = mEthernetNetmaskEditText.getText().toString();
+        if (TextUtils.isEmpty(netMask) || !isValidIpAddress(netMask)) {
+            Toast.makeText(getActivity(), R.string.ethernet_ip_settings_invalid_ip, Toast.LENGTH_LONG).show();
+            keepDialog(dialog);
+            return;
+        }
+        dns1 = mEthernetDNS1EditText.getText().toString();
+        if (TextUtils.isEmpty(dns1) || !isValidIpAddress(dns1)) {
+            Toast.makeText(getActivity(), R.string.ethernet_ip_settings_invalid_ip, Toast.LENGTH_LONG).show();
+            keepDialog(dialog);
+            return;
+        }
+        dns2 = mEthernetDNS2EditText.getText().toString();
+        if (!TextUtils.isEmpty(dns2) && !isValidIpAddress(dns2)) {
+            Toast.makeText(getActivity(), R.string.ethernet_ip_settings_invalid_ip, Toast.LENGTH_LONG).show();
+            keepDialog(dialog);
+            return;
+        }
+
+        EthernetInfo info = new EthernetInfo();
+        info.setIpAddress(ipAddress);
+        info.setGateway(gateWay);
+        info.setNetmask(netMask);
+        info.setDns1(dns1);
+        info.setDns2(dns2);
+
+        mEthernetManager.setEthernetIPMode(EthernetManager.ETHERNET_IP_MODE_STATIC, info);
+        mEthernetModePreference.setSummary(getResources().getString(R.string.ethernet_ip_static));
+        mEthernetModePreference.setValue(EthernetManager.ETHERNET_IP_MODE_STATIC);
+
+        closeDialog(dialog);
+
+        refreshEthernetInfo(1500);
+    }
+
+    private boolean isValidIpAddress(String value) {
+
+        int start = 0;
+        int end = value.indexOf('.');
+        int numBlocks = 0;
+
+        while (start < value.length()) {
+
+            if (-1 == end) {
+                end = value.length();
+            }
+
+            try {
+                int block = Integer.parseInt(value.substring(start, end));
+                if ((block > 255) || (block < 0)) {
+                    Log.e(TAG, "isValidIpAddress() : invalid 'block', block = " + block);
+                    return false;
+                }
+            } catch (NumberFormatException e) {
+                Log.e(TAG, "isValidIpAddress() : e = " + e);
+                return false;
+            }
+
+            numBlocks++;
+
+            start = end + 1;
+            end = value.indexOf('.', start);
+        }
+
+        return numBlocks == 4;
+    }
+}
```

## 小结

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190413105311925.gif)

以上修改是以太网模块主要功能的实现，时间匆忙没有具体分析，就简单记录下。

功能实现不易，参考了许多资料：

[Android 6.0 Ethernet 流程分析记录](https://blog.csdn.net/zhanghaoyangchao/article/details/81779322)

[Android 以太网/有线网 Ethernet 功能开发](https://blog.csdn.net/Purple7826/article/details/80608172)

[Android 8.1 增加以太网设置功能](https://blog.csdn.net/cigogo/article/details/82751931)

这里提供补丁下载[android-6.0 以太网补丁](https://download.csdn.net/download/ctrl_s/11099615)，有兴趣的话可以去看看
