
const { Wechaty } = require('wechaty')
const WebSocket = require('ws');
const opn = require('opn')
const server = require('server')
const { get } = server.router
const { render } = server.reply
server({port: 8889, public: 'public'}, [
  get('/', () => render('index.html'))
])
opn('http://localhost:8889');
const wss = new WebSocket.Server({ port: 8888 });
const bot = new Wechaty({
  name: 'ws-zzes-wechat-bot'
})
wss.on('connection', function connection(ws) {
  function onScan (qrcode, status) {
    log(qrcode)
    require('qrcode-terminal').generate(qrcode, { small: true }, function(q) {
      log(q)
    })  // show qrcode on console
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')
  
    log(qrcodeImageUrl)
  }
  
  function onLogin (user) {
    log(`${user} login`)
  }
  
  function onLogout(user) {
    log(`${user} logout`)
  }
  
  async function onMessage (msg) {
    log(msg.toString())
  }
  
  bot.on('scan',    onScan)
  bot.on('login',   onLogin)
  bot.on('logout',  onLogout)
  bot.on('message', onMessage)
  
  bot.start()
  .then(() => log('Starter Bot Started.'))
  .catch(e => console.error(e))
  
  function log (msg) {
    console.log(msg)
    ws.send(msg + '\n')
  }
})
