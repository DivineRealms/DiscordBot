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
  const settings = client.conf.ticketSystem,
    tickets =
      db.all().filter((i) => i.ID.startsWith(`tickets_${message.guild.id}_`)) ||
      [],
    log = client.channels.cache.get(client.conf.logging.Ticket_Channel_Logs),
    num = tickets.length || 1,
    ticketNumber = "0".repeat(4 - num.toString().length) + num;

  if (tickets.find((u) => u.data.includes(message.author.id)))
    return client.utils.errorEmbed(
      client,
      message,
      "You already have a ticket opened."
    );

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
      client.embedBuilder(
        client,
        message,
        "Ticket Created",
        `Ticket has been successfully created in channel ${channel}.`,
        "GREEN"
      ),
    ],
    components: [jumpRow],
  });

  channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        settings.Ticket_Title,
        client.resolveMember(settings.Ticket_Message, message.author),
        "GREEN"
      ),
    ],
  });

  if (log)
    log.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Ticket Created",
          `**Creator:** ${message.author}`,
          "GREEN"
        ),
      ],
    });

  db.set(`tickets_${message.guild.id}_${channel.id}`, message.author.id);
};
