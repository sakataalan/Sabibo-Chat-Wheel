require("dotenv").config({ path: "../../.env" });

const { MessageEmbed } = require("discord.js");
const axios = require('axios');

const URL = process.env.API_URL;

function getRequest(path) {
    return new Promise(function (resolve, reject) {
        axios.get(path).then(
            (response) => {
                let result = response.data;
                resolve(result);
            },
                (error) => {
                reject(error);
            }
        );
    });
}

let previousTimestamp = 0;
async function getData() {
    const request = await getRequest(URL);
    const data = request.appnews.newsitems[0];

    if (data.date > previousTimestamp) {
        console.log(data.date)
        previousTimestamp = data.date;
        let timestamp = parseInt(`${data.date}000`);
        let url = data.url.replace(/\s+/g, '');
        const embed = new MessageEmbed()
            .setTitle(data.title)
            .setAuthor(data.author)
            .setTimestamp(timestamp)
            .setDescription(data.contents)
            .setURL(url)
            .setFooter(data.feedlabel)
 
        return { embeds: [ embed ] };
    }

}

module.exports = {

    getData,

}