const path = require('path')

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'postcss-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'], // 모듈 위치
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    client: {
      overlay: true,
      // 웹소켓용 url 지정
      webSocketURL: { hostname: undefined, pathname: undefined, port: '0' },
    },
    host: 'localhost', // live-server host 및 port
    port: 9871,
  },
  mode: 'development', // 번들링 모드 development / production
}
