module.exports = {
  name: "purge",
  category: "moderation",
  description: "Clears the requested ammount of messages.",
  permissions: ["MANAGE_MESSAGES"],
  cooldown: 0,
  aliases: ["clear"],
  usage: "purge <count>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0] || isNaN(args[0]))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide amount of messages to remove."
        ),
      ],
    });

  if (args[0] > 100)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You cannot purge more than 100 messages at once."
        ),
      ],
    });

  if (args[0] < 1)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to delete at least 1 message."
        ),
      ],
    });

  message.channel
    .bulkDelete(args[0], true)
    .then((_messages) => {
      message.channel.send({
        embeds: [
          client.embedBuilder(
            client,
            message,
            `${message.author.username} has purged ${args[0]} messages.`,
            ""
          ),
        ],
      });
    })
    .catch(() =>
      client.utils.errorEmbed(
        client,
        message,
        "Cannot remove messages older than 14 days."
      )
    );
};
