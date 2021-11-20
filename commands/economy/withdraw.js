const db = require('quick.db')

module.exports = {
    name: 'withdraw',
    category: 'economy',
    description: 'Get your money on hand into your bank.',
    permissions: [],
    cooldown: 0,
    aliases: ['wd', 'w'],
    usage: 'w <amount | all>'
}

module.exports.run = async(client, message, args) => {
    let bank = db.fetch(`bank_${message.guild.id}_${message.author.id}`);
    let balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);

    if (!args[0] || (isNaN(args[0]) && args[0] !== 'all')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You must provide amount to deposit.", "RED")] });

    if (args[0] === 'all') {
      message.channel.send({ embeds: [client.embedBuilder(client, message, "Withdraw", `You have withdrawed $${bank} from bank.`, "YELLOW")] });
      db.subtract(`bank_${message.guild.id}_${message.author.id}`, Number(args[0]));
      db.add(`money_${message.guild.id}_${message.author.id}`, Number(args[0]));
      return;
    }
    if (args[0] > balance) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot withdraw that much.", "RED")] });
    if (args[0] < 1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot withdraw less than $1.", "RED")] });

    message.channel.send({ embeds: [client.embedBuilder(client, message, "Withdraw", `You have withdrawed $${Number(args[0])} from bank.`, "YELLOW")] });
    db.add(`money_${message.guild.id}_${message.author.id}`, Number(args[0]));
    db.subtract(`bank_${message.guild.id}_${message.author.id}`, Number(args[0]));
}