module.exports = {
  name: "dm",
  category: "moderation",
  description: "I will dm someone for you.",
  permissions: ["MANAGE_GUILD"],
  cooldown: 0,
  aliases: [`direct-message`],
  usage: "dm <Text>",
};

module.exports.run = async (client, message, args) => {
  const user =
    message.mentions.users.first() || message.guild.members.cache.get(args[0]);

  if (!user)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have provided an invalid user."
        ),
      ],
    });

  const text = args.slice(1).join(" ");

  if (!text)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide text to send."
        ),
      ],
    });

  user.send({ content: text }).catch(() => {
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "This User has their DMs Closed."
        ),
      ],
    });
  });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          `Successfully sent a DM to ${user.username}.`,
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });
};
