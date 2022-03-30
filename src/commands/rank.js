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
            const user = client.users.cache.get(data.user);
            if(user && user.tag) {
                embed.addFields({ 
                    name: `${position}˚ ` + client.users.cache.get(data.user).tag,
                    value: `${data.points} tips` 
                });
            } else {
                console.log("deu ruim");
            }
            position++;
        }
        return msg.channel.send({ embeds: [ embed ]});
    }
} 