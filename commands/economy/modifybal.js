const db = require('quick.db')

module.exports = {
    description: 'Remove or add money to a user on the server.',
    permissions: [],
    aliases: ['modifyb'],
    usage: 'modifybal [@User] <add | remove> <wallet | bank> <amount>'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0])

    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({ embeds: [new client.embed().setDescription('You are missing the permission `Administrator`!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!user) return message.channel.send({ embeds: [new client.embed().setDescription('You need to mention a person to modify their balance!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!['add', 'remove'].includes(args[1])) return message.channel.send({ embeds: [new client.embed().setDescription(`You need to specify either if your adding or removing their balance!\nExample: \`${message.px}modifyb @User add wallet 100\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (!['wallet', 'bank'].includes(args[2])) return message.channel.send({ embeds: [new client.embed().setDescription('You need to if youre adding/removing money from their bank or wallet!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (isNaN(args[3]) || args[3] < 1) return message.channel.send({ embeds: [new client.embed().setDescription('You need to enter how much money your giving/taking away from that user!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const data = client.members.ensure(message.guild.id, client.memberSettings, user.id).balance
    client.members.math(message.guild.id, args[1] === 'add' ? '+' : '-', Number(args[3]), `${user.id}.balance.${args[2]}`)
    message.channel.send({ embeds: [new client.embed().setDescription(`${args[3]} ${message.coin} has been ${args[1] === 'add' ? 'added' : 'removed'} ${args[1] === 'add' ? 'to' : 'from'} ${user}'s ${args[2]}`)]})
}