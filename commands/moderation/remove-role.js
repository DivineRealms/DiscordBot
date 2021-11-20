module.exports = {
    description: 'Lets you revoke a certain role from a member.',
    permissions: ["MANAGE_ROLES"],
    aliases: ['remover', 'removerole'],
    usage: 'remove-role <@User | ID> <@Role | ID | Name>'
}


module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => [r.name, r.id].includes(args.slice(1).join(' ')))

    if (!member || !role) return message.channel.send({ embeds: [new client.embed().setDescription(`To remove a role from a member, you need to do\n\`${message.px}remove-role <@User | ID> <@Role | ID | Name>\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('That member has higher roles than you, you cant remove a role from them!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send({ embeds: [new client.embed().setDescription('That member has higher roles than me, I cant remove a role from them!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))
    if (!member.roles.cache.has(role.id)) return message.channel.send({ embeds: [new client.embed().setDescription(`That member doesnt have the role ${role}!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]}).then(m => m.delete({ timeout: 9000 }))

    message.channel.send({ embeds: [client.embedBuilder(client, message, "Remove Role", `Successfully removed role ${role} from ${member}.`, "YELLOW")] });

    return member.roles.remove(role).catch((err) => {
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Cannot remove role from that user.", "RED")] });
    })
}