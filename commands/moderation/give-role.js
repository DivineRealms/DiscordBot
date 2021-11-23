module.exports = {
    name: 'give-role',
    category: 'moderation',
    description: 'Lets you give a certain role to a member.',
    permissions: ["MANAGE_ROLES"],
    cooldown: 0,
    aliases: ['giver', 'giverole'],
    usage: 'give-role <@User | ID> <@Role | ID | Name>'
}


module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => [r.name, r.id].includes(args.slice(1).join(' ')))

    if (!member || !role) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide User & Role.", "RED")] });
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User has higher roles than you.", "RED")] });
    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User has higher role than me.", "RED")] });
    if (member.roles.cache.has(role.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That Member already has that role.", "RED")] });

    message.channel.send({ embeds: [client.embedBuilder(client, message, "Added Role", `Successfully added role ${role} to ${member}.`)] });

    return member.roles.remove(role).catch((err) => {
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Cannot add role to that user.", "RED")] });
    })
}
