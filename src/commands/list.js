const fs = require("fs");

module.exports = {
    name: "list",
    description: "this is a list command",
    execute(msg) {
        let textContent = fs.readFileSync('../text.txt', 'utf-8');
        msg.channel.send(textContent);
    }
}