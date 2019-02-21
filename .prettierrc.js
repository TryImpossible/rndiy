module.exports = {
  //parser: 'typescript', // 解析器，会根据文件自动推断，可选 babel|babel-flow|flow|typescript|css|scss|less|json|json5|json-stringify|graphql|markdown|mdx|html|vue|angular|yaml
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
