const { evaluate } = require('mathjs')

module.exports = {
    name: 'calculator',
    category: 'utility',
    description: 'Does your math homework for you!',
    permissions: [],
    cooldown: 0,
    aliases: ['solve', 'math'],
    usage: 'calculator <Problem>'
}

module.exports.run = async(client, message, args) => {
    try {
        message.channel.send({ embeds: [new client.embed().setTitle('Math')
            .addField('Problem', '```\n' + args.join(' ') + '```')
            .addField('Solution', '```\n' + evaluate(args.join(' ')) + '```')
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    } catch (e) {
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide math problem.", "RED")] })
    }
}