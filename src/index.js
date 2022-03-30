require("dotenv").config({ path: "../.env" });

const { Client, Intents, Collection } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const prefix = process.env.PREFIX;
const TOKEN = process.env.TOKEN;
const fs = require("fs");
const db = require("./functions/database");

client.commands = new Collection;
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("ready");
    db.databaseInit();
})

client.on("messageCreate", async msg => {

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args
        .shift()
        .toLowerCase();

    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    if (command == "cw") {
        client.commands.get("cw").execute(msg, args);
    } else if (command == "tip") {
        client.commands.get("tip").execute(msg);
    } else if(command == "saldo") {
       client.commands.get("saldo").execute(msg);
    } else if(command == "list") {
        client.commands.get("list").execute(msg);
    } else if(command == "ranked") {
        client.commands.get("ranked").execute(msg, client);
    } else {
        msg.reply("Não entendi, porra, manda de novo.");
    }

})

client.login(TOKEN);
