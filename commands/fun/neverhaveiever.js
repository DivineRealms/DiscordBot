const fetch = require('node-fetch')
const { load } = require('cheerio')

module.exports = {
    name: 'neverhaveiever',
    description: 'Get asked never have I ever questions.',
    permissions: [],
    cooldown: 0,
    aliases: ['nvhie'],
    usage: 'Neverhaveiever'
}

module.exports.run = async(client, message, args) => {
    const page = await fetch('https://randomwordgenerator.com/never-have-i-ever-question.php').then(r => r.text())
    const nhie = load(page)('.support-sentence').text()

    message.channel.send({ embeds: [new client.embed().setDescription(`${nhie.slice(13, nhie.length)}`).setTitle(`Never Have I Ever...`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
}