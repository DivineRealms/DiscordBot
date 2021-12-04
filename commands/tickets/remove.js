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
        client.embedBuilder(
          client,
          message,
          "Error",
          "This command can only be used inside of tickets.",
          error
        ),
      ],
    });
  if (!message.mentions.users.first())
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "Please mention a member to remove from this ticket.",
          error
        ),
      ],
    });
  if (
    !message.channel.permissionOverwrites.has(message.mentions.users.first().id)
  )
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "That user isn't in this ticket.",
          error
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
        "Tickets",
        `${message.mentions.users.first()} has been removed from the ticket!`
      ),
    ],
  });
};
