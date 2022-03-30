const db = require("../functions/database");
module.exports = {
    name: "saldo",
    description: "this is a balance command",
    execute(msg) {
        let score = db.balanceAmount(msg);
        if(!score) {
            return msg.reply(`0 tips`);
        }
        return msg.reply(`${score.points} tips`);
    }
}