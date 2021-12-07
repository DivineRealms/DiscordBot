const db = require('quick.db')
const Discord = require('discord.js')

module.exports = {
  name: 'bet',
  category: 'economy',
  description: 'Bet money.',
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: 'bet <amount | all>'
}

module.exports.run = async(client, message, args) => {
  let bal = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!args[0] || (isNaN(args[0]) && args[0] !== 'all')) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You need to enter how much to bet.", "", "error")] });
  if (!bal || bal == 0) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You don't have money to bet.", "", "error")] });
  let chance = Math.floor(Math.random() * 100) + 1;
  if (args[0] === 'all') {
    let money = parseInt(bal);
    if (chance > 70) {
      let winembed = client.embedBuilder(client, message, "Betting", "")
        .addField("Bet", `$${money}`)
        .addField("Result", `You have won in game!`)
        .setColor("GREEN");

      message.channel.send({ embeds: [winembed] });
      db.add(`money_${message.guild.id}_${message.author.id}`, money);
    } else if(chance < 70) {
      let failembed = client.embedBuilder(client, message, "Betting", "")
        .addField("Bet", `$${money}`)
        .addField("Result", `You have lost in game!`)
        .setColor("RED");

      message.channel.send({ embeds: [failembed] });
      db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
    }
  return;
  }

  if (args[0] > bal) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You don't have that much money.", "", "error")] });
  if (args[0] < 200) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You cannot bet less than $200.", "", "error")] });
  
  let money = parseInt(args[0]);

  if (chance > 70) {
    let winembed = client.embedBuilder(client, message, "Betting", "")
      .addField("Bet", `$${args[0]}`)
      .addField("Result", `You have won in game!`)
      .setColor("GREEN");

    message.channel.send({ embeds: [winembed] });
    db.add(`money_${message.guild.id}_${message.author.id}`, money);
  } else if(chance < 70) {
    let failembed = client.embedBuilder(client, message, "Betting", "")
      .addField("Bet", `$${args[0]}`)
      .addField("Result", `You have lost in game!`)
      .setColor("RED");

    message.channel.send({ embeds: [failembed] });
    db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
  }
}