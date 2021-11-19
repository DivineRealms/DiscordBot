module.exports = {
    description: 'Check how long the bot has been up.',
    permissions: [],
    aliases: ['utime', 'binfo'],
    usage: 'uptime'
}

module.exports.run = async(client, message, args) =>
    message.channel.send({ embeds: [new client.embed()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addField('Uptime', client.utils.formatTime(client.uptime, { conjunction: " and ", serialComma: false, round: true }))]})