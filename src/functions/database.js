const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const SQLite = require("better-sqlite3");
const sql = new SQLite("./sql/scores.sqlite");

module.exports = {
    databaseInit(){
        const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
        if (!table['count(*)']) {
            sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, username TEXT, points INTEGER);").run();
            sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();

            sql.pragma("synchronous = 1");
            sql.pragma("journal_mode = wal");
        }

        client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, username, points) VALUES (@id, @user, @guild, @username, @points);");
    },

    checkAndIncreaseScore(msg, mentionID, mentionUsername){
        let score = client.getScore.get(mentionID, msg.guild.id);

        if (!score) {
            score = {
                id: `${msg.guild.id}-${mentionID}`,
                user: mentionID,
                guild: msg.guild.id,
                points: 0,
            }
        }

        if (!score.username) {
            score.username = mentionUsername;
        }

        score.points++;
        client.setScore.run(score);
    },

    balanceAmount(msg){
        let score = client.getScore.get(msg.author.id, msg.guild.id);
        return score;
    },

    ranking(msg) {
        const rank = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;").all(msg.guild.id);
        return rank;
    }
}