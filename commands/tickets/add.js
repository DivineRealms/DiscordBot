const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "add",
  category: "tickets",
  usage: "add <@User>",
  description: "Add users to the current ticket.",
  permissions: ["ManageChannels"],
  cooldown: 0,
  aliases: [],
  slash: true,
  options: [
    {
      name: "user",
      description: "User to add to ticket",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const ticket = await db.get(
    `tickets_${message.guild.id}_${message.channel.id}`
  );

  if (!client.conf.Ticket_System.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Ticket System is not enabled."),
      ],
    });

  if (!ticket)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "This command can only be used in Ticket Channel."),
      ],
    });

  if (!message.mentions.users.first())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to mention a user."),
      ],
    });

  if (
    message.channel.permissionOverwrites.cache.has(
      message.mentions.users.first().id
    )
  )
    if (
      message.channel.permissionOverwrites
        .get(message.mentions.users.first().id)
        .allow.has("ViewChannel")
    )
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "They're already in the ticket."),
        ],
      });

  message.channel.permissionOverwrites.edit(message.mentions.users.first(), {
    ViewChannel: true,
  });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `${
          message.mentions.users.first().username
        } has been added to the ticket.`, "", "#3db39e"),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const ticket = await db.get(
    `tickets_${interaction.guild.id}_${interaction.channel.id}`
  );
  const user = interaction.options.getUser("user");

  if (!client.conf.Ticket_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Ticket System is not enabled."),
      ],
      ephemeral: true,
    });

  if (!ticket)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "This command can only be used in Ticket Channel."),
      ],
      ephemeral: true,
    });

  if (interaction.channel.permissionOverwrites.cache.has(user.id))
    if (
      interaction.channel.permissionOverwrites
        .get(user.id)
        .allow.has("ViewChannel")
    )
      return interaction.reply({
        embeds: [
          client.utils.errorEmbed(client, interaction, "They're already in the ticket."),
        ],
        ephemeral: true,
      });

  interaction.channel.permissionOverwrites.edit(user, {
    ViewChannel: true,
  });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, `${user.username} has been added to the ticket.`, "", "#3db39e"),
    ],
  });
};
