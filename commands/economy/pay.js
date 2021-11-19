const db = require('quick.db')

module.exports = {
    description: 'Give money to a user on the server.',
    permissions: [],
    aliases: ['gv'],
    usage: 'give [@User] <amount>'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    let bal = db.fetch(`money_${message.guild.id}_${message.author.id}`);

    if (!user) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to mention user.`, "RED")] });
    if (isNaN(args[1]) || args[1] < 1 || args[1].includes("-")) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You have entered invalid amount.`, "RED")] });
    if (bal < args[1]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have enought money.`, "RED")] });

    db.add(`money_${message.guild.id}_${user.id}`, Number(args[1]));
    db.subtract(`money_${message.guild.id}_${message.author.id}`, Number(args[1]));
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Pay", `You have paid $${args[1]} to ${user}.`, "YELLOW")] });
}