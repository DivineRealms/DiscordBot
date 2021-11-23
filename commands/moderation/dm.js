module.exports = {
    name: 'dm',
    category: 'moderation',
    description: 'I will dm someone for you.',
    permissions: ["MANAGE_GUILD"],
    cooldown: 0,
    aliases: [`direct-message`],
    usage: 'dm <Text>'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if (!user) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have provided invalid user.", "RED")] });

    const text = args.slice(1).join(' ');

    if (!text) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide text to send.", "RED")] });

    user.send({ content: text }).catch(() => {
        return  message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "This User has theirs DMs Closed.", "RED")] });
    });

    message.channel.send({ embeds: [client.embedBuilder(client, message, "DM", `DM have been successfully sent to ${user.username}`, "YELLOW")] });
}