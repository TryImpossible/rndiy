**问题一描述**

```
In file included from out/target/product/x86/obj/STATIC_LIBRARIES/libext4_intermediates/libipt_ECN.c:11:
external/iptables/extensions/../include/linux/netfilter_ipv4/ipt_ECN.h:13:10: fatal error: 'linux/netfilter/xt_DSCP.h' file not found
#include <linux/netfilter/xt_DSCP.h>
         ^~~~~~~~~~~~~~~~~~~~~~~~~~~
1 error generated.
```

**解决方案**

```
cd external/iptables/extensions/../include/linux/netfilter
ln -s xt_dscp.h xt_DSCP.h
```

**问题二描述**

```
kernel/scripts/extract-cert.c:21:25: fatal error: openssl/bio.h: No such file or directory
compilation terminated.
```

**解决方案**

```
sudo apt install libssl-dev
```

**问题三描述**

```
make[3]: *** No rule to make target 'net/netfilter/xt_TCPMSS.o', needed by 'net/netfilter/built-in.a'.  Stop.
```

**解决方案**

```
cd kernel/net/netfilter/
ln -s xt_tcpmss.c xt_TCPMSS.c
```

**问题四描述**

```
frameworks/av/media/libstagefright/DataSource.cpp:29:10: fatal error: 'media/stagefright/DataURISource.h' file not found
#include <media/stagefright/DataURISource.h>
         ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1 error generated.
```

**解决方案**

```
1. cd frameworks/av/media/libstagefright/include/media/stagefright
2. vi DataURISource.h，插入https://android.googlesource.com/platform/frameworks/av/+/65842db06c2d77e53cc5ac61692160d844cc7d0a/include/media/stagefright/DataURISource.h的代码
```

**问题五**

```
Error: out/target/common/obj/JAVA_LIBRARIES/framework_intermediates/classes.jar contains class file org/android_x86/analytics/AnalyticsHelper$1.class, which is not in the whitelist
```

**解决方案**

```
vi build/core/tasks/check_boot_jars/package_whitelist.txt
末尾添加`org\.android_x86\.analytics`
```

**问题六**

```
Out of memory error (version 1.3-rc7 'Douarn' (445000 d7be3910514558d6715ce455ce0861ae2f56925a by android-jack-team@google.com)).
GC overhead limit exceeded.
Try increasing heap size with java option '-Xmx<size>'.
```

**解决方案**

```
在文件/prebuilts/sdk/tools/jack-admin中修正-Xmx参数。
修改变量JACK_SERVER_VM_ARGUMENTS，添加参数 -Xmx2048M
JACK_SERVER_VM_ARGUMENTS="${JACK_SERVER_VM_ARGUMENTS:=-Dfile.encoding=UTF-8 -XX:+TieredCompilation -mx2048M}"

export JACK_SERVER_VM_ARGUMENTS="-Dfile.encoding=UTF-8 -XX:+TieredCompilation -Xmx4g"
./prebuilts/sdk/tools/jack-admin kill-server
./prebuilts/sdk/tools/jack-admin start-server
```

**问题七**

```
iptables: iptables v1.4.20: unknown option "--set-mark"

03-04 11:17:16.996  1032  1361 E Netd    : exec() res=0, status=512 for /system/bin/iptables -w -t mangle -A INPUT -i eth0 -j MARK --set-mark 0x30064
```

**解决方案**

```
https://www.netfilter.org/projects/iptables/downloads.html
去官网下载支持"--set-mark"参数的版本，替换 /external/下的iptables文件夹
```
