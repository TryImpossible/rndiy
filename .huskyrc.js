module.exports = {
  skipCI: false,
  hooks: {
    'pre-commit': 'node node_modules/lint-staged/index.js' // 执行 node_modules 中的lint-staged 脚本
  }
};
