const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "remove",
  category: "tickets",
  usage: "remove",
  description: "Remove a user from a ticket.",
  permissions: ["ManageChannels"],
  cooldown: 0,
  aliases: [],
  slash: true,
  options: [
    {
      name: "user",
      description: "User to remove from",
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
        client.utils.errorEmbed(
          client,
          message,
          "Ticket System is not enabled."
        ),
      ],
    });

  if (!ticket)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "This command can only be used inside of tickets."
        ),
      ],
    });

  if (!message.mentions.users.first())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please mention a member to remove from this ticket."
        ),
      ],
    });

  if (
    !message.channel.permissionOverwrites.cache.has(
      message.mentions.users.first().id
    )
  )
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "That user isn't in this ticket."
        ),
      ],
    });

  message.channel.permissionOverwrites
    .get(message.mentions.users.first().id)
    .delete();

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: `${
          message.mentions.users.first().username
        } has been removed from the ticket!`,
        iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
      }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user");
  const ticket = await db.get(
    `tickets_${interaction.guild.id}_${interaction.channel.id}`
  );

  if (!client.conf.Ticket_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Ticket System is not enabled."
        ),
      ],
      ephemeral: true,
    });

  if (!ticket)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "This command can only be used inside of tickets."
        ),
      ],
      ephemeral: true,
    });

  if (!interaction.channel.permissionOverwrites.cache.has(user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "That user isn't in this ticket."
        ),
      ],
      ephemeral: true,
    });

  interaction.channel.permissionOverwrites.get(user.id).delete();

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: `${user.username} has been removed from the ticket!`,
        iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
      }),
    ],
  });
};
