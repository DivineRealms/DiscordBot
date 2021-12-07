const db = require("quick.db");

module.exports = {
  name: "remove",
  category: "tickets",
  usage: "remove",
  description: "Remove a user from a ticket.",
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
    !message.channel.permissionOverwrites.has(message.mentions.users.first().id)
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
      client.embedBuilder(
        client,
        message,
        `${
          message.mentions.users.first().username
        } has been removed from the ticket!`,
        "",
        "GREEN"
      ),
    ],
  });
};
