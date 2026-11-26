const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState('auth_info');
const sock = makeWASocket({ auth: state, printQRInTerminal: false, logger: pino({ level: 'silent' }), browser: ['Chrome', 'Chrome', '1.0.0'] });
sock.ev.on('creds.update', saveCreds);
const phoneNumber = '8801830085069';
if (!sock.authState.creds.registered) {
setTimeout(async () => {
try {
const code = await sock.requestPairingCode(phoneNumber);
console.log('====================');
console.log('TOMAR PAIRING CODE: ' + code);
console.log('====================');
} catch (e) { console.log('Pairing code ante problem: ' + e.message); }
}, 3000);
}
sock.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'close') {
const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
console.log('Connection closed, reconnecting...');
if (shouldReconnect) startBot();
} else if (connection === 'open') { console.log('BOT CONNECTED!'); }
});
sock.ev.on('messages.upsert', async ({ messages }) => {
const msg = messages[0];
if (!msg.message || msg.key.fromMe) return;
const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
const from = msg.key.remoteJid;
if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
await sock.sendMessage(from, { text: 'Hello! Ami FT Bot, bolo ki help lagbe?' });
}
});
}
startBot();
console.log('Bot Running on Port 10000');
