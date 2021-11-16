const fetch = require('node-fetch')
const { load } = require('cheerio')

module.exports = {
    description: 'Get asked never have I ever questions.',
    aliases: ['nvhie'],
    usage: 'Neverhaveiever'
}

module.exports.run = async(client, message, args) => {
    const fetch = require('node-fetch')
    const { load } = require('cheerio')

    const page = await fetch('https://randomwordgenerator.com/never-have-i-ever-question.php').then(r => r.text())
    const nhie = load(page)('.support-sentence').text()

    message.channel.send(new client.embed().setDescription(`${nhie.slice(13, nhie.length)}`).setTitle(`Never Have I Ever...`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
}