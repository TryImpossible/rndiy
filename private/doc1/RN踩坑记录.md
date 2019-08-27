> 最近准备在搭建 RN 脚手架工程，不出意外又踩了很多坑。现在特别简单记录下，当作学习了。

### 'React/RCTBridgeModule.h' file not found

1. 找到 TARGETS -> Build Settings -> Header Search Paths，
   添加 `"$(SRCROOT)/../node_modules/react-native/React" recursive`
2. 找到 TARGETS -> Build Phases -> Target Dependencies,
   添加 `React`
3. Product -> Build,重新构建一遍
