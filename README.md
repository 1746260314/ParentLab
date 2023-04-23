# 丰码知道 数据采集小程序

##  脚手架taro react + taro-ui

# yarn
$ yarn dev:weapp
$ yarn build:weapp

# npm script
$ npm run dev:weapp
$ npm run build:weapp

# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp

# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp

# watch 同时开启压缩
$ set NODE_ENV=development && taro build --type weapp --watch # CMD
$ NODE_ENV=development taro build --type weapp --watch # Bash

# 如需使用 Hooks 
参考https://taro-docs.jd.com/docs/hooks

# 设计稿及尺寸单位
/config/index.js
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 640,
  ....
}