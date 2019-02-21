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
