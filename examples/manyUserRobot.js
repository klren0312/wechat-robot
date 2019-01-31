const { Wechaty } = require('wechaty')
const schedule = require('node-schedule')
const contactArr = require('./contactArr').contactArr
// 定义
const bot = new Wechaty({
  name: 'zzes-wechat-bot'
})

// 注册事件
bot
  .on('login', onLogin)
  .on('logout', onLogout)
  .on('scan', onScan)
  .on('error', onError)
  .on('message', onMessage)

// 启动
bot
  .start()
  .catch(async e => {
    console.error('bot start fail: ', e)
    await bot.stop()
    process.exit(-1)
  })

// 事件定义
function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

const timer = null
function onLogin (user) {
  console.log(`${user.name()} 登录成功`)
  bot.say('机器人登录').catch(console.error)
  const date = new Date(2019, 2, 5, 0, 0, 0)
  timer = schedule.scheduleJob(date, function() {
    main()
  })
}

function onLogout (user) {
  console.log(`${user.name()} 退出登录`)
}

function onError (e) {
  console.error('机器人报错:', e)
}

// get msg
async function onMessage (msg) {
  console.log(msg.toString())
}

/**
 * Main Contact Bot
 */
async function main() {
  setTimeout(function(){
    contactArr.forEach(async (v) => {
      const contact =  await bot.Contact.find({alias: v})
      await contact.say(`春节快乐! ${v} 新的一年, 继续加油!`)
    })
    timer && timer.cancel()
  },6000);
  
}
/**
 *
 * 7. Output the Welcome Message
 *
 */
const welcome = `
//
//   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
// ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
// ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
// ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
// ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
//  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
//  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
//  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
//           ░     ░ ░      ░  ░



Please wait... I'm trying to login in...
`
console.log(welcome)