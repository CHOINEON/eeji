// babel.config.js
// 개발, 빌드환경에 따라 console.log를 제거해주는 플러그인 조건부 동작
module.exports = {
  plugins: process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : [],
}
