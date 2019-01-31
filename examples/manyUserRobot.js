const { Wechaty } = require('wechaty')
const schedule = require('node-schedule')
const fly = require('flyio')

const contactArr = require('./robot-config').contactArr
const personArr = require('./robot-config').personArr

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
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode, {
    small: true
  }) // show qrcode on console
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

const timer = null

function onLogin(user) {
  console.log(`${user.name()} 登录成功`)
  bot.say('机器人登录').catch(console.error)
  const date = new Date(2019, 2, 5, 0, 0, 0)
  timer = schedule.scheduleJob(date, function () {
    main()
  })
}

function onLogout(user) {
  console.log(`${user.name()} 退出登录`)
}

function onError(e) {
  console.error('机器人报错:', e)
}

// get msg
async function onMessage(msg) {
  console.log(msg.toString())
  const contact = msg.from()
  const text = msg.text()
  const room = msg.room()
  /**
   * 拦截以下信息:
   * (x) 群聊
   * (x) 自己信息
   * (x) 公众号信息 contact.type() 为 1 则是公众号
   * (x) 白名单信息
   */
  if (!room && !msg.self() && personArr.indexOf(contact.name()) === -1 && contact.type() === 1) {
    console.log(`${contact.name()}  给你发送了   ${text}`)
    let gender = ''
    if (contact.gender() === 1) {
      gender = '先生'
    } else {
      gender = '女士'
    }
    fly.post(`http://api.ruyi.ai/v1/message`, {
      q: text,
      app_key: '',
      user_id: contact.name()
    }).then(async res => {
      console.log(res.data.result)
      const r = res.data
      if (r.code === 0) {
        if (r.result.hasOwnProperty('intents')) {
          await msg.say(r.result.intents[0].result.text)
        } else {
          return
        }
      } else {
        await msg.say(`${gender}您好, 暂时无法理解您发送的内容, 祝您春节快乐!`)
      }

    })
  }
}

/**
 * Main Contact Bot
 */
async function main() {
  setTimeout(function () {
    contactArr.forEach(async (v) => {
      const contact = await bot.Contact.find({
        alias: v
      })
      await contact.say(`春节快乐! 新的一年, ${v}继续加油!`)
    })
    timer && timer.cancel()
  }, 6000);

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