const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

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
    },
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

  const findRoles = rolesList.find(
    (x) => x.name.toLowerCase() == category.toLowerCase()
  );
  if (!findRoles)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You didn't provide Reaction Role Category."
        ),
      ],
    });

  const listOfRoles = findRoles.roles.map((x) => {
    return `\`${x.emoji}\` **${x.label}**`;
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: findRoles.title,
      iconURL: `https://cdn.upload.systems/uploads/rgGD8TcN.png`,
    })
    // .setDescription(`${listOfRoles.join("\n")}`)
    .setColor(findRoles.color);

  const chunks = [];
  let componentList = [], buttonList = [];

  for (let i = 0; i < findRoles.roles.length; i += 3) {
    const chunk = findRoles.roles.slice(i, i + 3);
    chunks.push(chunk);
  }

  for (let i = 0; i < chunks.length; i++) {
    buttonList.push(chunks[i].map((x) => {
      return new ButtonBuilder()
        .setLabel(x.label)
        .setEmoji(x.emoji)
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(x.id)
    }))
  }

  buttonList.forEach((b) => {
    componentList.push(new ActionRowBuilder()
      .addComponents(b.map((x) => x))
    )
  });

  message.channel
    .send({
      embeds: [embed],
      components: componentList
    })
    .then(async (msg) => {
      await db.push(`reactionRoles_${message.guild.id}`, {
        id: findRoles.name,
        message: msg.id,
      });
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
      ],
      ephemeral: true,
    });

  const findRoles = rolesList.find(
    (x) => x.name.toLowerCase() == category.toLowerCase()
  );
  if (!findRoles)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You didn't provide Reaction Role Category."
        ),
      ],
      ephemeral: true,
    });

  const listOfRoles = findRoles.roles.map((x) => {
    return `\`${x.emoji}\` **${x.label}**`;
  });

  const embed = new EmbedBuilder()
    .setAuthor({
      name: findRoles.title,
      iconURL: `https://cdn.upload.systems/uploads/rgGD8TcN.png`,
    })
    // .setDescription(`${listOfRoles.join("\n")}`)
    .setColor(findRoles.color);

  interaction.reply({
    embeds: [
      client.utils.errorEmbed(
        client,
        interaction,
        "Reaction Role menu have been sent successfully."
      ),
    ],
    ephemeral: true,
  });

  const chunks = [];
  let componentList = [], buttonList = [];

  for (let i = 0; i < findRoles.roles.length; i += 3) {
    const chunk = findRoles.roles.slice(i, i + 3);
    chunks.push(chunk);
  }

  for (let i = 0; i < chunks.length; i++) {
    buttonList.push(chunks[i].map((x) => {
      return new ButtonBuilder()
        .setLabel(x.label)
        .setEmoji(x.emoji)
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(x.id)
    }))
  }

  buttonList.forEach((b) => {
    componentList.push(new ActionRowBuilder()
      .addComponents(b.map((x) => x))
    )
  });

  await interaction.channel
    .send({
      embeds: [embed],
      components: componentList
    })
    .then(async (msg) => {
      await db.push(`reactionRoles_${interaction.guild.id}`, {
        id: findRoles.name,
        message: msg.id,
      });
    });
};
