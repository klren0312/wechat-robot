const {
  Contact,
  log,
  Wechaty
} = require('wechaty')
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

function onLogin (user) {
  console.log(`${user.name()} login`)
  bot.say('Wechaty login').catch(console.error)
  main()
}

function onLogout (user) {
  console.log(`${user.name()} logouted`)
}

function onError (e) {
  console.error('bot error:', e)
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
      await contact.say(`${v}, 怎么样, 加入治电, 投入学习吧!`)
    })
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