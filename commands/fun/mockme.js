module.exports = {
    name: 'mockme',
    category: 'fun',
    description: 'Mocks whatever you enter.',
    permissions: [],
    cooldown: 0,
    aliases: ['mock'],
    usage: 'mockme <words>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to give me something to mock!", "error")]})
    const mock = args.join(' ').split('').map((s, i) => i % 2 ? s.toLowerCase() : s.toUpperCase()).join('')
    message.channel.send(mock)
}