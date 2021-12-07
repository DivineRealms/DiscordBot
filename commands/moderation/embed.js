module.exports = {
  name: "embed",
  category: "moderation",
  description: "Allows you to put text into an embed.",
  permissions: ["MANAGE_GUILD"],
  cooldown: 0,
  aliases: [],
  usage: "embed <Title> | <Description>",
};

module.exports.run = async (client, message, args) => {
  let [title, description] = args.join(" ").split(/\s*\|\s*/);

  if (!title)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide a title."
        ),
      ],
    });

  if (!description)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to provide a description."
        ),
      ],
    });

  message.channel.send({
    embeds: [client.embedBuilder(client, message, title, description)],
  });
};
