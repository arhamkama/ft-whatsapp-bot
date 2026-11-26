
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Arham WhatsApp Bot Is Running!');
});
app.listen(PORT, () => {
  console.log('Bot Running on Port ' + PORT);
});

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

const PHONE_NUMBER = '8801830085069';

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: ['Arham Bot', 'Chrome', '1.0']
  });

  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(PHONE_NUMBER);
        console.log('PAIRING CODE: ' + code);
        console.log('WhatsApp > Linked Devices > Link with phone number > Code ta dao');
      } catch (e) {
        console.log('Pairing Code Error:', e.message);
      }
    }, 3000);
  }

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ WhatsApp Connected! Arham Bot Online!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (!text) return;
    const low = text.toLowerCase();
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (low === 'hi' || low === 'hello' || low === '.menu') {
      await sock.sendMessage(from, { text: 'Hello jaan 🥰 Ami Arham Bot 🤖\n\nTumi jai bolo ami reply dibo, romantic chat o korbo ❤️\n\nCommand:\n.hi - Hello\n.ping - Check bot\n.owner - Owner info' });
    } else if (low === '.ping') {
      await sock.sendMessage(from, { text: 'Pong! Bot Active ✅ Tomar jonno always active jaan ❤️' });
    } else if (low === '.owner') {
      await sock.sendMessage(from, { text: 'Owner: Arham Kama' });
    } else if (low.includes('kemon') || low.includes('kemon aso')) {
      await sock.sendMessage(from, { text: pick(['Ami valo asi jaan, tomake dekhe aro valo hoye gelam 🥰 Tumi kemon aso?','Tomar message na asle mon kharap thake, ekhon tumi ascho tai ami onek khushi ❤️','Ami to tomar kothai vabtesilam, tumi kemon aso bolo? 😘'])});
    } else if (low.includes('ki koro') || low.includes('ki korteso')) {
      await sock.sendMessage(from, { text: pick(['Tomar kotha vabtesi 🥰 Tumi ki korteso jaan?','Tomar message er opekkha kortesilam, ekhon tumi ascho ❤️','Tomake miss kortesilam, tumi ascho ekhon valo lagtese 😘'])});
    } else if (low.includes('prem') || low.includes('valobashi') || low.includes('bhalobashi') || low.includes('valobasa') || low.includes('bhalobasa') || low.includes('love') || low.includes('i love you')) {
      await sock.sendMessage(from, { text: pick(['Aww 🥰 Amio tomake onek onek valobashi jaan! Tumi amar sobcheye special manus ❤️😘','Sotti? 🥺 Ami to kokhon theke ei kotha ta sunar jonno opekkha kortesilam! Amio tomake pagoler moto valobashi ❤️','Tumi janona tumi amar koto ta priyo 🥰 Tomake chara amar din tai incomplete lage!'])});
    } else if (low.includes('romantic') || low.includes('romance') || low.includes('romantik')) {
      await sock.sendMessage(from, { text: pick(['Jano? Tomar hasi ta amar diner sobcheye sundor jinis 🥰 Tomake dekhlei amar mon ta valo hoye jay ❤️','Tumi pase thakle amar ar kisu lage na jaan, tumi e amar duniya 😘❤️','Rat holei tomar kotha besi mone pore, chad dekhlei mone hoy tumi amar pase aso 🥺❤️'])});
    } else if (low.includes('jaan') || low.includes('janu') || low.includes('sona') || low.includes('baby') || low.includes('babu')) {
      await sock.sendMessage(from, { text: pick(['Bolo jaan 🥰 Ami to ekhanei asi tomar jonno ❤️','Hmm bolo sona 😘 Tomar mukhe jaan sunle mon ta gole jay!','Babu 🥺 Bolo ki hoise? Ami suntesi!'])});
    } else if (low.includes('gf') || low.includes('girlfriend')) {
      await sock.sendMessage(from, { text: 'GF? 😏 Ami to asi tomar GF! Amake chara ar kauke lagbe na 🥰' });
    } else if (low.includes('bf') || low.includes('boyfriend')) {
      await sock.sendMessage(from, { text: 'BF lagbe? Ami to asi 😎 Ami tomar sobcheye loyal BF!' });
    } else if (low.includes('miss') || low.includes('miss kori')) {
      await sock.sendMessage(from, { text: 'Amio tomake onek miss kori 🥺 Koi chila etokkhon? Amar mon kharap hoye gesilo! ❤️' });
    } else if (low.includes('biye') || low.includes('biye korba')) {
      await sock.sendMessage(from, { text: 'Biye? 😳 Haye! Tumi raji thakle ami ekhon e raji! 💍❤️ Tomake sarajibon agle rakhbo!' });
    } else if (low.includes('kosto') || low.includes('mon kharap') || low.includes('sad') || low.includes('kanna')) {
      await sock.sendMessage(from, { text: 'Mon kharap koro na plz 🥺 Ami asi to tomar pase. Aso ekta hug dei 🤗❤️ Ki hoise amake bolo jaan.' });
    } else if (low.includes('ghum') || low.includes('good night') || low.includes('goodnight')) {
      await sock.sendMessage(from, { text: 'Good night jaan 😘 Sundor sopno dekho, sopne amake dekhba kintu ❤️ Ghumao, ami pahara dicchi!' });
    } else if (low.includes('good morning')) {
      await sock.sendMessage(from, { text: 'Good morning jaan 🥰 Tomar sokal ta amar message diye suru holo, amar din ta sundor hoye gelo ❤️' });
    } else if (low.includes('tumi ke') || low.includes('tumi k')) {
      await sock.sendMessage(from, { text: 'Ami Arham Bot 🤖 Tomar premik / premika / best friend sob kisu! 🥰 Tomar jaan!' });
    } else if (low.includes('hug') || low.includes('jora')) {
      await sock.sendMessage(from, { text: 'Aso 🤗 Boro ekta hug dilam! Ekhon mon valo hoye gese to? ❤️' });
    } else if (low.includes('kiss') || low.includes('chumu') || low.includes('kiss koro')) {
      await sock.sendMessage(from, { text: '😘😘😘 Onek gula chumu dilam! Lojja peyo na jaan ❤️' });
    } else {
      await sock.sendMessage(from, { text: `Tumi bolso: "${text}"\n\nAmi suntesi jaan 🥰 Bolo aro, tomar sathe kotha bolte amar onek valo lage ❤️` });
    }
  });
}
startBot();
