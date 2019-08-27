## 前言

单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证，一般针对的是函数、类或单个组件，不涉及系统和集成。单元测试是软件测试的基础测试，进行充分的单元测试，是提高软件质量，降低开发成本的必由之路。对于程序员来说，如果养成了对自己写的代码进行单元测试的习惯，不但可以写出高质量的代码，而且还能提高编程水平。所以说单元测试是软件开发当中不可缺少的环节。

针对 RN 的单元测试，主要使用的是 FaceBook 推出的 Jest 框架，Jest 是基于 Jasmine 的 JavaScript 测试框架，是 React.js 默认的单元测试框架。相比其它框架，具有以下特点：

- 适应性：Jest 是模块化、可扩展和可配置的；
- 沙箱和快速：Jest 虚拟化了 JavaScript 的环境，能模拟浏览器，并且并行执行；
- 快照测试：Jest 能够对 React 树进行快照或别的序列化数值快速编写测试，提供快速更新的用户体验；
- 支持异步代码测试：支持 promises 和 async/await；
- 自动生成静态分析结果：不仅显示测试用例执行结果，也显示语句、分支、函数等覆盖率

## Jest 环境搭建

### Jest

在工程目录下执行以下命令安装 Jest

```
npm install --save-dev jest

# or

yarn add --dev jest
```

在`package.json` 插入以下代码

```
"scripts": {
  "test": "jest"
},
"jest": {
  "preset": "react-native"
}
```

### Babel

现在大多的项目都用 es6 及以上的版本编写的，为了兼容老版本， 我们使用 Babel 将 es6 的语法转换为 es5。

**Babel 版本 7 以下**，在工程目录下执行以下命令安装

```
yarn add -dev babel-jest babel-core regenerator-runtime
```

**Babel 版本 7**，在工程目录下执行以下命令安装

```
yarn add --dev babel-jest babel-core@^7.0.0-bridge.0 @babel/core regenerator-runtime
```

在工程目录下新建`.babelrc`文件并插入以下代码

```
{
  "presets": ["react-native"],
  "sourceMaps":true  // 用于对齐堆栈，精准的定位单元测试中的问题
}
```

至此，环境搭建基本结束，是不是很简单？

### 小惊喜

如果你使用的 RN 的版本是 0.38 以上，那么恭喜你上面所有的步骤都可以省略了。

RN 版本从 0.38 开始，在使用`react-native init`创建项目时会自动添加 jest、babel 依赖，无须手动安装

这是脚手架工程完整配置，仅供参考

**package.json**

```
{
  "name": "rndiy",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "test": "node node_modules/jest/bin/jest.js",
    "tsc": "node node_modules/typescript/lib/tsc.js",
    "prettier": "node node_modules/prettier/bin-prettier.js",
    "lint": "node node_modules/tslint/bin/tslint -p ./tsconfig.json -c tslint.json"
  },
  "dependencies": {
    "react": "16.6.3",
    "react-native": "0.58.5"
  },
  "devDependencies": {
    "@types/jest": "^24.0.6",
    "@types/react": "^16.8.4",
    "@types/react-native": "^0.57.37",
    "@types/react-test-renderer": "^16.8.1",
    "babel-jest": "^24.1.0",
    "husky": "^1.3.1",
    "jest": "^24.1.0",
    "lint-staged": "^8.1.4",
    "metro-react-native-babel-preset": "^0.52.0",
    "prettier": "1.16.4",
    "react-addons-test-utils": "^15.6.2",
    "react-native-typescript-transformer": "^1.2.11",
    "react-test-renderer": "16.8.1",
    "ts-jest": "^24.0.0",
    "tslint": "^5.12.1",
    "tslint-config-prettier": "^1.18.0",
    "tslint-eslint-rules": "^5.4.0",
    "tslint-lines-between-class-members": "^1.3.1",
    "tslint-plugin-prettier": "^2.0.1",
    "tslint-react": "^3.6.0",
    "typescript": "^3.3.3"
  }
}
```

