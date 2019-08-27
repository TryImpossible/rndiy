## 前言

由于下载的开源系统没有系统签名，所以不可能针对系统去做什么定制。
首先，要去下载 Android-x86-6.0 的系统源码，再去尝试编译系统，如果编译成功并且能够正常运行的话，才能研究去定制系统。反正吧，我觉得编译系统是定制系统的第一步。不多说了，先去下载系统源码吧！

## 安装 Git

由于 Mac 自带 Git 工具，就不介绍如何安装，可以考虑升级 Git 版本

使用 repo 工具下载源码时会要求设置用户名和邮箱，如果你使用过 Git，应该早就设置过

```
git config --global user.name "your name"
git config --global user.email "XXX@XXX.com"
```

## 安装 Repo

官方是通过 Repo 管理 Android-x86 的源代码，所以我们要先安装 Repo 工具。安装步骤如下：

1.在根目录下创建 bin 文件夹

```
mkdir ~/bin
```

2.配置系统环境变量（可临时配置）

```
vi ~/.bash_profile
添加 export PATH=~/bin:$PATH
```

3.下载 repo（自备梯子，翻墙）

```
git clone https://gerrit.googlesource.com/git-repo
```

4.将 git-repo 中的 repo 文件拷贝到 ~/bin 目录中

```
cd git-repo
cp repo ~/bin/
```

5.修改权限

```
chmod a+x ~/bin/repo
```

至此，repo 工具安装配置完成

## 下载 Android-x86-6.0 源代码

目前国内并没有提供 Android-x86 源代码的仓库，所以下载源码需要翻墙，请大家自备梯子。

### 创建 Android-x86-6.0 文件夹

```
mkdir ~/Android-x86-6.0
```

### 初始化仓库

```
From git://git.osdn.net/gitroot/android-x86/manifest
 * [new branch]      android-x86-1.6    -> origin/android-x86-1.6
 * [new branch]      android-x86-2.2    -> origin/android-x86-2.2
 * [new branch]      android-x86-2.2-r2 -> origin/android-x86-2.2-r2
 * [new branch]      android-x86-4.0-r1 -> origin/android-x86-4.0-r1
 * [new branch]      android-x86-4.4-r1 -> origin/android-x86-4.4-r1
 * [new branch]      android-x86-4.4-r2 -> origin/android-x86-4.4-r2
 * [new branch]      android-x86-4.4-r3 -> origin/android-x86-4.4-r3
 * [new branch]      android-x86-4.4-r4 -> origin/android-x86-4.4-r4
 * [new branch]      android-x86-4.4-r5 -> origin/android-x86-4.4-r5
 * [new branch]      android-x86-6.0-r1 -> origin/android-x86-6.0-r1
 * [new branch]      android-x86-6.0-r2 -> origin/android-x86-6.0-r2
 * [new branch]      android-x86-6.0-r3 -> origin/android-x86-6.0-r3
 * [new branch]      android-x86-7.1-r1 -> origin/android-x86-7.1-r1
 * [new branch]      android-x86-7.1-r2 -> origin/android-x86-7.1-r2
 * [new branch]      cm-x86-14.1-r1     -> origin/cm-x86-14.1-r1
 * [new branch]      cm-x86-14.1-r2     -> origin/cm-x86-14.1-r2
 * [new branch]      cupcake-x86        -> origin/cupcake-x86
 * [new branch]      donut-x86          -> origin/donut-x86
 * [new branch]      eclair-x86         -> origin/eclair-x86
 * [new branch]      froyo-x86          -> origin/froyo-x86
 * [new branch]      gingerbread-x86    -> origin/gingerbread-x86
 * [new branch]      honeycomb-x86      -> origin/honeycomb-x86
 * [new branch]      ics-x86            -> origin/ics-x86
 * [new branch]      jb-x86             -> origin/jb-x86
 * [new branch]      kitkat-x86         -> origin/kitkat-x86
 * [new branch]      lollipop-x86       -> origin/lollipop-x86
 * [new branch]      marshmallow-x86    -> origin/marshmallow-x86
 * [new branch]      multiwindow-oreo   -> origin/multiwindow-oreo
 * [new branch]      nougat-x86         -> origin/nougat-x86
 * [new branch]      oreo-x86           -> origin/oreo-x86
 * [new branch]      pie-x86            -> origin/pie-x86
```

如上所示，官网使用不同的分支来维护不同的版本的 Android 源码， 这里我只下载有关 Android-x86-6.0 的源码，我选择的分支是 marshmallow-x86

