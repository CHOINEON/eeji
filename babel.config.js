// babel.config.js
// 개발, 빌드환경에 따라 console.log를 제거해주는 플러그인 조건부 동작
// module.exports = {
//   plugins: process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : [],
// }

;[
  'babel-plugin-import',
  {
    libraryName: '@material-ui/core',
    libraryDirectory: '',
    camel2DashComponentName: false,
  },
  'core',
],
  [
    'babel-plugin-import',
    {
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    'lodash',
  ],
  // transport-imports
  [
    'transform-imports',
    {
      lodash: {
        // eslint-disable-next-line no-template-curly-in-string
        transform: 'lodash/${member}',
        preventFullImport: true,
      },
      '@material-ui/?(((\\w*)?/?)*)': {
        // eslint-disable-next-line no-template-curly-in-string
        transform: '@material-ui/${1}/${member}',
        preventFullImport: true,
      },
    },
  ]
