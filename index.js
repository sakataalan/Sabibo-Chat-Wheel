require("dotenv").config();

const { Client, Intents } = require("discord.js");
const voiceDiscord = require("@discordjs/voice");
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const prefix = '#';
const TOKEN = process.env.TOKEN;
let textContent = fs.readFileSync('text.txt').toString().split("\n");
let textContentToShow = fs.readFileSync('text.txt', 'utf-8');

client.on("ready", () => {
    console.log("ready");
})

client.on("messageCreate", async msg => {
    const audio = msg.content[4];

    function isCommand(command) {
        return !!msg.content.toLowerCase().startsWith(prefix + command);
    };
    
    if (isCommand("cw " + audio) && !isNaN(parseInt(audio)) && parseInt(audio) <= textContent.length) {
        const channel = msg.member.voice.channel;   
        
        if(!channel) {
            return msg.reply(msg.author.username + " me ajuda a te ajudar brother. Tu tem que estar em um canal de voz pra mágica rolar.");
        }
        
        const player = voiceDiscord.createAudioPlayer();
        const resource = voiceDiscord.createAudioResource(`./Assets/${audio}.mp3`);
        
        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator,
        });
        
        msg.channel.send(`${msg.author.username}: :loud_sound: ${textContent[audio-1].replace(/[0-9]\s-\s/g, "")}`);

        player.play(resource);
        connection.subscribe(player);        

        player.on(voiceDiscord.AudioPlayerStatus.Idle, ()=>{
            connection.destroy();
            
        }) 
    } else if(isCommand("cw " + "list")){
        msg.channel.send(textContentToShow);
    } else if (!msg.author.bot){
        msg.reply("Não entendi, porra, manda de novo.");
    }
})

client.login(TOKEN);
