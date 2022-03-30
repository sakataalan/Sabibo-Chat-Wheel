const { MessageEmbed } = require("discord.js");
const db = require("../functions/database");

module.exports = {
    name: "ranked",
    descript: "this is a leaderboard command",
    execute(msg, client) {
        const usersAndPoints = db.ranking(msg);
        let position = 1;
        const embed = new MessageEmbed()
            .setTitle("Ranking")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription("TOP CORNOS")
            .setColor(0x00AE86);
            
        for (const data of usersAndPoints) { 
            embed.addFields({ 
                name: `${position}˚ ` + data.username,
                value: `${data.points} tips` 
            });
          
            position++;
        }
        return msg.channel.send({ embeds: [ embed ]});
    }
} 