const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "deposit",
  category: "economy",
  description: "Deposit your money on hand into your bank.",
  permissions: [],
  cooldown: 0,
  aliases: ["d"],
  usage: "d <amount | all>",
  slash: true,
  options: [{
    name: "amount",
    description: "Amount you want to deposit or 'all'",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let bal = await db.get(`money_${message.guild.id}_${message.author.id}`);

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

  if (!bal || bal < 1)
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

    await db.sub(`money_${message.guild.id}_${message.author.id}`, Number(bal));
    await db.add(`bank_${message.guild.id}_${message.author.id}`, Number(bal));
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

  await db.sub(
    `money_${message.guild.id}_${message.author.id}`,
    Number(args[0])
  );

  await db.add(`bank_${message.guild.id}_${message.author.id}`, Number(args[0]));
};

module.exports.slashRun = async (client, interaction) => {
  const amount = interaction.options.getString("amount");
  let bal = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);

  if (!amount || (isNaN(amount) && amount !== "all"))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You need to enter an amount to deposit."
        ),
      ],
    });

  if (!bal || bal < 1)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You don't have enough money to deposit."
        ),
      ],
    });

  if (amount === "all") {
    if (!bal || bal == 0)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "You don't have enough money to deposit."
          ),
        ],
      });

    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .setAuthor({
            name: `You have deposited $${bal} to the bank.`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });

    await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, Number(bal));
    await db.add(`bank_${interaction.guild.id}_${interaction.user.id}`, Number(bal));
    return;
  }

  if (amount > bal)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You don't have that much money."
        ),
      ],
    });

  if (amount < 1)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You cannot deposit less than $1."
        ),
      ],
    });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#3db39e")
        .setAuthor({
          name: `You have deposited $${Number(amount)} to the bank.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        }),
    ],
  });

  await db.sub(
    `money_${interaction.guild.id}_${interaction.user.id}`,
    Number(amount)
  );

  await db.add(`bank_${interaction.guild.id}_${interaction.user.id}`, Number(amount));
};
