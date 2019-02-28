
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
function onScan (qrcode, status) {
  wss.on('connection', function connection(ws) {
    require('qrcode-terminal').generate(qrcode, { small: true }, function(q) {
      console.log(q)
      ws.send(q)
    })  // show qrcode on console
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')
  
    console.log(qrcodeImageUrl)
  })
}

function onLogin (user) {
  wss.on('connection', function connection(ws) {
    ws.send(`${user} login`)
  })
  console.log(`${user} login`)
}

function onLogout(user) {
  console.log(`${user} logout`)
}

async function onMessage (msg) {
  console.log(msg.toString())
}

const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))