由于脚手架工程使用`typescript`编写，执行`yarn add -dev ts-jest @types/jest @types/react @types/react-native @types/react-test-renderer`安装其它依赖

**jest.config.js**

```
module.exports = {
  rootDir: './',
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  // testMatch: ['<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'], // 只查找__tests__文件夹
  // testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$', // testRegex和testMatch不能同时使用
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  cacheDirectory: '.jest/cache',
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: ['TS2531']
      }
    }
  }
};
```

**babel.config.js**

```
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};
```

## Jest 单元测试

在工程根目录下创建`__tests__`文件夹，使用`react-native init`且 RN 版本在 0.38 以上会自动创建的

### 简单示例

先不涉及业务逻辑，我们来简单介绍下如何在 RN 里使用下 jest

在`src/utilities`创建`StringUtils.ts`文件，编写如下代码

```
/**
 * 是否为空
 * @param str
 */
export const isEmpty = (str: string) => str.length === 0;

/**
 * 是否为空白
 * @param str
 */
export const isBlank = (str: string) => trim(str).length === 0;

/**
 * 是否相等
 * @param str1
 * @param str2
 */
export const equals = (str1: string, str2: string) => str1 === str2;

/**
 * 反转字符串
 * @param str
 */
export const reverse = (str: string) =>
  str
    .split('')
    .reverse()
    .join('');

/**
 * 去除全部空格
 * @param str
 */
export const trim = (str: string) => str.replace(/\s+/g, '');
```

在`__tests__`文件夹下创建`StringUtil.test.ts`文件

```
import { equals, isBlank, isEmpty, reverse, trim } from '../src/utilities/StringUtil';

test('test equals', () => {
  const a = '123';
  const b = '123';
  expect(equals(a, b)).toBeTruthy();
});

test('test isBlank', () => {
  const a = '  ';
  expect(isBlank(a)).toBeTruthy();
});

test('test isEmpty', () => {
  const a = '';
  expect(isEmpty(a)).toBeTruthy();
});

test('test reverse', () => {
  const a = 'abc';
  expect(reverse(a)).toBe('cba');
});

test('test trim', () => {
  const a = 'a b c';
  expect(trim(a)).toBe('abc');
});
```

执行`yarn test`命令，系统就会开始执行单元测试，如图所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190225192832422.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

**关于图中 ts-jest[main]（WARN），在工程根目录下找到 jest 的配置文件 jest.config.js，将 transform 对象下的`'\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'`替换为`'\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'`即可**

### 快照测试

快照测试是测试在不同逻辑下的界面渲染结果，会直接生成 DOM 树

这里就简单修改下`App.tsx`，编写个带有逻辑的组件，代码如下：

```
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

interface AppState {
  welcome: string;
}

export default class App extends Component<{}, AppState> {
  onPress: () => void;

  constructor(props: any) {
    super(props);
    this.state = {
      welcome: 'Welcome to React Native!'
    };
    this.onPress = () => this.setState({ welcome: 'Welcome to Use Jest!' });
  }

  render() {
    const { welcome } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{welcome}</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text onPress={this.onPress}>点我吖</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 15
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
```

简单说明下，App 组件有两种状态，初始状态和点击状态，根据状态渲染不同的界面

在`__tests__`文件夹下创建`App.test.js`文件，编写如下代码：

```
import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

it('renders correctly with defaults', () => {
  const compoent = renderer.create(<App />);
  let tree = compoent.toJSON();
  expect(tree).toMatchSnapshot();

  tree.children[3].props.onPress(); // 触发点击事件
  tree = compoent.toJSON();
  expect(tree).toMatchSnapshot();
});
```

执行`yarn test`命令，会在`__tests__/__snapshots__`文件夹下生成`App.test.tsx.snap`快照文件，快照文件如下：

```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`renders correctly with defaults 1`] = `
<View
  style={
    Object {
      "alignItems": "center",
      "backgroundColor": "#F5FCFF",
      "flex": 1,
      "justifyContent": "center",
    }
  }
