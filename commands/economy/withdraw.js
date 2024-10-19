const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "withdraw",
  category: "economy",
  description: "Get your money on hand into your bank.",
  permissions: [],
  cooldown: 0,
  aliases: ["wd", "w"],
  usage: "w <amount | all>",
  slash: true,
  options: [
    {
      name: "amount",
      description: "Amount you want to withdraw or 'all'",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let bank = await db.get(`bank_${message.guild.id}_${message.author.id}`);

  if (!args[0] || (isNaN(args[0]) && args[0] !== "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You must provide an amount to deposit."),
      ],
    });

  if (args[0] === "all") {
    if (!bank || bank == 0)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "You don't have money to withdraw."),
        ],
      });

    message.channel.send({
      embeds: [
        client.embedBuilder(client, message,  `You have withdrawn $${bank} from the bank.`, "", "#3db39e"),
      ],
    });

    await db.sub(`bank_${message.guild.id}_${message.author.id}`, Number(bank));
    await db.add(
      `money_${message.guild.id}_${message.author.id}`,
      Number(bank)
    );
    return;
  }
  if (args[0] > bank)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot withdraw that much."),
      ],
    });

  if (args[0] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot withdraw less than $1."),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `You have withdrawn $${Number(args[0])} from the bank.`, "", "#3db39e"),
    ],
  });

  await db.add(
    `money_${message.guild.id}_${message.author.id}`, Number(args[0])
  );
  await db.sub(
    `bank_${message.guild.id}_${message.author.id}`, Number(args[0])
  );
};

module.exports.slashRun = async (client, interaction) => {
  let bank = await db.get(
    `bank_${interaction.guild.id}_${interaction.user.id}`
  );
  const amount = interaction.options.getNumber("amount");

  if (isNaN(amount) && amount !== "all")
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You must provide an amount to deposit."),
      ],
      ephemeral: true,
    });

  if (amount === "all") {
    if (!bank || bank == 0)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "You don't have money to withdraw."),
        ],
        ephemeral: true,
      });

    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, `You have withdrawn $${bank} from the bank.`, "", "#3db39e"),
      ],
    });

    await db.sub(
      `bank_${interaction.guild.id}_${interaction.user.id}`, Number(bank)
    );
    await db.add(
      `money_${interaction.guild.id}_${interaction.user.id}`, Number(bank)
    );
    return;
  }
  if (amount > bank)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot withdraw that much."),
      ],
      ephemeral: true,
    });

  if (amount < 1)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot withdraw less than $1."),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `You have withdrawn $${Number(amount)} from the bank.`, "", "#3db39e"),
    ],
  });

  await db.add(
    `money_${interaction.guild.id}_${interaction.user.id}`, Number(amount)
  );
  await db.sub(
    `bank_${interaction.guild.id}_${interaction.user.id}`, Number(amount)
  );
};
