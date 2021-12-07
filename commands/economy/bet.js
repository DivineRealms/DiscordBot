const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
  name: "bet",
  category: "economy",
  description: "Bet money.",
  permissions: [],
  cooldown: 120,
  aliases: [],
  usage: "bet <amount | all>",
};

module.exports.run = async (client, message, args) => {
  let bal = db.fetch(`money_${message.guild.id}_${message.author.id}`),
    chance = Math.floor(Math.random() * 100) + 1;

  if (!args[0] || (isNaN(args[0]) && args[0] !== "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter how much to bet."
        ),
      ],
    });

  if (!bal || bal == 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have money to bet."
        ),
      ],
    });

  if (args[0] === "all") {
    let money = parseInt(bal);

    if (chance > 70) {
      message.channel.send({
        embeds: [
          client
            .embedBuilder(client, message, "Betting", "", "GREEN")
            .addField("Bet:", `$${money}`)
            .addField("Result:", "You won!"),
        ],
      });

      db.add(`money_${message.guild.id}_${message.author.id}`, money);
    } else if (chance < 70) {
      message.channel.send({
        embeds: [
          client
            .embedBuilder(client, message, "Betting", "", "RED")
            .addField("Bet:", `$${money}`)
            .addField("Result:", "You lost!"),
        ],
      });

      db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
    }

    return;
  }

  if (args[0] > bal)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have that much money."
        ),
      ],
    });

  if (args[0] < 200)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You cannot bet less than $200."
        ),
      ],
    });

  let money = parseInt(args[0]);

  if (chance > 70) {
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "Betting", "", "GREEN")
          .addField("Bet:", `$${args[0]}`)
          .addField("Result:", `You won!`),
      ],
    });

    db.add(`money_${message.guild.id}_${message.author.id}`, money);
  } else if (chance < 70) {
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "Betting", "", "RED")
          .addField("Bet:", `$${args[0]}`)
          .addField("Result:", `You lost!`),
      ],
    });

    db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
  }
};
