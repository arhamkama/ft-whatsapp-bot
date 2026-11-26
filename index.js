
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
res.send('FT WhatsApp Bot Is Running!');
});
app.listen(PORT, () => {
console.log('Bot Running on Port ' + PORT);
});
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState('auth_info');
const sock = makeWASocket({
logger: pino({ level: 'silent' }),
printQRInTerminal: true,
auth: state,
browser: ['FT Bot', 'Chrome', '1.0']
});
sock.ev.on('creds.update', saveCreds);
sock.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'close') {
const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
console.log('Connection closed, reconnecting:', shouldReconnect);
if (shouldReconnect) startBot();
} else if (connection === 'open') {
console.log('WhatsApp Connected! FT Bot Online!');
}
});
sock.ev.on('messages.upsert', async ({ messages }) => {
const msg = messages[0];
if (!msg.message || msg.key.fromMe) return;
const from = msg.key.remoteJid;
const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
console.log('Message:', text);
if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello' || text.toLowerCase() === '.menu') {
await sock.sendMessage(from, { text: 'Hello! Ami FT Bot\n\nCommand:\n.hi - Hello\n.ping - Check bot\n.owner - Owner info' });
}
if (text.toLowerCase() === '.ping') {
await sock.sendMessage(from, { text: 'Pong! Bot Active' });
}
if (text.toLowerCase() === '.owner') {
await sock.sendMessage(from, { text: 'Owner: Arham Kama' });
}
});
}
