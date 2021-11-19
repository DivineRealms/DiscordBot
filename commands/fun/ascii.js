const figlet = require('figlet')

module.exports = {
    description: 'Lets you turn text into ascii art.',
    permissions: [],
    aliases: [`cooltext`],
    usage: 'ascii <text>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription('Please provide some text').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    figlet.text(args.join(' '), (err, data) => {
        if (err) return
        if (data.length > 2000)
            return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry please provide a text shorter than 2000 charachters!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
        message.channel.send('```\n' + data + '```')
    })
}