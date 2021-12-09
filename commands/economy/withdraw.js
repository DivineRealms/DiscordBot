const db = require("quick.db");

module.exports = {
  name: "withdraw",
  category: "economy",
  description: "Get your money on hand into your bank.",
  permissions: [],
  cooldown: 0,
  aliases: ["wd", "w"],
  usage: "w <amount | all>",
};

module.exports.run = async (client, message, args) => {
  let bank = db.fetch(`bank_${message.guild.id}_${message.author.id}`),
    balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!args[0] || (isNaN(args[0]) && args[0] !== "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You must provide an amount to deposit."
        ),
      ],
    });

  if (args[0] === "all") {
    if (!bank || bank == 0)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have money to withdraw."
          ),
        ],
      });

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor(
            `You have withdrawn $${bank} from the bank.`,
            `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          ),
      ],
    });

    db.subtract(`bank_${message.guild.id}_${message.author.id}`, Number(bank));
    db.add(`money_${message.guild.id}_${message.author.id}`, Number(bank));
    return;
  }
  if (args[0] > bank)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You cannot withdraw that much."
        ),
      ],
    });

  if (args[0] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You cannot withdraw less than $1."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `You have withdrawn $${Number(args[0])} from the bank.`,
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });

  db.add(`money_${message.guild.id}_${message.author.id}`, Number(args[0]));
  db.subtract(`bank_${message.guild.id}_${message.author.id}`, Number(args[0]));
};
