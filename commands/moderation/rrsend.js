const { ApplicationCommandOptionType, SelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rrsend",
  category: "moderation",
  description: "Send Reaction Roles Menu",
  permissions: ["ManageGuild"],
  cooldown: 0,
  aliases: [`sendrr`],
  usage: "rrsend <Category>",
  slash: true,
  options: [
    {
      name: "category",
      description: "Reaction Role category which to send",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],
};

module.exports.run = async (client, message, args) => {
  const category = args[0];
  const rolesList = client.conf.Settings.Reaction_Roles;

  if (!category)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You didn't provide Reaction Role Category."
        ),
      ],
    });
    
  const findRoles = rolesList.find((x) => x.name.toLowerCase() == category.toLowerCase());
  if(!findRoles) 
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You didn't provide Reaction Role Category."
        ),
      ],
    });

  const options = [];
  findRoles.roles.forEach((x) => {
    options.push({
      label: x.label,
      value: x.id,
      emoji: x.emoji,
      description: x.placeholder
    })
  });

  const selectMenu = new SelectMenuBuilder()
    .setPlaceholder("Select roles you want to receive.")
    .setCustomId(`reactionRoles_${findRoles.name}`)
    .setMaxValues(options.length)
    .setMinValues(0)
    .addOptions(options);

  const selectRow = new ActionRowBuilder()
    .addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setTitle(findRoles.title)
    .setDescription(findRoles.description)
    .setColor(findRoles.color)

  message.channel.send({
    embeds: [embed], components: [selectRow]
  });
};

module.exports.slashRun = async (client, interaction) => {
  const category = interaction.options.getString("category");
  const rolesList = client.conf.Settings.Reaction_Roles;

  if (!category)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You didn't provide Reaction Role Category."
        ),
      ], ephemeral: true
    });
    
  const findRoles = rolesList.find((x) => x.name.toLowerCase() == category.toLowerCase());
  if(!findRoles) 
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You didn't provide Reaction Role Category."
        ),
      ], ephemeral: true
    });

  const options = [];
  findRoles.roles.forEach((x) => {
    options.push({
      label: x.label,
      value: x.id,
      emoji: x.emoji,
      description: x.placeholder
    })
  });

  const selectMenu = new SelectMenuBuilder()
    .setPlaceholder("Select roles you want to receive.")
    .setCustomId(`reactionRoles_${findRoles.name}`)
    .setMaxValues(options.length)
    .setMinValues(0)
    .addOptions(options);

  const selectRow = new ActionRowBuilder()
    .addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setTitle(findRoles.title)
    .setDescription(findRoles.description)
    .setColor(findRoles.color)

  interaction.reply({
    embeds: [
      client.utils.errorEmbed(
        client,
        interaction,
        "Reaction Role menu have been sent successfully."
      ),
    ], ephemeral: true
  });

  interaction.channel.send({
    embeds: [embed], components: [selectRow]
  });
};
