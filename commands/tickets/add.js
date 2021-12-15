const db = require("quick.db");

module.exports = {
  name: "add",
  category: "tickets",
  usage: "add",
  description: "Add users to the current ticket.",
  permissions: ["MANAGE_CHANNELS"],
  cooldown: 0,
  aliases: [],
};

module.exports.run = async (client, message, args) => {
  const ticket = db.fetch(`tickets_${message.guild.id}_${message.channel.id}`);

  if (!ticket)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "This command can only be used in Ticket Channel."
        ),
      ],
    });

  if (!message.mentions.users.first())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to mention a user."
        ),
      ],
    });

  if (
    message.channel.permissionOverwrites.has(message.mentions.users.first().id)
  )
    if (
      message.channel.permissionOverwrites
        .get(message.mentions.users.first().id)
        .allow.has("VIEW_CHANNEL")
    )
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "They're already in the ticket."
          ),
        ],
      });

  message.channel.permissionOverwrites.edit(message.mentions.users.first(), {
    VIEW_CHANNEL: true,
  });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `${
            message.mentions.users.first().username
          } has been added to the ticket.`,
          `https://cdn.upload.systems/uploads/4mFVRE7f.png`
        ),
    ],
  });
};
