const db = require('quick.db')

module.exports = {
    description: 'Try to rob that one dood you want.',
    permissions: [],
    aliases: ['r0b'],
    usage: 'rob <@User>'
}

module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.member(args[0])

    if (!member) return message.channel.send({ embeds: [new client.embed().setDescription('Please specify a user to rob!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
    if (member.id === message.author.id) return message.channel.send({ embeds: [new client.embed().setDescription('Why are you trying to rob yourself?').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (member.user.tag === 'Fuel#2649') return message.channel.send({ embeds: [new client.embed().setDescription('Why are you trying to rob my creator.. You\'re dumb lmao..').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    const authordata = client.members.get(message.guild.id, message.author.id)
    const memberbal = client.members.ensure(message.guild.id, client.memberSettings, member.id).balance
    const rob = ~~(Math.random() * 3)
    const amount = ~~(memberbal.wallet / 10)

    if (!authordata.inventory.items.some(s => s.name.includes('🔧'))) return message.channel.send({ embeds: [new client.embed().setDescription(`You need to buy a **crowbar** to rob a person!\nBuy one in the shop using \`${message.px}shop\``)]})
    if (!authordata.balance.wallet < 100) return message.channel.send({ embeds: [new client.embed().setDescription(`You need at least **100** ${message.coin} in your wallet to rob a person!`)]})

    if (!memberbal.wallet) return message.channel.send({ embeds: [new client.embed().setDescription('That user doesnt have any money on them to rob!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    if (rob) {
        message.channel.send({ embeds: [new client.embed().setDescription(`You attempted to rob ${member} but got caught! the fine is **${amount}** ${message.coin}!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
        client.members.math(message.guild.id, '-', amount, `${message.author.id}.balance.wallet`)
    } else {
        message.channel.send({ embeds: [new client.embed().setDescription(`You successfully robbed ${member} gaining yourself **${amount}** ${message.coin}!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
        client.members.math(message.guild.id, '+', amount, `${message.author.id}.balance.wallet`)
        client.members.math(message.guild.id, '-', amount, `${member.id}.balance.wallet`)
    }
}