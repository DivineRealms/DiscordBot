module.exports = {
    name: 'lockchannel',
    category: 'moderation',
    description: 'Lets you lock a channel in the guild.',
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    aliases: ['lockc', 'lock'],
    usage: 'lockchannel <#Channel>'
}
module.exports.run = async(client, message, args) => {
    const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

    if (!channel) {
        return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You must provide Valid Channel.", "RED")] });
    }

    channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
        })

    message.guild.roles.cache.forEach((role) => {
        channel.permissionOverwrites.edit(role.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            })
    });

    channel.send({ embeds: [client.embedBuilder(client, message, "Channel Locked", "This Channel have been successfully locked.")] });
}
