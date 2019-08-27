**问题一描述**

```
build/core/combo/mac_version.mk:39: * Can not find SDK 10.6 at /Developer/SDKs/MacOSX10.6.sdk
```

**解决方案**

应该是 Mac 的存储不区分大小写，导致下载的源码缺失文件，就将同名的小写文件拷贝一份就可以解决

```
ls -s external/kernel-headers/original/uapi/linux/netfilter/xt_tcpmss.h external/iptables/include/linux/netfilter/xt_TCPMSS.h
```

**问题一描述**

```
fatal error: ‘unistd.h’ file not found
fatal error: ‘stdlib.h’ file not found
```

**解决方案**
我在生成 MacOSX10.11.sdk 的链接时没有用命令行，直接“右键点击”>“制作替身”，然后修改名称，从而出现了上面的错误

```
sudo ln -s MacOSX10.11/ ./MacOSX10.11.sdk
```
