const fetch = require('node-fetch');

module.exports = {
    description: 'Lets you turn text into ascii art.',
    aliases: [`cooltext`],
    usage: 'ascii <text>'
}

module.exports.run = async(client, message, args) => {
    const res = await fetch('http://api.adviceslip.com/advice').then(r => r.json())
    message.channel.send(new client.embed().setDescription(res.slip.advice).setFooter(`${message.guild.name} | Advice Given By Fuel#2649`, message.guild.iconURL({ dynamic: true })))
}