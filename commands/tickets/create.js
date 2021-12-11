const db = require("quick.db");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "create",
  category: "tickets",
  description: "Creates a ticket.",
  permissions: ["MANAGE_CHANNELS"],
  cooldown: 0,
  aliases: [`new`, `ticket`],
  usage: "create <@users>",
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.ticketSystem;
  const tickets =
    db.all().filter((i) => i.ID.startsWith(`tickets_${message.guild.id}_`)) ||
    [];

  const log = client.channels.cache.get(
    client.conf.logging.Ticket_Channel_Logs
  );

  const num = tickets.length || 1;
  const ticketNumber = "0".repeat(4 - num.toString().length) + num;

  if (tickets.find((u) => u.data.includes(message.author.id)))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You already have a ticket opened."
        ),
      ],
    });

  const permissions = settings.Support_Team_Roles.map((r) => ({
      id: r,
      allow: "VIEW_CHANNEL",
    })),
    users = message.mentions.users.map((s) => ({
      id: s.id,
      allow: "VIEW_CHANNEL",
    })),
    channel = await message.guild.channels.create(
      settings.Ticket_Name.replace("{number}", ticketNumber).replace(
        "{username}",
        message.author.username
      ),
      {
        parent: settings.Ticket_Category,
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: "VIEW_CHANNEL",
          },
          { id: message.author.id, allow: "VIEW_CHANNEL" },
          ...permissions,
          ...users,
        ],
      }
    ),
    jumpRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(
          `https://discord.com/channels/${message.guild.id}/${channel.id}`
        )
        .setLabel("Go to the Ticket")
        .setStyle("LINK")
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
        .setAuthor(
          "Ticket Created",
          `https://cdn.upload.systems/uploads/4mFVRE7f.png`
        ),
    ],
    components: [jumpRow],
  });

  channel.send({
    content: message.author.toString(),
    embeds: [
      client
        .embedBuilder(client, message, "", settings.Ticket_Message, "#b3e59f")
        .setAuthor(
          settings.Ticket_Title,
          `https://cdn.upload.systems/uploads/4mFVRE7f.png`
        ),
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
          .setAuthor(
            "Ticket Created",
            `https://cdn.upload.systems/uploads/4mFVRE7f.png`
          ),
      ],
    });

  db.set(`tickets_${message.guild.id}_${channel.id}`, message.author.id);
};
