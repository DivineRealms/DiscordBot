const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "create",
  category: "tickets",
  description: "Creates a ticket.",
  permissions: ["ManageChannels"],
  cooldown: 0,
  aliases: [`new`, `ticket`],
  usage: "create",
  slash: true
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.Ticket_System;
  const tickets =
    (await db.all()).filter((i) => i.id.startsWith(`tickets_${message.guild.id}_`)) ||
    [];

  const log = client.channels.cache.get(client.conf.Logging.Tickets);

  const num = tickets.length || 1;
  const ticketNumber = "0".repeat(4 - num.toString().length) + num;

  if (!settings.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Ticket System is not enabled."
        ),
      ],
    });

  if (tickets.find((u) => u.value.includes(message.author.id)))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You already have a ticket opened."
        ),
      ],
    });

  const permissions = settings.Support_Roles.map((r) => ({
      id: r,
      allow: "ViewChannel",
    })),
    users = message.mentions.users.map((s) => ({
      id: s.id,
      allow: "ViewChannel",
    })),
    channel = await message.guild.channels.create({
        name: `📋︲${message.author.username}-${ticketNumber}`,
        parent: settings.Category,
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: "ViewChannel",
          },
          { id: message.author.id, allow: "ViewChannel" },
          ...permissions,
          ...users,
        ],
      }
    ),
    jumpRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(
          `https://discord.com/channels/${message.guild.id}/${channel.id}`
        )
        .setLabel("Go to the Ticket")
        .setStyle(ButtonStyle.Link)
    );

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>Ticket has been successfully created in channel <#${channel.id}>.`,
          "#b3e59f"
        )
        .setAuthor({
          name: "Ticket Created",
          iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
        }),
    ],
    components: [jumpRow],
  });

  channel.send({
    content: message.author.toString(),
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>A staff member will be with you shortly.`,
          "#b3e59f"
        )
        .setAuthor({
          name: `Thank you for creating a ticket`,
          iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
        }),
    ],
  });

  if (log)
    log.send({
      embeds: [
        client
          .embedBuilder(
            client,
            message,
            "",
            `Created by: ${message.author}`,
            "#b3e59f"
          )
          .setAuthor({
            name: "Ticket Created",
            iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
          }),
      ],
    });

  await db.set(`tickets_${message.guild.id}_${channel.id}`, message.author.id);
};

module.exports.slashRun = async (client, interaction) => {
  const settings = client.conf.Ticket_System;
  const tickets =
    (await db.all()).filter((i) => i.id.startsWith(`tickets_${interaction.guild.id}_`)) ||
    [];

  const log = client.channels.cache.get(client.conf.Logging.Tickets);

  const num = tickets.length || 1;
  const ticketNumber = "0".repeat(4 - num.toString().length) + num;

  if (!settings.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Ticket System is not enabled."
        ),
      ],
    });

  if (tickets.find((u) => u.value.includes(interaction.user.id)))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "You already have a ticket opened."
        ),
      ],
    });

  const permissions = settings.Support_Roles.map((r) => ({
      id: r,
      allow: "ViewChannel",
    })),
    users = interaction.mentions.users.map((s) => ({
      id: s.id,
      allow: "ViewChannel",
    })),
    channel = await interaction.guild.channels.create({
        name: `📋︲${interaction.user.username}-${ticketNumber}`,
        parent: settings.Category,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: "ViewChannel",
          },
          { id: interaction.user.id, allow: "ViewChannel" },
          ...permissions,
          ...users,
        ],
      }
    ),
    jumpRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(
          `https://discord.com/channels/${interaction.guild.id}/${channel.id}`
        )
        .setLabel("Go to the Ticket")
        .setStyle(ButtonStyle.Link)
    );

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705>Ticket has been successfully created in channel <#${channel.id}>.`,
          "#b3e59f"
        )
        .setAuthor({
          name: "Ticket Created",
          iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
        }),
    ],
    components: [jumpRow],
  });

  channel.send({
    content: interaction.user.toString(),
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705>A staff member will be with you shortly.`,
          "#b3e59f"
        )
        .setAuthor({
          name: `Thank you for creating a ticket`,
          iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
        }),
    ],
  });

  if (log)
    log.send({
      embeds: [
        client
          .embedBuilder(
            client,
            interaction,
            "",
            `Created by: ${interaction.user}`,
            "#b3e59f"
          )
          .setAuthor({
            name: "Ticket Created",
            iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
          }),
      ],
    });

  await db.set(`tickets_${interaction.guild.id}_${channel.id}`, interaction.user.id);
};