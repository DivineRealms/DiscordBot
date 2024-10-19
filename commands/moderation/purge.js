const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "purge",
  category: "moderation",
  description: "Clears the requested ammount of messages.",
  permissions: ["ManageMessages"],
  cooldown: 0,
  aliases: ["clear"],
  usage: "purge <count>",
  slash: true,
  options: [
    {
      name: "amount",
      description: "Number of messages to purge",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  if (!args[0] || isNaN(args[0]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide amount of messages to remove."),
      ],
    });

  if (args[0] > 100)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot purge more than 100 messages at once."),
      ],
    });

  if (args[0] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to delete at least 1 message."),
      ],
    });

  message.channel
    .bulkDelete(args[0], true)
    .then((_messages) => {
      message.reply({
        embeds: [
          client.embedBuilder(client, message, `You have purged ${args[0]} mesages.`, "", "#f44336"),
        ],
      });
    })
    .catch(() =>
      client.utils.errorEmbed(client, message, "Cannot remove messages older than 14 days."),
    );
};

module.exports.slashRun = async (client, interaction) => {
  const amount = interaction.options.getNumber("amount");

  if (amount > 100)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot purge more than 100 messages at once."),
      ],
      ephemeral: true,
    });

  if (amount < 1)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You need to delete at least 1 message."),
      ],
      ephemeral: true,
    });

  interaction.channel
    .bulkDelete(amount, true)
    .then((_messages) => {
      interaction.reply({
        embeds: [
          client.embedBuilder(client, interaction, `You have purged ${amount} mesages.`, "", "#f44336"),
        ],
        ephemeral: true,
      });
    })
    .catch(() =>
      client.utils.errorEmbed(client, interaction, "Cannot remove messages older than 14 days.")
    );
};
