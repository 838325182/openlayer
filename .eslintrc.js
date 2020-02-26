module.exports = {
  root: true,
  env: {
    node: true,
    jquery:true
  },
  'extends': [
    'plugin:vue/essential',
    // 'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

// module.exports = {
//   root: true,
//   parserOptions: {
//     sourceType: 'babel-eslint'
//   },
//   parser: "vue-eslint-parser",
//   env: {
//     browser: true,
//     node: true,
//     es6: true,
//   },
//   rules: {
//     'no-console': 'off',
//   }
// }
