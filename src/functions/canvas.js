const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    async drawCanvas(msg){
        const authorImage = msg.author.displayAvatarURL({ format: "png" });
        const mentionImage = msg.mentions.members.first().user.displayAvatarURL({ format: 'png' });
        const authorUsername = msg.author.username;
        const mentionUsername = msg.mentions.users.first().username;

        const canvas = Canvas.createCanvas(264, 83);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage("../assets/img/fundoTip.png");

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(authorImage);
        context.drawImage(avatar, 25, 6, 58, 58);
        const avatar2 = await Canvas.loadImage(mentionImage);
        context.drawImage(avatar2, 184, 6, 58, 58);

        context.font = '12px sans-serif';

        context.fillStyle = '#ffffff';

        context.fillText(authorUsername, 25, 75);
        context.fillText(mentionUsername, 184, 75);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'tip.png');

        msg.reply({ files: [attachment] });
    }
}