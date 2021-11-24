const db = require('quick.db')

module.exports = {
    name: 'rob',
    category: 'economy',
    description: 'Try to rob that one dood you want.',
    permissions: [],
    cooldown: 120,
    aliases: ['r0b'],
    usage: 'rob <@User>'
}

module.exports.run = async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

    if (!member) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to provide user.`, "RED")] });
    if (member.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You cannot rob yourself.`, "RED")] });

    const memberbal = db.fetch(`money_${message.guild.id}_${member.id}`);
    const rob = ~~(Math.random() * 3)
    const amount = ~~(memberbal / 10)

    if (!memberbal || memberbal < 200) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `That Member doesn't have money.`, "RED")] });
    if (rob) {
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Rob", `You attempted to rob ${member} but got caught! The fine is **${amount}**.`, "RED")] });
        db.subtract(`money_${message.guild.id}_${message.author.id}`, amount);
    } else {
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Rob", `You successfully robbed ${member} gaining yourself **${amount}**.`, "RED")] });
        db.subtract(`money_${message.guild.id}_${message.author.id}`, amount);
        db.add(`money_${message.guild.id}_${message.author.id}`, amount);
    }
}