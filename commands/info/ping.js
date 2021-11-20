module.exports = {
    description: 'Allows you to view the bots ping.',
    permissions: [],
    aliases: ['pings', 'bping'],
    usage: 'ping'
}

module.exports.run = async(client, message, args) => {
    message.channel.send(`Checking Ping for ${message.guild.name}!`).then(msg3 => {
        message.channel.send(`Ping Results!`).then(msg => {
            const ping = new client.embed().setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })).setDescription(
                `Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${client.ws.ping}ms`)
            msg.edit({ embeds: [ping] })
        })
    })
}