const db = require("quick.db");

module.exports = {
  name: "deposit",
  category: "economy",
  description: "Deposit your money on hand into your bank.",
  permissions: [],
  cooldown: 0,
  aliases: ["d"],
  usage: "d <amount | all>",
};

module.exports.run = async (client, message, args) => {
  let bal = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!args[0] || (isNaN(args[0]) && args[0] !== "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter an amount to deposit."
        ),
      ],
    });

  if (!bal || bal == 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have enough money to deposit."
        ),
      ],
    });

  if (args[0] === "all") {
    if (!bal || bal == 0)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money to deposit."
          ),
        ],
      });

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: `You have deposited $${bal} to the bank.`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });

    db.subtract(`money_${message.guild.id}_${message.author.id}`, Number(bal));
    db.add(`bank_${message.guild.id}_${message.author.id}`, Number(bal));
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

  if (args[0] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You cannot deposit less than $1."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: `You have deposited $${Number(args[0])} to the bank.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        }),
    ],
  });

  db.subtract(
    `money_${message.guild.id}_${message.author.id}`,
    Number(args[0])
  );

  db.add(`bank_${message.guild.id}_${message.author.id}`, Number(args[0]));
};
