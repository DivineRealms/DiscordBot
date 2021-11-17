module.exports = {
    description: 'Lets you give a certain role to a member.',
    aliases: ['giver', 'giverole'],
    usage: 'give-role <@User | ID> <@Role | ID | Name>'
}


module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(new client.embed().setDescription(`Sorry! You are missing the permission \`MANAGE_ROLES\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))).then(m => m.delete({ timeout: 9000 }));

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => [r.name, r.id].includes(args.slice(1).join(' ')))

    if (!member || !role) return message.channel.send(new client.embed().setDescription(`To give a role from a member, you need to do\n\`${message.px}give-role <@User | ID> <@Role | ID | Name>\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))).then(m => m.delete({ timeout: 9000 }))
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User has higher roles than you.", "RED")] });
    if (member.roles.highest.rawPosition >= message.guild.me.roles.highest.rawPosition) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That User has higher role than me.", "RED")] });
    if (member.roles.cache.has(role.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "That Member already has that role.", "RED")] });

    const embed = new client.embed()
        .setTitle(`Successfully add Role!`)
        .addField('Member', member.user)
        .addField('Moderator', message.author)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addField('Role', role)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    return member.roles.add(role).then(() =>
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Cannot add role to member.", "RED")] }).then(m => m.delete({ timeout: 9000 })))
}