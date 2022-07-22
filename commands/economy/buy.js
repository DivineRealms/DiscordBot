const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "buy",
  category: "economy",
  description: "Buy something from the shop.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "buy <item number>",
  slash: true,
  options: [{
    name: "item",
    description: "ID of Item you want to buy",
    type: ApplicationCommandOptionType.Number,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.Economy,
    shop = [...settings.Shop_Items],
    item = shop.find((s, i) => i + 1 == args[0]),
    balance = await db.get(`money_${message.guild.id}_${message.author.id}`);

  if (!item)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have entered an invalid shop id."
        ),
      ],
    });

  if (item.Type == "role") {
    if (!balance || balance < item.Price)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money."
          ),
        ],
      });

    message.member.roles
      .add([item.Role_ID, "734759761660084268"])
      .then(async() => {
        message.channel.send({
          embeds: [
            client
              .embedBuilder(client, message, "", "", "#3db39e")
              .setAuthor({
                name: `You have successfully purchased role ${item.Name} for $${item.Price}.`,
                iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
              }),
          ],
        });
        await db.sub(
          `money_${message.guild.id}_${message.author.id}`,
          item.Price
        );
      })
      .catch(() => {
        client.utils.errorEmbed(
          client,
          message,
          "Cannot add a role to that member."
        );
      });
  } else if (item.Type == "color") {
    let colors =
      await db.get(`colors_${message.guild.id}_${message.author.id}`) || [];

    if (!balance || balance < item.Price)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money."
          ),
        ],
      });

    if (colors.includes(item.Name.toLowerCase()))
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You already have that name color."
          ),
        ],
      });

    await db.push(
      `colors_${message.guild.id}_${message.author.id}`,
      item.Name.toLowerCase()
    );

    await db.sub(`money_${message.guild.id}_${message.author.id}`, item.Price);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: `You have successfully purchased name color ${item.Name} for $${item.Price}.`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  const settings = client.conf.Economy,
    shop = [...settings.Shop_Items],
    item = shop.find((s, i) => i + 1 == interaction.options.getNumber("item")),
    balance = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);

  if (!item)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You have entered an invalid shop id."
        ),
      ],
    });

  if (item.Type == "role") {
    if (!balance || balance < item.Price)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "You don't have enough money."
          ),
        ],
      });

    interaction.member.roles
      .add([item.Role_ID, "734759761660084268"])
      .then(async() => {
        interaction.reply({
          embeds: [
            client
              .embedBuilder(client, interaction, "", "", "#3db39e")
              .setAuthor({
                name: `You have successfully purchased role ${item.Name} for $${item.Price}.`,
                iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
              }),
          ],
        });
        await db.sub(
          `money_${interaction.guild.id}_${interaction.user.id}`,
          item.Price
        );
      })
      .catch(() => {
        client.utils.errorEmbed(
          client,
          interaction,
          "Cannot add a role to that member."
        );
      });
  } else if (item.Type == "color") {
    let colors =
      await db.get(`colors_${interaction.guild.id}_${interaction.user.id}`) || [];

    if (!balance || balance < item.Price)
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "You don't have enough money."
          ),
        ],
      });

    if (colors.includes(item.Name.toLowerCase()))
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "You already have that name color."
          ),
        ],
      });

    await db.push(
      `colors_${interaction.guild.id}_${interaction.user.id}`,
      item.Name.toLowerCase()
    );

    await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, item.Price);
    interaction.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .setAuthor({
            name: `You have successfully purchased name color ${item.Name} for $${item.Price}.`,
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });
  }
};
