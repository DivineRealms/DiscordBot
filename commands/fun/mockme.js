module.exports = {
    description: 'Mocks whatever you enter.',
    aliases: ['mock'],
    usage: 'mockme <words>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send(new client.embed().setDescription(`You need to give me something to mock!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    const mock = args.join(' ').split('').map((s, i) => i % 2 ? s.toLowerCase() : s.toUpperCase()).join('')
    message.channel.send(mock)
}