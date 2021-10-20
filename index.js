require("dotenv").config();

const { Client, Intents, MessageEmbed, MessageAttachment } = require("discord.js");
const voiceDiscord = require("@discordjs/voice");
const Canvas = require("canvas");
const fs = require("fs");
const SQLite = require("better-sqlite3");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const sql = new SQLite("./scores.sqlite");

const prefix = process.env.PREFIX;
const TOKEN = process.env.TOKEN;

let textContent = fs.readFileSync('text.txt', 'utf-8');
let textContentLineByLine = textContent.toString().split("\n");

client.on("ready", () => {
    console.log("ready");

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER);").run();

        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }

    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points) VALUES (@id, @user, @guild, @points);")
})

client.on("messageCreate", async msg => {

    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const channel = msg.member.voice.channel;
    const audio = msg.content.match(/-?\d+/g);

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    args
        .shift()
        .toLowerCase();

    //const args = msg.content.match(/(^#)(cw)(-?\d+|\w+)/g); 

    function isCommand(command) {
        return msg.content.toLowerCase().startsWith(prefix + command);
    };

    function isValid(args) {
        let checkArgs = args != null && args <= textContentLineByLine.length && !isNaN(args) && args > 0;
        return checkArgs ? args : false;
    }

    if (isCommand("cw")) {

        if (!args.length) {
            return msg.reply("Não entendi, porra, manda de novo.");
        }

        if (isValid(args)) {

            if (!channel) {
                return msg.reply(msg.author.username + " me ajuda a te ajudar brother. Tu tem que estar em um canal de voz pra mágica rolar.");
            }

            playAudio(audio, msg, channel);

            msg.channel.send(`${msg.author.username}: :loud_sound: ${textContentLineByLine[audio - 1].replace(/[0-9]\s-\s/g, "")}`);

        } else if (args == "list") {

            msg.channel.send(textContent);

        } else {

            msg.reply("Não entendi, porra, manda de novo.");

        }
    } else if (isCommand("tip")) {

        if (!msg.mentions.members.size) {
            return msg.reply("Ta tipando o gasparzinho?");
        }

        const authorImage = msg.author.displayAvatarURL({ format: "png" });
        const mentionImage = msg.mentions.members.first().user.displayAvatarURL({ format: 'png' });
        const authorUsername = msg.author.username;
        const mentionUsername = msg.mentions.users.first().username;
        const mentionID = msg.mentions.users.first().id;
        
        if (authorUsername == mentionUsername) {
            return msg.reply("Orra brother, você não pode se tipar");
        }
        
        if (msg.mentions.users.first().bot) {
            return msg.reply("Mano, você tem que tipar alguem que existe, tá na duvida? Tipa o Samuel");
        }

        if (channel) {
            playAudio("tip", msg, channel);
        }

        const canvas = Canvas.createCanvas(264, 83);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./imgs/fundoTip.png');

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(authorImage);
        context.drawImage(avatar, 25, 6, 58, 58);
        const avatar2 = await Canvas.loadImage(mentionImage);
        context.drawImage(avatar2, 184, 6, 58, 58);

        context.font = '12px sans-serif';

        context.fillStyle = '#ffffff';

        context.fillText(authorUsername, 25, 75);
        context.fillText(mentionUsername, 184, 75);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

        msg.reply({ files: [attachment] });

        // ------------------------------------------------------------------------------------------------------

        let score = client.getScore.get(mentionID, msg.guild.id);

        if (!score) {
            score = { 
                id: `${msg.guild.id}-${mentionID}`,
                user: mentionID,
                guild: msg.guild.id,
                points: 0,
            }
        }

        score.points++;
        client.setScore.run(score);

    } else if(isCommand("saldo")) {
        let score = client.getScore.get(msg.author.id, msg.guild.id);

        if(!score) {
            return msg.reply(`Você foi tipado 0 vezes!`);
        }

        return msg.reply(`Você foi tipado ${score.points} vezes!`);
    } else {

        msg.reply("Não entendi, porra, manda de novo.");

    }

})

const playAudio = (audio, msg, channel) => {
    const player = voiceDiscord.createAudioPlayer();
    const resource = voiceDiscord.createAudioResource(`./Assets/${audio}.mp3`);

    const connection = voiceDiscord.joinVoiceChannel({
        channelId: channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
        connection.destroy();
    })
}

client.login(TOKEN);
