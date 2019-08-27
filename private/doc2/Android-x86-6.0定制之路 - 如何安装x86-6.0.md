## 前言

为了更好的演示如何安装 Android-x86-6.0，我选择在 VirtualBox 虚拟机上安装。在 PC 机上安装的话，跟在虚拟机里的安装操作是一样的，大家有兴趣可以尝试的。

## 下载安装 VirtualBox

VirtualBox 官网： https://www.virtualbox.org/wiki/Downloads

关于如何下载安装 VirtualBox，请参考[官网教程](https://www.virtualbox.org/wiki/Downloads)

## 准备 Android-x86-6.0 镜像

镜像的话，使用我编译好的 Android-x86-6.0 镜像。

## 创建和配置 Android-x86-6.0 虚拟机

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314193102725.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

创建虚拟机，填写名称、类型和版本后，点击纠结

![在这里插入图片描述](https://img-blog.csdnimg.cn/201903141932151.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

内存默认 512MB，如需要改下内存大小，点击继续

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314193408754.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

默认，点击继续

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314193446484.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

默认，点击继续

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019031419353046.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

默认动态分配，同时也建议动态分配硬盘，点击继续

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314193635710.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

确认下名称和硬盘大小，点击建立，最后虚拟机就创建完成了

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314203145218.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

更改开机启动顺序：硬盘 -> 光盘 -> 软盘，确认内存大小，点击确定

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314194202430.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

启用 3D 加速，点击确

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314194612813.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选中 android_x86.iso，点击右侧的光盘图标选择镜像文件，点击确定

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019031419431960.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

勾选启用网卡，选择桥接介面卡和电脑使用的网卡，点击确定。这样，Android-x86-6.0 虚拟机的配置也就完成了

## 安装过程

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195123488.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

忽略前面三项，选择最后一项进行安装

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195300632.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择`Create/Modify partitions`，创建分区

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195411109.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

默认 No，**不要选择 Yes**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314202722185.gif)

选择 New -> Primary -> Bootable，指创建分区、设置为主分区并设置为可引导分区

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195746418.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

设置 New -> Primary -> Bootable 成功后，出现图中箭头标识

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195859867.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择 Write，写入分区表等信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314195948309.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

分区操作完成后，选择 Quit 即可

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200034110.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择刚刚创建好的分区 sda1，点击 OK

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200140131.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择以 ext4 格式化分区，点击 OK

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200258386.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

点击 Yes，开始格式化

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200454925.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择 Yes，安装 GRUB 引导加载程序

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200600669.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

如果需要 debugging 系统，选择 Yes

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200719943.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

等进度 100%，安装就完成了

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200753751.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

选择 Reboot，点击 OK

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314200845301.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

这是我 3 月 14 号编译成功的 Android-x86-6.0 系统，选择第一项，回车即可进入

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190314103636263.gif)

运行演示

## 总结

整个 Android-x86-6.0 的安装就完成了，也没啥好说的，就是多折腾吧。
折腾的多了，懂得也会越来越多，长知识吧！
