const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "modifybal",
  category: "economy",
  description: "Remove or add money to a user on the server.",
  permissions: ["Administrator"],
  cooldown: 0,
  aliases: ["modifyb"],
  usage: "modifybal [@User] <add | remove> <wallet | bank> <amount>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User whose balance to modify",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "action",
      description: "Action you want to do",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "add",
          value: "add",
        },
        {
          name: "remove",
          value: "remove",
        },
      ],
      required: true,
    },
    {
      name: "type",
      description: "Which money to edit, wallet or bank",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "wallet",
          value: "wallet",
        },
        {
          name: "bank",
          value: "bank",
        },
      ],
      required: true,
    },
    {
      name: "amount",
      description: "Amount to modify",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const user =
    message.mentions.users.first() || client.users.cache.get(args[0]);

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to mention a user."),
      ],
    });

  if (!["add", "remove"].includes(args[1]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to specify do you want to add or remove."
        ),
      ],
    });

  if (!["wallet", "bank"].includes(args[2]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to specify if you want wallet or bank."
        ),
      ],
    });

  if (isNaN(args[3]) || args[3] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter an amount."
        ),
      ],
    });

  if (args[1].toLowerCase() == "add") {
    if (args[2].toLowerCase() == "bank") {
      await db.add(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been added to ${user.username}'s bank`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    } else if (args[2].toLowerCase() == "wallet") {
      await db.add(`money_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been added to ${user.username}'s wallet`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    }
  } else if (args[1].toLowerCase() == "remove") {
    if (args[2].toLowerCase() == "bank") {
      await db.sub(`bank_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been removed from ${user.username}'s bank`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    } else if (args[2].toLowerCase() == "wallet") {
      await db.sub(`money_${message.guild.id}_${user.id}`, Number(args[3]));
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `$${args[3]} has been removed from ${user.username}'s wallet`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
        ],
      });
    }
  }
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user");
  const action = interaction.options.getString("action");
  const type = interaction.options.getString("type");
  const amount = interaction.options.getNumber("amount");

  if (amount < 1)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You need to enter an amount."
        ),
      ],
      ephemeral: true,
    });

  if (action == "add") {
    if (type == "bank") {
      await db.add(`bank_${interaction.guild.id}_${user.id}`, Number(amount));
      interaction.reply({
        embeds: [
          client
            .embedBuilder(client, interaction, "", "", "#3db39e")
            .setAuthor({
              name: `$${amount} has been added to ${user.username}'s bank`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
        ],
      });
    } else if (type == "wallet") {
      await db.add(`money_${interaction.guild.id}_${user.id}`, Number(amount));
      interaction.reply({
        embeds: [
          client
            .embedBuilder(client, interaction, "", "", "#3db39e")
            .setAuthor({
              name: `$${amount} has been added to ${user.username}'s wallet`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
        ],
      });
    }
  } else if (action == "remove") {
    if (type == "bank") {
      await db.sub(`bank_${interaction.guild.id}_${user.id}`, Number(amount));
      interaction.reply({
        embeds: [
          client
            .embedBuilder(client, interaction, "", "", "#3db39e")
            .setAuthor({
              name: `$${amount} has been removed from ${user.username}'s bank`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
        ],
      });
    } else if (type == "wallet") {
      await db.sub(`money_${interaction.guild.id}_${user.id}`, Number(amount));
      interaction.reply({
        embeds: [
          client
            .embedBuilder(client, interaction, "", "", "#3db39e")
            .setAuthor({
              name: `$${amount} has been removed from ${user.username}'s wallet`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
        ],
      });
    }
  }
};