>
  <Text
    style={
      Object {
        "fontSize": 20,
        "margin": 15,
        "textAlign": "center",
      }
    }
  >
    Welcome to React Native!
  </Text>
  <Text
    style={
      Object {
        "color": "#333333",
        "marginBottom": 5,
        "textAlign": "center",
      }
    }
  >
    To get started, edit App.js
  </Text>
  <Text
    style={
      Object {
        "color": "#333333",
        "marginBottom": 5,
        "textAlign": "center",
      }
    }
  >
    Press Cmd+R to reload,
Cmd+D or shake for dev menu
  </Text>
  <Text
    onPress={[Function]}
  >
    点我吖
  </Text>
</View>
`;

exports[`renders correctly with defaults 2`] = `
<View
  style={
    Object {
      "alignItems": "center",
      "backgroundColor": "#F5FCFF",
      "flex": 1,
      "justifyContent": "center",
    }
  }
>
  <Text
    style={
      Object {
        "fontSize": 20,
        "margin": 15,
        "textAlign": "center",
      }
    }
  >
    Welcome to Use Jest!
  </Text>
  <Text
    style={
      Object {
        "color": "#333333",
        "marginBottom": 5,
        "textAlign": "center",
      }
    }
  >
    To get started, edit App.js
  </Text>
  <Text
    style={
      Object {
        "color": "#333333",
        "marginBottom": 5,
        "textAlign": "center",
      }
    }
  >
    Press Cmd+R to reload,
Cmd+D or shake for dev menu
  </Text>
  <Text
    onPress={[Function]}
  >
    点我吖
  </Text>
</View>
`;
```

可见，组件根据 State 分别生成了两份 DOM 树。

如果你更改了组件代码，执行快照测试的话会 `diff` 出更改的地方，如图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226171547382.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

注意，这时快照测试是失败的，也是方便分析。当然如果要覆盖、更新快照文件，执行`yarn test -u`即可

**由于使用 Typescript，执行快照测试的时候报这个错，如图**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226194135568.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

在`jest.config.js`插入以下代码即可解决

```
globals: {
  'ts-jest': {
    diagnostics: {
      ignoreCodes: ['TS2531'] // 错误状态码
    }
  }
}
```

### DOM 测试

App 交互是频繁的，也就是响应各种事件，渲染不同的 DOM。针对 DOM 测试，官方有`react-addons-test-utils`插件，但是不好用，这里推荐 Airbnb 的 Enzyme。

### 测试报告

执行`yarn test --coverage`即可生成测试覆盖报告，如图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190226172921135.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

这时工程根目录下会自动生成`coverage`文件夹，这是测试覆盖报告的网页版，有更详细的信息。**注意把 coverage 加入.gitignore**

## Jest 语法

### 匹配器

Jest 使用“匹配器”来让您以不同的方式测试值，下面介绍些常用的匹配器

#### 普通匹配器

最简单的测试值的方法是看是否精确匹配，使用 toBe 即可

```
test('one plus one is two', () => {
  expect(1 + 1).toBe(2);
});
```

至于对象的值的精确匹配，则使用 toEqual，toEqual 会递归检查对象或数组的每个字段

```
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```

还可以测试相反的匹配

```
test('two minux one is not two', () => {
  expect(2 - 1).not.toBe(2);
});
```

#### Truthiness

区分 undefined、 null，和 false

- toBeNull 只匹配 null
- toBeUndefined 只匹配 undefined
- toBeDefined 与 toBeUndefined 相反
- toBeTruthy 匹配任何 if 语句为真
- toBeFalsy 匹配任何 if 语句为假

```
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

#### 数字

大多数的比较数字有等价的匹配器

```
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

对于比较浮点数相等，使用 toBeCloseTo 而不是 toEqual

```
test('两个浮点数字相加', () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3); 这句会报错，因为浮点数有舍入误差
  expect(value).toBeCloseTo(0.3); // 这句可以运行
});
```

#### 字符串

可以检查对具有 toMatch 正则表达式的字符串

```
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```

