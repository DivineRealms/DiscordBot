const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = {
  name: "bet",
  category: "economy",
  description: "Bet money.",
  permissions: [],
  cooldown: 15,
  aliases: [],
  usage: "bet <amount | all>",
  slash: true,
  options: [{
    name: "amount",
    description: "Amount you want to bet or 'all'",
    type: Discord.ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  let bal = await db.get(`money_${message.guild.id}_${message.author.id}`),
    chance = Math.floor(Math.random() * 100) + 1;

  if (!args[0] || (isNaN(args[0]) && args[0] !== "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Betting value not given."),
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
          client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
            name: `You won $${money}!`,
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
        ],
      });

      await db.add(`money_${message.guild.id}_${message.author.id}`, money);
    } else if (chance < 70) {
      message.channel.send({
        embeds: [
          client.embedBuilder(client, message, "", "", "RED").setAuthor({
            name: `You lost $${money}.`,
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
        ],
      });

      await db.sub(`money_${message.guild.id}_${message.author.id}`, money);
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
        client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
          name: `You won $${args[0]}!`,
          iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
        }),
      ],
    });

    await db.add(`money_${message.guild.id}_${message.author.id}`, money);
  } else if (chance < 70) {
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, "", "", "RED").setAuthor({
          name: `You lost ${args[0]}.`,
          iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
        }),
      ],
    });

    await db.sub(`money_${message.guild.id}_${message.author.id}`, money);
  }
};

module.exports.slashRun = async (client, interaction) => {
  let bal = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`),
    chance = Math.floor(Math.random() * 100) + 1,
    amount = interaction.options.getString("amount");

  if ((isNaN(amount) && amount != "all"))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Betting value not given."),
      ],
    });

  if (!bal || bal == 0)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You don't have enough money."
        ),
      ],
    });

  if (amount == "all") {
    let money = parseInt(bal);

    if (chance > 70) {
      interaction.reply({
        embeds: [
          client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
            name: `You won $${money}!`,
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
        ],
      });

      await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    } else if (chance < 70) {
      interaction.reply({
        embeds: [
          client.embedBuilder(client, interaction, "", "", "RED").setAuthor({
            name: `You lost $${money}.`,
            iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
          }),
        ],
      });

      await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, money);
    }

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

  if (amount < 200)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You cannot bet less than $200."
        ),
      ],
    });

  let money = parseInt(amount);

  if (chance > 70) {
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
          name: `You won $${amount}!`,
          iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
        }),
      ],
    });

    await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, money);
  } else if (chance < 70) {
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "RED").setAuthor({
          name: `You lost ${amount}.`,
          iconURL: `https://cdn.upload.systems/uploads/HJGA3pxp.png`,
        }),
      ],
    });

    await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, money);
  }
};
