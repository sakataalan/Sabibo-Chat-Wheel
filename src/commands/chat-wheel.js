const audio = require("../functions/audio");
const fs = require("fs");

let textContent = fs.readFileSync('../text.txt', 'utf-8');
let textContentLineByLine = textContent.toString().split("\n");

module.exports = {
    name: "cw",
    description: "this is a chat-wheel command",
    execute(msg, args) {

        const channel = msg.member.voice.channel;
        const numberOfAudio = msg.content.match(/-?\d+/g);
   
        if (!args.length) return msg.reply("Não entendi, porra, manda de novo.");
        
        function isAValidNumber(args) {
            let checkNumber = args != null && args <= textContentLineByLine.length && !isNaN(args) && args > 0;
            return checkNumber ? args : false;
        }

        if (isAValidNumber(args)) {
            if (!channel) {
                return msg.reply(msg.author.username + " me ajuda a te ajudar brother. Tu tem que estar em um canal de voz pra mágica rolar.");
            }
            audio.playAudio(numberOfAudio, msg, channel);
            msg.channel.send(`${msg.author.username}: :loud_sound: ${textContentLineByLine[numberOfAudio - 1].replace(/[0-9]\s-\s/g, "")}`);
        } else {
            msg.reply("Não entendi, porra, manda de novo.");
        }
    }
}