#### 数组

检查数组是否包含特定子项使用 toContain

```
test('shopping list has beer', () => {
  const shoppingList = ['diapers', 'kleenex', 'trash bags', 'paper towels', 'beer'];
  expect(shoppingList).toContain('beer');
});
```

#### 例外

如果你想要测试的特定函数抛出一个错误，在它调用时，使用 toThrow

```
class ConfigError extends Error {}

function compileAndroidCode() {
  throw new ConfigError('you are using the wrong JDK');
}
test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
```

### 测试异步代码

 在`JavaScript`中异步代码是很常见的，现在就来讲下`Jest`如何测试异步代码

#### 回调

最常见的方式就是回调函数

```
// Don't do this
function fetchData(callback = () => {}) {
  setTimeout(() => callback('peanut butter'), 3000);
}

test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }
  fetchData(callback);
});
```

以上代码就是常见的回调函数测试，但是这是**错误的写法**。一旦`fetchData`方法结束，此测试就在没有调用回调函数前结束，这是有问题的。为了解决此问题，使用单个参数调用`done`，保证`Jest`会等`done`回调函数执行结束后，结束测试。代码如下：

```
function fetchData(callback = () => {}) {
  setTimeout(() => callback('peanut butter'), 3000);
}

test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }
  fetchData(callback);
});
```

如果 `done`永远不会调用，这个测试将失败。

#### Promises

也可以使用`Promises`处理异步测试，只需要你的测试的方法返回 `Promise`，`Jest`会等待这一 Promise 来解决，如果`Promise`返回 `reject`，测试将自动失败

```
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve('peanut butter'), 3000);
  });
}

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

如果你想要 Promise 被拒绝，使用 .catch 方法。 请确保添加 expect.assertions 来验证一定数量的断言被调用。

```
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 3000);
  });
}
test('the fetch fails with an error', () => {
  expect.assertions(1); // 保证至少被调用一次
  return fetchData().catch(e => {
    expect(e).toMatch('error');
  });
});
```

#### .resolves / .rejects

`.resolves / .rejects`跟`Promises`基本是一样的，写法更加简单而已

```
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve('peanut butter'), 3000);
  });
}

test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

```
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 3000);
  });
}
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
```

#### Async/Await

在可以使用`async/await`。 若要编写`async`测试，只要在函数前面使用`async`关键字传递到`test`

```
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve('peanut butter'), 3000);
  });
}
test('the data is peanut butter', async () => {
  expect.assertions(1);
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});
```

```
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('error'), 3000);
  });
}
test('the data is peanut butter', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (error) {
    expect(error).toMatch('error');
  }
});

test('the data is peanut butter', async () => {
  await expect(fetchData()).rejects.toMatch('error');
});
```

`async/await`仅仅只是语法糖，本身的逻辑和`Promise`一样

### Setup and Teardown

Jest 提供辅助函数帮助我们在运行测试前做些准备工作和在运行测试后做些处理工作

#### 多次测试重复设置

使用`beforeEach`和`afterEach`为多次测试重复设置工作

简单编写测试，代码如下：

```
let citys = [];
function initializeCityDatabase() {
  citys = ['Vienna', 'San Juan'];
}
function clearCityDatabase() {
  citys = [];
}
function isCity(city) {
  return citys.includes(city);
}

beforeEach(() => {
  console.log('beforeEach');
  initializeCityDatabase();
});
afterEach(() => {
  console.log('afterEach');
  clearCityDatabase();
});
test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

测试结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019022714133679.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

如图所示，两个测试用例`beforeEach`和`afterEach`分别执行了两次

**`beforeEach`和`afterEach`能够通过与`异步代码测试`相同的方式处理异步代码，采取回调函数`done`或返回`Promise`**

#### 一次性设置

使用`beforeAll`和`afterAll`为多次测试只做一次性的设置工作

简单编写测试，代码如下：

```
let citys = [];
function initializeCityDatabase(callback) {
  setTimeout(() => {
    citys = ['Vienna', 'San Juan'];
    callback();
  }, 1000);
}
function clearCityDatabase() {
  return new Promise(resolve => {
    setTimeout(() => {
      citys = [];
      resolve('clean successful');
    }, 1000);
  });
}
function isCity(city) {
  return citys.includes(city);
}