```
cd ~/Android-x86-6.0
repo init -u git://git.osdn.net/gitroot/android-x86/manifest -b marshmallow-x86
// -b 指定分支，不指定分支会拉取所有分支源码
```

**说明**: 由于网络原因国内的访问不了 google 的仓库，所以上面的 repo 命令（一个 python 脚本封装了 git 的命令）中的 REPO_URL = 'https://gerrit.googlesource.com/git-repo'改为 REPO_URL = 'git://git.omapzoom.org/git-repo.git'。

```
vi ~/bin/repo

replace
REPO_URL = 'https://gerrit.googlesource.com/git-repo'
to
REPO_URL = 'git://git.omapzoom.org/git-repo.git'
```

### 同步源码至本地

```
repo sync -f -j4 --no-tags --no-clone-bundle
// --no-tags:减少不需要的tag下载，可以缩减下载的代码量
// -f:当某个库因为网络原因货其他原因下载失败的时候可以继续进行，避免已经下载的代码不能写入到硬盘上
// -j4:开启4个线程来下载，这个根据CPU和硬盘的性能决定的
```

好了，让它慢慢下载吧。不出意外的话， 大概 3 小时左右就可以将 android-x86-6.0 的源码同步至本地。
如果意外中断的话，不用担心，使用该命令继续同步，直到成功为止。**强烈建议多同步几次，一定要确保代码完全同步了，防止编译过程遇到找不到文件的错误**

**特意关注了 android-x86-6.0 的源码大小，15G 左右**

## 搭建编译环境

