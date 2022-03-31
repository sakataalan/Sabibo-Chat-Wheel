const audio = require("../functions/audio");
const db = require("../functions/database");
const canvas = require("../functions/canvas");

module.exports = {
    name: "tip",
    description: "this is a tip command",
    async execute(msg) {
        if (!msg.mentions.members.size) {
            return msg.reply("Ta tipando o gasparzinho?");
        }

        const channel = msg.member.voice.channel;
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
            audio.playAudio("tip", msg, channel);
        }

        db.checkAndIncreaseScore(msg, mentionID, mentionUsername);
        canvas.drawCanvas(msg);
    }
}