const db = require('quick.db')

module.exports = {
  name: 'deposit',
  category: 'economy',
  description: 'Deposit your money on hand into your bank.',
  permissions: [],
  cooldown: 0,
  aliases: ['d'],
  usage: 'd <amount | all>'
}

module.exports.run = async(client, message, args) => {
  let bal = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!args[0] || (isNaN(args[0]) && args[0] !== 'all')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter how much to deposit.", "error")] });
  if (!bal || bal == 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You don't have money to deposit.", "error")] });

  if (args[0] === 'all') {
    if (!bal || bal == 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You don't have money to deposit.", "error")] });
    message.channel.send({ embeds: [client.embedBuilder(client, message, "Deposit", `You have deposited $${bal} to bank.`) ]})
    db.subtract(`money_${message.guild.id}_${message.author.id}`, Number(bal));
    db.add(`bank_${message.guild.id}_${message.author.id}`, Number(bal)); 
    return;
  }

  if (args[0] > bal) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You don't have that much money.", "error")] });
  if (args[0] < 1) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot deposit less than $1.", "error")] });

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Deposit", `You have deposited $${Number(args[0])} to bank.`)] })
  db.subtract(`money_${message.guild.id}_${message.author.id}`, Number(args[0]));
  db.add(`bank_${message.guild.id}_${message.author.id}`, Number(args[0])); 
}
