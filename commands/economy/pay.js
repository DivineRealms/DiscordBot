const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "pay",
  category: "economy",
  description: "Give money to a user on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["gv"],
  usage: "pay [@User] <amount>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User to who to pay",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "amount",
      description: "Amount to pay",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const user =
      message.mentions.users.first() || client.users.cache.get(args[0]),
    bal = await db.get(`money_${message.guild.id}_${message.author.id}`);

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to mention a user."),
      ],
    });

  if (isNaN(args[1]) || args[1] < 1 || args[1].includes("-"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have entered an invalid amount."
        ),
      ],
    });

  if (bal < args[1])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You don't have enough money."
        ),
      ],
    });

  await db.add(`money_${message.guild.id}_${user.id}`, Number(args[1]));
  await db.sub(
    `money_${message.guild.id}_${message.author.id}`,
    Number(args[1])
  );

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: `You have paid $${args[1]} to ${user.tag}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user"),
    amount = interaction.options.getNumber("amount"),
    bal = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);

  if (isNaN(amount) || amount < 1 || amount.toString().includes("-"))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You have entered an invalid amount."
        ),
      ],
      ephemeral: true,
    });

  if (bal < amount)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You don't have enough money."
        ),
      ],
      ephemeral: true,
    });

  await db.add(`money_${interaction.guild.id}_${user.id}`, Number(amount));
  await db.sub(
    `money_${interaction.guild.id}_${interaction.user.id}`,
    Number(amount)
  );

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: `You have paid $${amount} to ${user.tag}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });
};
