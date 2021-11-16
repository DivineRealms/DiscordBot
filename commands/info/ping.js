module.exports = {
    description: 'Allows you to view the bots ping.',
    aliases: ['pings', 'bping'],
    usage: 'ping'
}

module.exports.run = async(client, message, args) => {
    message.channel.send(`Checking Ping for ${message.guild.name}!`).then(msg3 => {
        message.channel.send(`Ping Results!`).then(msg => {
            const Ping2 = new client.embed().setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })).setDescription(
                `Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${client.ws.ping}ms`)
            msg.edit({ content: '', embed: Ping2 })
            msg3.edit(`Ping results for **${message.guild.name}**!`)
        })
    })
}