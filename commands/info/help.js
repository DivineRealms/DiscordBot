module.exports = {
    description: 'Get this bots help menu.',
    aliases: [],
    usage: 'help'
}

module.exports.run = async(client, message, args) => {
    message.channel.send(new client.embed()
        .setTitle(`${client.user.username} Help Menu`)
        .addField('Command List', `\`${message.px}commands\``)
        .addField('Command Help', `\`${message.px}commands [command]\``)
        .addField('Prefix', `\`${message.px}\``)
        .addField('Additional Links', '[Purchase Me](https://discord.gg/VstQPFP) | [Support](https://discord.gg/VstQPFP)')
    )
}