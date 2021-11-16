const fetch = require('node-fetch')
const { load } = require('cheerio')

module.exports = {
    description: 'Get asked a random truth question!',
    aliases: [],
    usage: 'truth'
}

module.exports.run = (client, message, args) =>
    fetch(`https://fungenerators.com/random/truth-or-dare?option=truth`).then(async b =>
        message.channel.send(load((await b.text()))('h2.wow.fadeInUp.animated.animated').text())
    )