由于我的 Mac Pro 配置难以支撑编译系统，所以申请了台服务器去编译系统。这里感谢公司的大力支持，为了编译系统和研究定制系统专门购买了服务器。关于如何查看服务器具体配置信息，请参考此篇文章[Linux 下查看服务器配置](https://blog.csdn.net/u011636440/article/details/78611838)

下面简单介绍下服务器的配置：
| | |
| ----------------- | ----------------------------------------- |
| 品牌 | 戴尔（DELL） |
| 型号 | PowerEdge R230 |
| 系统 | Ubuntu 16.04.6 LTS 64 位|
| CPU 型号 | Intel(R) Xeon(R) CPU E3-1220 v6 @ 3.00GHz |
| 物理 CPU 个数 | 1 |
| 单个物理 CPU 核数 | 4 核 |
| 逻辑 CPU 的个数 | 4，即单个物理 CPU 核数 x 物理 CPU 个数 |
| 硬盘大小 | 1T |
| 内存大小 | 8G|

如上所示，是在 Ubuntu 16.04.5 LTS 系统上编译 Android-x86-6.0

### 硬件要求

1.编译 2.3.x 以上的版本要求 64 位的操作系统，2.3.x 以下的版本 32 位操作系统即可。

2.磁盘空间官方要求至少 100GB 以上，越大越好

### 软件要求

1.操作系统

官方是使用 Ubuntu 系统开发和测试的，这里同样使用 Ubuntu 系统编译

特别说明，不同的 Ubuntu 系统可以编译的 Android 版本
|Android 版本|编译要求的 Ubuntu 最低版本|
|-|-|
|Android 6.0 至 AOSP master| Ubuntu 14.04 |
|Android 2.3.x 至 Android 5.x| Ubuntu 12.04|
|Android 1.5 至 Android 2.2.x| Ubuntu 10.0|

2.JDK 版本

特别说明，编译不同 Android 版本的源码对应的 JDK 版本
|Android 版本|编译要求的 JDK 版本|
|-|-|
|AOSP 的 Android 主线|OpenJDK 8|
|Android 5.x 至 android 6.0| OpenJDK 7|
|Android 2.3.x 至 Android 4.4.x| Oracle JDK 6|
|Android 1.5 至 Android 2.2.x| Oracle JDK 5|

我现在编译的是 Android-x86-6.0 的系统，需要安装 OpenJDK 7。但是在 Ubuntu 15.04 及之后的版本的在线安装库中只支持 openjdk8 和 openjdk9 的安装，因此想要安装 openjdk 7 需要首先设置 ppa:

```
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
```

设置成功后，直接安装

```
sudo apt-get install openjdk-7-jdk
```

如果编译 android 6.0 以上版本，需要安装 openjdk8：

```
sudo apt-get update
sudo apt-get install openjdk-8-jdk
```

如果需要编译不同版本的 android 系统，需要切换不同的 jdk 版本：

```
sudo update-alternative --config java
sudo update-alternative --config javac
```

3.其它要求
这里就不介绍其它 Ubuntu 版本需要添加的依赖，如有需要参考[Google 官方构建编译环境指南](https://source.android.com/setup/build/initializing)。下面是 Ubuntu16.04 需要添加的依赖:

```
sudo apt-get install -y libx11-dev:i386 libreadline6-dev:i386 libgl1-mesa-dev g++-multilib
sudo apt-get install -y git flex bison gperf build-essential libncurses5-dev:i386
sudo apt-get install -y tofrodos python-markdown libxml2-utils xsltproc zlib1g-dev:i386
sudo apt-get install -y dpkg-dev libsdl1.2-dev libesd0-dev
sudo apt-get install -y git-core gnupg flex bison gperf build-essential
sudo apt-get install -y zip curl zlib1g-dev gcc-multilib g++-multilib
sudo apt-get install -y libc6-dev-i386
sudo apt-get install -y lib32ncurses5-dev x11proto-core-dev libx11-dev
sudo apt-get install -y libgl1-mesa-dev libxml2-utils xsltproc unzip m4
sudo apt-get install -y lib32z-dev ccache
```

## 编译源码

由于 Android-x86-6.0 的源码我是下载至 Mac Pro 的，但是我要在 Ubuntu 服务器上编译，所以我要把源码上传到服务器。这里我直接使用`scp`命令进行文件传输：

```
scp -r ~/android-x86-6.0/ barry@192.168.1.52:/home/barry/
```

这样就直接将 android-x86-6.0 目录复制到 barry 目录下，现在源码传输也完成了

### 设置编译环境

切换到源码根目录下，执行以下命令：

```
source build/envsetup.sh
```

结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190313205902746.png)

命令执行成功后，会得到一些常用的命令，像 lunch、mmm、mm 等。

### 选择编译目标

执行以下命令：

```
lunch
```

结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190313210401418.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

这里我直接选择对应的数字 10 或 android_x86_64-eng，编译 64 位的工程师版本。结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190313210943131.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

这样就选择好了需要编译的目标。

这里讲解下 lunch 命令，lunch 后面可以直接加参数，像`lunch android_x86_64-eng`这样，格式为`lunch $TARGET_PRODUCT-$TARGET_BUILD_VARIANT`。

**TARGET_PRODUCT**

TARGET_PRODUCT 指的编译出的镜像搭载的运行环境，其中 aosp 代表 Android 的开源项目，arm 表示系统是运行在 arm 架构的处理器上，arm64 则是指 64 位 arm 架构处理器，x86 则表示 x86 架构的处理器。这里我们选择的 android_x86 就是指运行在 x86 架构处理器上。

**TARGET_BUILD_VARIANT**

TARGET_BUILD_VARIANT 指的是编译类型，一般是三种:

- -user：代表编译的系统镜像是可以正式发布到市场的版本，权限被限制，像没有 root 权限、不能 debug 等
- -userdebug：在 user 版本的基础上开放了 root 权限和 debug 权限
- -eng：代表开发工程师的版本(engineer)，拥有最大的权限(root 等)，此外还附带了许多 debug 工具

### 开始编译

**小提示**

执行以下命令，指打开编译缓存，可以提高编译的效率

```
echo export USE_CCACHE=1 >> ~/.bashrc

export USE_CCACHE=1
```

**编译指令**

执行 make 指令进行代码编译：

```
make -j8 iso_img
```

-j 参数来设置参与编译的线程数量，以提高编译速度，这里我开启 8 个线程同时编译

ios_img 参数是直接将编译完成 android 系统打包成 iso 镜像，这样可以直接通过制作 U 盘启动安装在 X86 的 PC 机上

**_说明_** 参与编译的线程个数是根据你机器 cup 的核心来确定的：core\*2，即当前 cpu 的核心的 2 倍.比如 Ubuntu 服务器是单核四线程，所以最快是启用 8 个线程去编译

**_建议_** 首次编译时最好不开启多线程编译，会导致某些报错信息被隐藏，难以定位编译错误

**编译结果**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314100522828.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

如果编译过程中没有出现错误的话(我想这基本不可能)，几个小时后就可以编译完成。如上图所示，当前你看 built successfully 此类信息，那么恭喜你编译成功了。

**关于模块编译，使用`mmm`或`mm`指令**

`mmm`: 编译指定模块，需要传入模块路径，像`mmm external/iptables`这样

`mm`: 编译当前模块，即当前目录下的模块，不需要传入模块路径，像`cd external && mm ./`这样

## 运行系统

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314103636263.gif)

具体关于如何安装并且运行 Android-x86-6.0，请参考[如何安装 x86-6.0]()

## 编译错误

