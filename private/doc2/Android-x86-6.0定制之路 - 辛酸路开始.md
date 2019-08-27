## 什么是 Android-x86

对于 Android，相信大家应该是非常熟悉的！对整天使用 Android 的手机我们而言，想不知道 Android 都不可能。但是什么是 Android-x86 呢？可能有少数人听说过，现在就来普及下有关 Android-x86 的相关知识。Android-x86 是运行于 x86 PC 上的 Android 操作系统，目前已经支持大部分安卓程序。Android X86 平台是由 Beyounn 和 Cwhuang 主持设计的。项目的主要目的在于为 X86 平台提供一套完整的 Android 系统解决方案。

## 为什么定制 Android-x86

个人在公司是从事有关点餐 App 的开发，使用的是 ReactNative 语言开发且运行在 Android 平台上。不同于安卓手机，我们的 App 是安装在[kiosk](https://baike.baidu.com/item/kiosk/9372535?fr=aladdin)设备上，所谓 kiosk 就是一种自助服务机， 就像 KFC 的点餐机一样。最近公司领导决定在 x86 的 PC 机上运行 Android 系统，我作为开发人员也没太当回事，主要还是不了解这方面，然后各种坑就开始了。

- 购买的 x86 主板出厂安装的是 windows 系统 ，想办法下载了[ android-x86_64-6.0-r2.iso](http://www.android-x86.org/download)的系统，然后各种捣腾终于在 X86 的主板上成功运行 Android-x86 系统
- 原本的 App 接入了各种硬件设备，像什么扫码器、打印机等，坑的是部分硬件设备的 so 库并不支持 x86 的架构 ，后来联系硬件厂商终于让我们的 App 在 x86 的架构上成功运行
- 开源的 android-x86_64-6.0 系统，有许多 kiosk 设备需要的功能都不支持：
  - 屏幕方向切换
  - 屏幕保持常亮
  - 设置以太网静态 IP
  - 动态显示、隐藏状态栏与导航栏
  - 去掉各种权限请求弹窗，静默授权
  - 还有.....

面对以上问题，在当前的开源系统是没法解决的，于是定制 Android-x86 系统是不可避免的了。我只是个小前端，也就稍微懂点 Android 开发的， 对于定制 Android 系统真是一脸懵逼。没法阿，领导要求做只好硬着头皮上了，于是我的系统定制之路就这么稀里糊涂的开始了。

## 小侃一下

现在想想，当时自己心真是大阿，研究系统这种活都敢接，佩服当时的自己。但是说真的，在研究系统过程中自己学到许多东西，是很大的收获。趁现在有时间，我就简单记录下来，也算是对自己前段时间的总结吧。

[在 Ubuntu 16.04.5 上编译 Android-x86-6.0](https://blog.csdn.net/Ctrl_S/article/details/88669461)

[如何在 PC 机上安装 Android-x86-6.0](https://blog.csdn.net/Ctrl_S/article/details/88669489)

[如何管理 Android-x86-6.0 源码](https://blog.csdn.net/Ctrl_S/article/details/88688186)

[Android-x86-6.0 如何让屏幕永不休眠](https://blog.csdn.net/Ctrl_S/article/details/89147001)

[Android-x86-6.0 如何动态显示、隐藏状态栏和导航栏](https://blog.csdn.net/Ctrl_S/article/details/89161779)

[Android-x86-6.0 屏幕旋转功能](https://blog.csdn.net/Ctrl_S/article/details/89230857)

[Android-x86-6.0 如何绕过 USB 权限弹窗实现静默授权](https://blog.csdn.net/Ctrl_S/article/details/89220124)

[Android-x86-6.0 以太网设置静态 ip](https://blog.csdn.net/Ctrl_S/article/details/89279391)

## android-x86-6.0.iso

链接:https://pan.baidu.com/s/145LFi5DINvyRgGrq1a6C0g 密码:0oah
