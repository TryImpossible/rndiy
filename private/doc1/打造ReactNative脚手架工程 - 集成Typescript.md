## 前言

思来想去，还是用`Typescript`来编写脚手架工程吧。

为什么使用`Typescript`呢？

- Typescript 是 Javascript 的超集
- Typescript 让抽象清晰可见
- Typescript 使代码更容易阅读和理解

## 安装

安装分成两种，局部安装与全局安装，`强烈建议全局安装`

- 局部安装(在项目的工作目录中)

  ```
  npm install typescript --save-dev

  # or

  yarn add typescript --dev
  ```

- 全局安装

  ```
  npm install typescript -g

  # or

  yarn global add typescript
  ```

## 配置

### 1. 依赖

- `yarn add --dev @types/react @types/react-native`
- `yarn add --dev react-native-typescript-transformer`
- `touch rn-cli.config.js`
- 在`rn-cli.config.js`文件中插入以下代码
  ```
  module.exports = {
    getTransformModulePath() {
      return require.resolve("react-native-typescript-transformer");
    },
    getSourceExts() {
      return ["ts", "tsx"];
    }
  };
  ```

### 2. 规则

- `yarn tsc --init --pretty -jsx react`，生成`tsconfig.json`文件
- 在`tsconfig.json`文件里写入规则，参考如下

  ```
  {
    "compilerOptions": {
      /* Basic Options */
      "target": "ESNEXT",                       /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
      "module": "ESNext",                       /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
      "lib": ["es6"],                           /* Specify library files to be included in the compilation. */
      "allowJs": true,                          /* Allow javascript files to be compiled. */
      "checkJs": true,                          /* Report errors in .js files. */
      "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
      // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
      // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
      "sourceMap": true,                        /* Generates corresponding '.map' file. */
      // "outFile": "./s",                      /* Concatenate and emit output to single file. */
      // "outDir": "./dist",                    /* Redirect output structure to the directory. */
      "rootDir": "./",                          /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
      // "composite": true,                     /* Enable project compilation */
      "removeComments": true,                   /* Do not emit comments to output. */
      "noEmit": true,                           /* Do not emit outputs. */
      // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
      // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
      "isolatedModules": true,                  /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

      /* Strict Type-Checking Options */
      "strict": true,                           /* Enable all strict type-checking options. */
      // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
      // "strictNullChecks": true,              /* Enable strict null checks. */
      // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
      // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
      // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
      // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
      // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

      /* Additional Checks */
      // "noUnusedLocals": true,                /* Report errors on unused locals. */
      // "noUnusedParameters": true,            /* Report errors on unused parameters. */
      // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
      // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

      /* Module Resolution Options */
      "moduleResolution": "node",               /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
      // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
      // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
      // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
      // "typeRoots": [],                       /* List of folders to include type definitions from. */
      "types": ["react", "react-native"],                           /* Type declaration files to be included in compilation. */
      "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
      "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
      // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

      /* Source Map Options */
      // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
      // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
      // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
      // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

      /* Experimental Options */
      // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
      // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
    },
    "include": [
      "src/**/*"
    ],
    "files": [
      "App.tsx"
    ],
    "exclude": ["node_modules", "*.config.js", ".*.js"]
  }
  ```

  详细规则 ，请参考[文档](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/Compiler%20Options.html)

## 使用

- `yarn tsc App.tsx`，针对指定 typescript 文件
- `yarn tsc`，针对工程所有 typescript 文件

## 测试

关于 Typescript 的测试是基于 Jest，这里只是简单提下，具体讲解查看[Jest 单元测试](https://blog.csdn.net/Ctrl_S/article/details/87994930)

- `yarn add --dev ts-jest @types/jest @types/react-test-renderer`，安装依赖库
- 在`jest.config.js`文件，插入以下代码

  ```
  "jest": {
    "preset": "react-native",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
      "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "testPathIgnorePatterns": [
      "\\.snap$",
      "<rootDir>/node_modules/"
    ],
    "cacheDirectory": ".jest/cache"
  }
  ```

- 编辑`.gitignore`文件，插入以下代码
  ```
  # Jest
  .jest/
  ```
- 在`__tests__`文件夹，编写测试用例，例如

  ```
  import React from 'react';
  import renderer from 'react-test-renderer';

  import App from '../App';

  it('renders correctly with defaults', () => {
    const app = renderer.create(<App />).toJSON();
    expect(app).toMatchSnapshot();
  });
  ```

- `yarn test`，执行测试用例

## 总结

由于刚开始尝试 Typescript，就简单讲解下如何使用， 未来可能会有补充