beforeAll(done => {
  console.log('beforeAll');
  initializeCityDatabase(() => {
    done();
  });
});
// afterAll(() => {
//   return clearCityDatabase().then(data => console.log(data));
// });
afterAll(async () => {
  console.log('afterAll');
  const data = await clearCityDatabase();
  console.log(data);
});
test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

测试结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190227142818940.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

如图所示，两个测试用例`beforeAll`和`afterAll`只执行了一次

#### 作用域

默认情况下，`before`和`after`的块可以应用到文件中的每个测试。 此外可以通过`describe`块来将测试分组。 当`before`和`after`的块在`describe`块内部时，则其只适用于该`describe`块内的测试

```
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

### Mock 函数

Mock 函数通过擦除函数的实际实现、捕获对函数的调用(以及在这些调用中传递的参数)、在使用 new 实例化时捕获构造函数的实例以及允许在测试时配置返回值，使测试代码之间的链接变得很容易

#### 使用 mock 函数

我们来测试函数 forEach 的实现，确保按预期调用回调

```
function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

test('JestMock', () => {
  const mockCallback = jest.fn(x => 42 + x);
  forEach([0, 1], mockCallback);

  console.log('mockCallback', mockCallback.mock);

  // The mock function is called twice
  expect(mockCallback.mock.calls.length).toBe(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

##### .mock 属性

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190227190043240.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

这里主要介绍 Mock 函数的三个 API，分别是 jest.fn()、jest.mock()、jest.spyOn()

#### Mock 的返回值

可以直接将期望的值注入到测试中，非常方便

```
test('JestMock', () => {
  const myMock = jest.fn();
  console.log(myMock());
  // > undefined

  myMock
    .mockReturnValueOnce(10)
    .mockReturnValueOnce('x')
    .mockReturnValue(true);

  console.log(myMock(), myMock(), myMock(), myMock());
  // > 10, 'x', true, true
});
```

#### Mocking Modules

针对一些本地组件或第三方组件，直接使用`jest.mock`的手动模拟系统可以帮助模拟底层实现

```
jest.mock('react-native-video', () => 'Video');
```

有时需要提供更复杂的手动模拟，例如模拟一个 React 组件：

```
jest.mock('Text', () => {
  const RealComponent = jest.requireActual('Text');
  const React = require('React');
  class Text extends React.Component {
    render() {
      return React.createElement('Text', this.props, this.props.children);
    }
  }
  Text.propTypes = RealComponent.propTypes;
  return Text;
});
```

#### Mock 实现

在某些情况下，超出指定返回值和完全替换模拟函数的实现的能力是有限的，这时可以使用`mockImplementation`来实现

当您需要定义从另一个模块创建的模拟函数的默认实现时，`mockImplementation`方法非常有用

```
// foo.js
module.exports = function() {
  // some implementation;
};

// test.js
jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');

// foo is a mock function
foo.mockImplementation(() => 42);
foo();
// > 42
```

当您需要重新创建模拟函数的复杂行为，以便多个函数调用产生不同的结果时，请使用 `mockImplementationOnce`方法

```
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val));
// > true

myMockFn((err, val) => console.log(val));
// > false
```

#### Mock 名称

您可以选择为模拟函数提供一个名称，它将在测试错误输出中显示，而不是“jest.fn()”。如果您希望能够快速识别在测试输出中报告错误的模拟函数，那么可以使用它

```
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
```

这块理解的不够深，可以参考[官方文档](https://jestjs.io/docs/zh-Hans/mock-functions)

## 总结

RN 的单元测试也就讲这么多了，大家有兴趣可以好好了解下。同时，也希望大家能很好的运用单元测试，毕竟单元测试在某种程度上可以保证高质量的代码，提高编程水平的。
