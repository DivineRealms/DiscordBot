module.exports = {
  name: "snipe",
  category: "info",
  description: "Lets you see the last deleted message.",
  permissions: [],
  cooldown: 0,
  aliases: ["snip3"],
  usage: "snipe",
};

module.exports.run = async (client, message, args) => {
  let snipe = client.snipes.get(message.channel.id),
    user = await client.users.fetch(snipe.user);

  if (!snipe || !snipe.content)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "There's nothing to snipe."),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        `Last deleted message was from: ${user.tag}`,
        `\`\`\`xl${snipe.content}\`\`\``
      ),
    ],
  });
};
