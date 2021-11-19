module.exports = {
    description: 'Lets you revoke a certain role from a member.',
    permissions: [],
    aliases: ['remover', 'removerole'],
    usage: 'remove-role <@User | ID> <@Role | ID | Name>'
}


module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('MANAGE_ROLES')) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry! You are missing the permission \`MANAGE_ROLES\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }));

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => [r.name, r.id].includes(args.slice(1).join(' ')))

    if (!member || !role) return message.channel.send({ embeds: [new client.embed().setDescription(`To remove a role from a member, you need to do\n\`${message.px}remove-role <@User | ID> <@Role | ID | Name>\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('That member has higher roles than you, you cant remove a role from them!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('That member has higher roles than me, I cant remove a role from them!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (!member.roles.cache.has(role.id)) return message.channel.send({ embeds: [new client.embed().setDescription(`That member doesnt have the role ${role}!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))

    const embed = new client.embed()
        .setTitle(`Successfully Removed Role!`)
        .addField('Member', member.user)
        .addField('Moderator', message.author)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addField('Role', role)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

    return member.roles.remove(role).then(() =>
        message.channel.send({ embeds: [embed] })).catch(() => message.channel.send({ embeds: [new client.embed().setDescription('I cant remove that role from that member!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 })))
}