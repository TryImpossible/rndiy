## 前言

代码规范，也算是个老生常谈的问题。如何写出优秀漂亮的代码，是每个程序员的必修课。得益于**开源**伟大思想，许多大厂都制定了一系列的代码规范并发布在市场上。正所谓"前人栽树，后人乘凉"，我们就不必去大费周章的去定义代码规范，只要做到遵守就好了。可能我们了解了有哪些代码规范，但是在编码当中我们难以百分百的遵守，所以我们还需要一个东西去约束我们编写优秀漂亮的代码。这里就脚手架工程，从 IDE（编辑器）、代码检测、代码美化、代码提交共四个方面具体讲解下如何保证代码规范。

## IDE（编辑器）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190218212636303.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

[官方文档](https://editorconfig.org/)

目前市场上流行各式各样的编辑器，开发的同学也都自己钟爱的编辑器，因此同一开发小组可能每个人都用不同的编辑器工作。为了解决跨编辑器和 IDE 而造成的代码规范问题，我使用**EditorConfig**。

### 1. 定义

什么是 EditorConfig 呢？EditorConfig 有助于为跨各种编辑器和 ide 处理同一项目的多个开发人员维护一致的编码风格。EditorConfig 项目包括用于定义编码样式的文件格式和一组文本编辑器插件，这些插件使编辑器能够读取文件格式并遵循已定义的样式。EditorConfig 文件很容易读，而且它们与版本控制系统配合得很好。

### 2. 规则详解

- 通配符模式

  ```
  * 匹配除/之外的任意字符
  **    匹配任意字符串
  ? 匹配任意单个字符
  [name]    匹配name字符
  [!name]   不匹配name字符
  [s1,s2,s3]    匹配给定的字符串
  [num1..num2]  匹配num1到mun2直接的整数
  ```

- 支持的属性

  ```
  indent_style  缩进风格，可选tab，space
  indent_size   缩进为 space 时，缩进的字符数
  tab_width     缩进为 tab 时，缩进的宽度
  end_of_line   换行符的类型，可选lf，cr，crlf
  charset       字符集，可选latin1，utf-8，utf-8-bom，utf-16be，utf-16le
  trim_trailing_whitespace     是否将行尾空格自动删除
  insert_final_newline    是否在文件结尾插入新行
  root     表明是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
  ```

### 3. 使用

- 在工程根目录下新建`.editorconfig`文件
- 在`.editorconfig`文件中编写规则，参考如下：

  ```
  # https://editorconfig.org/
  # EditorConfig文件使用INI格式。斜杠(/)作为路径分隔符，#或者;作为注释。路径支持通配符:
  # 表明是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
  root = true

  # * 匹配除/之外的任意字符
  # **    匹配任意字符串
  # ? 匹配任意单个字符
  # [name]    匹配name字符
  # [!name]   不匹配name字符
  # [s1,s2,s3]    匹配给定的字符串
  # [num1..num2]  匹配num1到mun2直接的整数

  [*]
  # 文件的charset。有以下几种类型：latin1, utf-8, utf-8-bom, utf-16be, utf-16le
  charset = utf-8
  # 缩进使用 tab 或者 space
  indent_style = space
  # 缩进为 space 时，缩进的字符数
  indent_size = 2
  # 缩进为 tab 时，缩进的宽度
  tab_width = 2
  # 换行符的类型。lf, cr, crlf三种
  end_of_line = lf
  # 在文件结尾插入新行
  insert_final_newline = true
  # 是否将行尾空格自动删除
  trim_trailing_whitespace = true

  [*.md]
  trim_trailing_whitespace = false

  [*.json]
  indent_size = 2
  ```

- VSCODE 编辑器，需要安装 **EditorConfig for VS Code**插件。关于插件安装，详情请参考[文档](https://editorconfig.org/)

## TSLint

[参考文档](https://palantir.github.io/tslint/usage/cli/)

由于采用`typescript`来编码，这里就使用`TSLint`来检查代码。

### 1. 安装

安装分成两种，局部安装与全局安装，`强烈建议全局安装`

- 局部安装(在项目的工作目录中)

  ```

  npm install tslint typescript --save-dev

  # or

  yarn add tslint typescript --dev

  ```

- 全局安装

  ```

  npm install tslint typescript -g

  # or

  yarn global add tslint typescript

  ```

### 2. 依赖库

```
npm install tslint typescript
# or
yarn add tslint typescript
```

### 3. CLI 语法

- 详解

  ```
  -v, --version 版本
  -c,--config 配置文件
  -e,--exclude 排除那些文件
  --fix 自动修复错误
  --force 强制返回 code 0
  -i,--init 生成 tslint.json 文件
  -o,--out 文件名 输出文件
  --outputAbsolutePaths 是否为绝对路径
  -r,--rules-dir 附件规则
  -p,--project tsconfig.json 文件的位置
  ```

- 示例
  ```
   tslint -p tsconfig.json -c tslint.json
  ```
- 退出 Code
  ```
  0： 检测成功，可能有警告
  1： 使用了无效的命令行参数
  2： 检测失败，有严重错误的规则出现
  ```

### 4. 配置

- 执行`yarn add tslint-config-prettier tslint-plugin-prettier tslint-eslint-rules tslint-react tslint-lines-between-class-members --dev`，添加插件
- 执行`tslint --init`,生成`tslint.json`文件
- 在`tslint.json`文件中编写检查规则，参考如下：
  ```
  /* https://palantir.github.io/tslint/usage/configuration/ */
  {
    "defaultSeverity": "error",
    "extends": ["tslint:recommended", "tslint-react", "tslint-eslint-rules", "tslint-config-prettier"],
    "linterOptions": {
      "exclude": ["__tests__", "node_modules"]
    },
    "jsRules": {
      "max-line-length": {
        "options": [120]
      }
    },
    /* https://palantir.github.io/tslint/rules/ */
    "rules": {
      "prettier": [true, ".prettierrc.js"] /* 开启prettier格式化，并使用.prettierrc.js规则  */,
      "max-line-length": {
        "options": [120]
      },
      "no-console": {
        "severity": "error",
        "options": ["debug", "info", "log", "time", "timeEnd", "trace"]
      },
      "object-literal-sort-keys": false,
      "interface-name": false,
      "jsx-no-lambda": false,
      "lines-between-class-members": true,
      "no-unused-expression": false,
      "member-access": [true, "no-public"]
    },
    "rulesDirectory": ["node_modules/tslint-lines-between-class-members", "tslint-plugin-prettier"]
  }
  ```
  关于具体规则描述，请参考[文档](https://palantir.github.io/tslint/rules/)
- 执行检测`tslint -p tsconfig.json -c tslint.json`
- VSCODE 编辑器建议安装`TSLint`插件，这样在编码中就能实时检测代码

### 5. 注释标记

- 详解

  ```
  /* tslint:disable */ - 对文件的其余部分禁用所有规则
  /* tslint:enable */ - 对文件的其余部分开启所有规则
  /* tslint:disable:rule1 rule2 rule3... */ - 对文件的其余部分禁用列出的规则
  /* tslint:disable:rule1 rule2 rule3... */ - 对文件的其余部分启用列出的规则
  // tslint:disable-next-line - 禁用下一行的所有规则
  // tslint:disable-line - 禁用当前行的所有规则
  // tslint:disable-next-line:rule1 rule2 rule3... - 禁用下一行列出的规则
  ```

- 示例

  ```
  function validRange (range: any) {
    return range.min <= range.middle && range.middle <= range.max;
  }

  /* tslint:disable:object-literal-sort-keys */
  const range = {
    min: 5,
    middle: 10,    // TSLint will *not* warn about unsorted keys here
    max: 20
  };
  /* tslint:enable:object-literal-sort-keys */

  const point = {
    x: 3,
    z: 5,          // TSLint will warn about unsorted keys here
    y: 4,
  }

  console.log(validRange(range));
  ```

### 6. 第三方工具

- [grunt-tslint（Grunt）](https://gruntjs.com/)
- [gulp-tslint（Gulp）](https://github.com/panuhorsmalahti/gulp-tslint)
- [eclipse-tslint（Eclipse）](https://github.com/palantir/eclipse-tslint)
- [linter-tslint（Atom）](https://atom.io/)
- [vscode-tslint（Visual Studio Code）](https://code.visualstudio.com/)
- [syntastic（VIM）](https://www.vim.org/)
- [Web Analyzer（Visual Studio）](https://visualstudio.microsoft.com/)
- [Webstorm](https://www.jetbrains.com/help/webstorm/2016.1/tslint.html)
- [mocha-tslint（Mocha）](https://github.com/t-sauer/mocha-tslint)
- [tslint.tmbundle（TextMate）](https://github.com/natesilva/tslint.tmbundle)
- [generator](https://github.com/greybax/generator-tslint)
- [Flycheck（Emacs）](https://www.gnu.org/software/emacs/)

## Prettier

[参考文档](https://prettier.io/docs/en/install.html)

美化代码，`Prettier`是必不可少的

### 1. 安装

安装分成两种，本地安装与全局安装，`强烈建议全局安装`

- 局部安装(在项目的工作目录中)

  ```

  npm install --save-dev --save-exact prettier

  # or

  yarn add prettier --dev --exact

  ```

- 全局安装

  ```

  npm install --global prettier

  # or

  yarn global add prettier

  ```

### 2. ClI 语法

- --check: 检查文件是否已格式化
- --debug-check: 检测 prettier 代码是否影响代码的正确性
- --find-config-path and --config: 查找配置文件
- --ignore-path: 忽略文件的路径
- --require-pragma: 文件头显示特殊注释,方便格式化
- --insert-pragma: 文件的头部插入@format 标识，配合--require-pragma 使用
- --list-different: 列出格式化差异
- --no-config: 不查找配置文件，使用默认设置
- --no-editorconfig: 解析配置时不要考虑.editorconfig
- --with-node-modules: 格式化 node-modules 中的代码
- --write: 重写已处理的所有文件
- --loglevel: 更改 CLI 的日志记录级别，可选 error、warn、log、 debug、silent
- --stdin-filepath

### 3. 选项

- Print Width: 换行字符串长度
- Tab Width: 每个缩进的空格数
- Tabs: 缩进风格，是否用 tab 代替 space
- Semicolons: 句末加分号
- Quotes: 单引号代替双引号
- JSX Quotes: 在 JSX 里用单引号代替双引号
- Trailing Commas: 在多行情况下，尽可能打印后面的逗号
- Bracket Spacing: 在对象文字的方括号之间打印空格
- JSX Brackets: 将多行 JSX 元素的 > 放在最后一行的末尾，而不是单独放在下一行
- Arrow Function Parentheses: 在一个单独的箭头函数参数周围加上圆括号
- Range: 格式化文件的某一段
- Parser: 指定解析器
- File Path: 指定要使用的文件名来推断使用哪个解析器
- Require pragma: 是否只对特殊注释的文件格式化
- Insert Pragma: 是否插入特殊注释符，配合 Require pragma 使用
- Prose Wrap: 是否换行
- HTML Whitespace Sensitivity: 为 HTML 文件指定全局空白
- End of Line: 文本行尾

### 4. 美化配置

- 执行`touch .prettierrc.js`,生成`.prettierrc.js`文件
- 在`.prettierrc.js`文件中编写检查规则，参考如下：
  ```
  module.exports = {
    // parser: 'typescript', // 解析器，会自动推断
    printWidth: 120, // 换行字符串阈值
    semi: true, // 句末加分号
    singleQuote: true, // 用单引号
    useTabs: false, // 是否用Tab缩进
    tabWidth: 2, // 每一个水平缩进的空格数
    trailingComma: 'none', // 最后一个对象元素加逗号，可选 none|es5|all
    bracketSpacing: true, // 对象，数组加空格
    jsxBracketSameLine: false, // jsx > 是否另起一行
    arrowParens: 'avoid', // (x) => {} 是否要有小括号，可选 avoid|always
    requirePragma: false, // 是否要注释来决定是否格式化代码
    proseWrap: 'preserve', // 是否要换行，可选 always|never|preserve
    endOfLine: 'auto', // 行尾风格，可选 auto|lf|crlf|cr
    htmlWhitespaceSensitivity: 'css' //HTML文件指定全局空白, 可选css|strict|ignore
  };
  ```
- 执行 `prettier --write App.tsx src/*.{ts,tsx,d.ts}`
- VSCODE 编辑器建议安装`Prettier`插件，并且在 VSCODE 设置里开启 `"editor.formatOnSave": true,`，这样保存的时候话就会格式化代码，并且会智能的修复错误的编码格式

### 5.忽略配置

- 文件忽略， 执行`touch .prettierignore`,生成`.prettierignore`文件添加需要忽略的文件，参考

  ```
  # 忽略 tsconfig.json
  tsconfig.json
  ```

- 注释忽略，`/_ prettier-ignore _/` or `// prettier-ignore` or `/* prettier-ignore */`
- 注释忽略某部分代码，`<!-- prettier-ignore-start --> <!-- prettier-ignore-end -->`

## Pre-commit Hook

[参考文档一](https://prettier.io/docs/en/precommit.html)

[参考文档二](https://github.com/okonet/lint-staged)

[参考文档三](https://github.com/typicode/husky)

Pre-commit Hook 是配合`Git`使用的，它能够在提交代码之前帮助你格式化代码，如果有不符合规范的代码，会强制阻止提交，直到你修复了不符合规范的代码才能提交成功。

### 1.安装

```
yarn add lint-staged husky --dev
```

### 2.配置

分成两种配置方式，任先其一

- 方式一，在`package.json`插入以下代码

  ```
  "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
    },
    "lint-staged": {
      "linters": {
        "*.{ts,tsx}": [
          "node node_modules/tslint/bin/tslint -p ./tsconfig.json -c tslint.json --fix",
          "node node_modules/prettier/bin-prettier.js --write",
          "git add"
        ],
        "*.{js,json}": [
          "node node_modules/prettier/bin-prettier.js --write",
          "git add"
        ],
        "*.{md,html}": [
          "node node_modules/prettier/bin-prettier.js --write",
          "git add"
        ]
      },
      "ignore": [
        "package.json"
      ]
    }
  ```

- 方式二，分别创建`.huskyrc.js`和 `lint-staged.config.js`文件，插入以下代码

  ```
  .huskyrc.js

  module.exports = {
    skipCI: false,
    hooks: {
      'pre-commit': 'node node_modules/lint-staged/index.js' // 执行 node_modules 中的lint-staged 脚本
    }
  };
  ```

  ```
  lint-staged.config.js

  module.exports = {
    linters: {
      '*.{ts,tsx,d.ts}': [
        'node node_modules/tslint/bin/tslint -p ./tsconfig.json -c tslint.json --fix',
        'node node_modules/prettier/bin-prettier.js --write',
        'git add'
      ],
      '*.{js,json}': ['node node_modules/prettier/bin-prettier.js --write', 'git add'],
      '*.{md,html}': ['node node_modules/prettier/bin-prettier.js --write', 'git add']
    },
    ignore: ['package.json'],
    relative: true
  };
  ```

### 3.使用

我这里只配置`pre-commit`了命令, 执行`git commit -m 'comment'`提交代码就能使用 Hook

当使用 `git commit`时， `husky`会执行`lint-staged`脚本并且读取`lint-staged.config.js`中的配置信息

`hooks`还支持很多种命令，`commit-msg`、`pre-push`、`post-merge`等，都存放在`./git/hooks`文件夹下

## VSCode 设置，仅供参考

```
{
  "editor.tabSize": 2, // 一个制表符等于的空格数
  "editor.minimap.enabled": false, // 隐藏右侧小地图
  "explorer.autoReveal": false, // 控制资源管理器是否应在打开文件时自动显示它们
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.formatOnSave": true, // 保存时格式化代码
  "workbench.colorTheme": "Visual Studio Light", // 主题
  "breadcrumbs.enabled": true, // 显示文件路径位置
  "editor.renderWhitespace": "all", // 文件保存时去除末尾空格
  "files.trimTrailingWhitespace": true, // 启用后，将在保存文件时剪裁尾随空格
  "prettier.eslintIntegration": true, // 开启prettier配合eslint使用
  "prettier.tslintIntegration": true, // 开启prettier配合tsslint使用
  "tslint.alwaysShowRuleFailuresAsWarnings": false // tslint显示检测失败为waring
}
```

## 总结

现在是不是觉得代码规范很简单呢？只要我们合理的使用这些插件，一样能编写出优秀漂亮的代码。可能开始时插件抛出的错误莫名其妙，关键在于我们要了解这些插件的作用，特别要理解`TSLint`中的规则，搞清楚了这些你才知道怎样编写出优美的代码。不管怎样，代码规范无论是对个人开发还是对团队开发都是非常重要的，值得我们使用。相信，每个优秀的开发者代码规范是必不可少的！

## 效果图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190222000943592.gif)

## 写在最后

- 当`TLsint`检测不过时，会强制阻止`Prettier`格式化代码
- 对 VSCODE 编辑器，`TSLint`和`ESLint`插件建议不要同时使用，可能会存在冲突
- 对 VSCODE 编辑器，编辑`TSLint`的规则可能不会立即生效，应该是有缓存，建议重启 VSCODE

- 关于如何使用 ESLint 检测代码规范，可以参考这篇文章：[ReactNative 如何配置 ESLint，Prettier，Pre-commit Hook](https://blog.csdn.net/Ctrl_S/article/details/82633261)
