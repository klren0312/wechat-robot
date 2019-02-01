# 微信机器人
## 1.使用库

 - [wechaty](https://github.com/Chatie/wechaty) - 微信操作
 - [node-schedule](https://github.com/node-schedule/node-schedule) - 任务调度
 - [flyio](https://github.com/wendux/fly) - http请求

## 2.功能介绍
主要有下面两个功能:

 1. 定时群发, 在代码中设定群发的时间和内容(暂时支持代码内修改), 并在配置文件`robot-config.js`中配置群发列表, 支持备注, 这样可以避免一些麻烦.
 2. 智能回复, 代码中已经将自己的消息, 公众号的消息, 群聊消息和白名单中的消息屏蔽了, 减少不必要的影响.智能回复对接的是[海知智能](http://ruyi.ai/), 可以识别回复大部分信息, 无法识别的可以自定义一个默认回复语句.

## 3.项目运行
由于需要安装chromium, 所以要先配置一下镜像
 - **npm**
```bash
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```
 - **yarn**
```bash
yarn config set registry https://registry.npm.taobao.org
yarn config set disturl https://npm.taobao.org/dist
yarn config set puppeteer_download_host https://npm.taobao.org/mirrors
```

然后进行项目安装
```bash
$ git clone git@github.com:klren0312/wechat-robot.git
$ cd wechat-robot
$ npm install # 或者 yarn
```

配置相关数据, 编辑 `robot-config.js`, 在`群发名单`, `白名单`, `海知智能api` 中填入相关信息

运行项目
```bash
$ cd examples
$ node zzesRobot.js
```

# 4. 项目部署
1. 在服务器上安装`pm2`
```bash
$ npm install -g pm2
```
2. 项目安装依赖
3. 启动项目
```bash
$ pm2 start zzesRobot.js
```
4. 查看登录二维码
```bash
$ pm2 monit
# 或者
$ pm2 log
```

> 注意: linux上部署, 需要安装相关字体
```bash
$ yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
```

## 5.代码说明
>wechaty具体的api, 直接去[官方文档](https://chatie.io/wechaty/)查看

1.任务调度放在了登录的回调里, 登录之后添加任务调度, `node-schedule`支持下面的`new Date()`方法, 有个坑, 就是month是从0开始的, 所以需要注意一下
```javascript
const date = new Date(2019, 1, 5, 0, 0, 0)
timer = schedule.scheduleJob(date, function () {
  main() // 群发函数
})
```
2.群发, 遍历群发名单, 用的备注来搜索用户, 然后给用户发送信息, 需要加一点延时, 是为了给一定时间找到用户, 因为这个库爬的是网页微信的信息
```javascript
// 通过备注查找
bot.Contact.find({ alias: '备注' })
```
3.拦截信息
通过`onMessage`拿到`msg`相关信息
 
 - `msg.room()`为群聊信息
 - `msg.self()`为自己的信息
 - `msg.from().type()`为`1`的时候是公众号信息
