const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
  name: "bet",
  category: "economy",
  description: "Bet money.",
  permissions: [],
  cooldown: 15,
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
          "Betting value not given."
        ),
      ],
    });

  if (!bal || bal == 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have enough money."
        ),
      ],
    });

  if (args[0] === "all") {
    let money = parseInt(bal);

    if (chance > 70) {
      message.channel.send({
        embeds: [
          client
            .embedBuilder(client, message, "", "", "#3db39e")
            .addField("Amount:", `$${money}`, true)
            .addField("Result:", "You won!", true)
            .setAuthor("Betting", `https://cdn.upload.systems/uploads/HJGA3pxp.png`),
        ],
      });

      db.add(`money_${message.guild.id}_${message.author.id}`, money);
    } else if (chance < 70) {
      message.channel.send({
        embeds: [
          client
            .embedBuilder(client, message, "", "", "RED")
            .addField("Amount:", `$${money}`, true)
            .addField("Result:", "You lost!", true)
            .setAuthor("Betting", `https://cdn.upload.systems/uploads/HJGA3pxp.png`),
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
          .embedBuilder(client, message, "", "", "#3db39e")
          .addField("Amount:", `$${args[0]}`, true)
          .addField("Result:", `You won!`, true)
          .setAuthor("Betting", `https://cdn.upload.systems/uploads/HJGA3pxp.png`),
      ],
    });

    db.add(`money_${message.guild.id}_${message.author.id}`, money);
  } else if (chance < 70) {
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "RED")
          .addField("Amount:", `$${args[0]}`, true)
          .addField("Result:", `You lost!`, true)
          .setAuthor("Betting", `https://cdn.upload.systems/uploads/HJGA3pxp.png`),
      ],
    });

    db.subtract(`money_${message.guild.id}_${message.author.id}`, money);
  }
};
