module.exports = {
    name: 'unlockc',
    category: 'moderation',
    description: 'Lets you unlock a channel in the guild.',
    permissions: ["MANAGE_GUILD"],
    cooldown: 0,
    aliases: ['unlockchannel', 'unlock'],
    usage: 'unlockc <#Channel>'
}
module.exports.run = async(client, message, args) => {
    const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

    if (!channel) {
        return message.channel.send({ embeds: [new client.embed().setDescription(`Please provide a valid channel by mention or ID!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    }

    channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true,
        })

    message.guild.roles.cache.forEach((role) => {
        channel.permissionOverwrites.edit(role.id, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true,
            })
    });

    channel.send({ embeds: [client.embedBuilder(client, message, "Channel UnLocked", "This Channel have been successfully unlocked.", "YELLOW")] });
}