说到编译过程真是一把辛酸泪，就遇到各种错误，乍一看你完全不知道怎么回事的。没办法只能 google，还好遇到错误的不止我一个，网上还是解决方案的。这里推荐下[google 关于 android-x86 的论坛](https://groups.google.com/forum/#!forum/android-x86)，上面可以找到很多有用的信息。

既然遇到了这么多错误，也就记录下来，既当作总结也方便其它人。

**问题一描述**

```
/usr/local/bin/make target-files-package -j4
```

Ubuntu16.04 中自带的 make 版本过高，导致无法识别源码中 Makefile 部分语法。 这里查看服务器的 make 版本为 4.1，需要降低 make 版本为 3.8.1

**解决方案**

- 下载 [make 3.8.1](https://ftp.gnu.org/gnu/make/)，并且解压
- cd make 3.81，切换你的解压路径
- ./configure
- make
- sudo make install

这样 make 降版本就成功了，使用`make -v`查看当前版本

**问题二描述**

```
In file included from out/target/product/x86/obj/STATIC_LIBRARIES/libext4_intermediates/libipt_ECN.c:11:0:
external/iptables/extensions/../include/linux/netfilter_ipv4/ipt_ECN.h:13:37: fatal error: linux/netfilter/xt_DSCP.h: No such file or directory
 #include <linux/netfilter/xt_DSCP.h>
                                     ^
compilation terminated.
```

**解决方案**

应该是 Mac 的存储不区分大小写，导致下载的源码缺失文件，就将同名的小写文件拷贝一份就可以解决

```
cd external/iptables/extensions/../include/linux/netfilter
ln -s xt_dscp.h xt_DSCP.h
```

**问题三描述**

```
Error: out/target/common/obj/JAVA_LIBRARIES/framework_intermediates/classes.jar: unknown package name of class file org/android_x86/analytics/AnalyticsHelper$1.class
```

**解决方案**

```
vi build/core/tasks/check_boot_jars/package_whitelist.txt
末尾插入`org\.android_x86\.analytics`
```

**问题四描述**

```
make[4]: *** No rule to make target `net/netfilter/xt_TCPMSS.o', needed by `net/netfilter/built-in.o'.  Stop.
make[3]: *** [net/netfilter] Error 2
make[2]: *** [net] Error 2
```

**解决方案**

应该是 Mac 的存储不区分大小写，导致下载的源码缺失文件，就将同名的小写文件拷贝一份就可以解决

```
cd kernel/net/netfilter/
ln -s xt_tcpmss.c xt_TCPMSS.c
```

**问题五描述**

```
error: linux/netfilter/xt_TCPMSS.h: No such file or directory
```

**解决方案**

应该是 Mac 的存储不区分大小写，导致下载的源码缺失文件，就将同名的小写文件拷贝一份就可以解决

```
ls -s external/kernel-headers/original/uapi/linux/netfilter/xt_tcpmss.h external/iptables/include/linux/netfilter/xt_TCPMSS.h
```

**问题六描述**

```
sid_tables.h: No such file or directory
```

**解决方案**

这个问题非常诡异，我使用`make`单个线程编译一定会出现，当我使用`make -j8`多个线程编译的话就不会出现，真是辛酸阿。如果这样解决不了的话，请尝试下面的方法：

```
方式一：
cd ./external/mesa/src/amd/common
python sid_tables.py sid.h > sid_tables.h
cd external/mesa/src/intel/genxml/
python gen_pack_header.py gen*.xml > gen*_pack.h # *代表文件中gen的文件，都手动python执行

方式二：
vi ./external/mesa/src/amd/Android.common.mk
line 41, add $(LOCAL_GENERATED_SOURCES): MESA_SID_TABLE_H := $(addprefix $(call local-generated-sources-dir)/, \common/sid_tables.h)
vi external/mesa/src/gallium/drivers/radeonsi/Android.mk
line 44, add LOCAL_GENERATED_SOURCES += $(MESA_SID_TABLE_H)
```

**问题七描述**

```
target StaticLib: libmesa_pipe_svga (out/target/product/x86/obj/STATIC_LIBRARIES/libmesa_pipe_svga_intermediates/libmesa_pipe_svga.a)
Traceback (most recent call last):
  File "external/mesa/src/compiler/glsl/ir_expression_operation.py", line 24, in <module>
    import mako.template
ImportError: No module named mako.template
make: *** [out/target/product/x86/gen/STATIC_LIBRARIES/libmesa_glsl_intermediates/glsl/ir_expression_operation.h] Error 1
make: *** Deleting file `out/target/product/x86/gen/STATIC_LIBRARIES/libmesa_glsl_intermediates/glsl/ir_expression_operation.h'
```

**解决方案**

```
sudo apt-get install python-mako
```

**问题八描述**

```
xgettext -L C --from-code utf-8 -o out/target/product/x86/gen/STATIC_LIBRARIES/libmesa_dri_common_intermediates/xmlpool.pot external/mesa/src/mesa/drivers/dri/common/xmlpool/t_options.h
/bin/bash: xgettext: command not found
make: *** [out/target/product/x86/gen/STATIC_LIBRARIES/libmesa_dri_common_intermediates/xmlpool.pot] Error 127
```

**解决方数**

```
sudo apt-get install xgettext
```

**问题九描述**

```
external/mesa/src/egl/drivers/dri2/platform_android.c:37:23: fatal error: sync/sync.h: No such file or directory
 #include <sync/sync.h>
                       ^
compilation terminated.
```

**解决方案**

```
vi external/mesa/src/egl/Android.mk

LOCAL_C_INCLUDES 下添加 $(MESA_TOP)/../../system/core/libsync/include

- $(MESA_TOP)/src/gallium/include
+ $(MESA_TOP)/src/gallium/include \
+ $(MESA_TOP)/../../system/core/libsync/include
```

**问题十描述**

```
/bin/sh: 1: bc: not found
make[3]: *** [include/generated/timeconst.h] Error 127
```

**解决方案**

```
sudo apt-get update
sudo apt-get install bc
```

**问题十一描述**

```
 ERROR: /home/barry/Android-x86/marshmallow-x86/packages/apps/PackageInstaller/src/com/android/packageinstaller/permission/ui/OverlayTouchActivity.java:18: The import android.view.WindowManager.LayoutParams.PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS cannot be resolved
ERROR: /home/barry/Android-x86/marshmallow-x86/packages/apps/PackageInstaller/src/com/android/packageinstaller/permission/ui/OverlayTouchActivity.java:35: PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS cannot be resolved to a variable
make: *** [out/target/common/obj/APPS/PackageInstaller_intermediates/with-local/classes.dex] Error 41
```

**解决方案**

使用`grep`搜索了下，源码里的确没有`PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS`常量。

```
执行 `vi packages/apps/PackageInstaller/src/com/android/packageinstaller/permission/ui/OverlayTouchActivity.java`指令，编辑`OverlayTouchActivity.java`文件

注释以下代码
package com.android.packageinstaller.permission.ui;

-import static android.view.WindowManager.LayoutParams.PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS;
+// import static android.view.WindowManager.LayoutParams.PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS;

 import android.app.Activity;
 import android.content.Intent;
@@ -30,11 +30,11 @@ public class OverlayTouchActivity extends Activity {
         return mObscuredTouch;
     }

-    @Override
-    protected void onCreate(Bundle savedInstanceState) {
-        getWindow().addPrivateFlags(PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS);
-        super.onCreate(savedInstanceState);
-    }
+    // @Override
+    // protected void onCreate(Bundle savedInstanceState) {
+       // getWindow().addPrivateFlags(PRIVATE_FLAG_HIDE_NON_SYSTEM_OVERLAY_WINDOWS);
+       // super.onCreate(savedInstanceState);
+    // }
```

**问题十二描述**

```
/bin/bash: genisoimage: command not found
```

**解决方案**

制作 iso 镜像文件需要的添加的依赖

```
sudo apt-get install genisoimage

```

**问题十三描述**

```
/bin/bash: isohybrid: command not found
isohybrid not found.
Install syslinux 4.0 or higher if you want to build a usb bootable iso.


out/target/product/x86/android_x86.iso is built successfully.

用编译好的 iso 镜像文件制作 U 盘启动盘，安装在 x86 主板上不能启动
```

**解决方案**

官网介绍编译的 x86 镜像是支持混合 iso 格式，也就是说 iso 可以直接转储到 usb 磁盘上，但是前提需要我们将 iso 镜像转成混合模式的。下面分别介绍在 windows 和 linux 下转化方法：

```
sudo apt-get install syslinux-utils

windows，使用 rufus 第三方软件
linux， 使用 isohybrid 命令，例如 isohybrid ~/xxx.iso
```

**特别注意，一定要看**

其中，问题二、三、四、五都是 Mac 系统不区分大小写造成的，而且即使修复这些问题编译出来的系统也不能正常工作，存在 Bug。因为不区分大小写，许多文件下载的时候都不会写入。 我遇到过编译成功的系统网络不能正常工作，后来我将我的 Mac Pro 分割出一个**识别大小的分区**，这样编译出来的系统才是正常的。

## 总结

OK，至此 Android-x8-6.0 源码的编译就大功告成了，接下来我们就可以随心所欲地阅读和修改源码内容，定制 Android 系统了！
