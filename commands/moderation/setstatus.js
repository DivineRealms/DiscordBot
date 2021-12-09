module.exports = {
  name: "setstatus",
  category: "moderation",
  description: "Allows you to set the bots status.",
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [],
  usage: "setstatus <TEXT>",
};
module.exports.run = async (client, message, args) => {
  const status = args.join(" ");

  if (!status)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You need to provide Custom Status.`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "#f44336")
        .setAuthor(
          `Status has been changed to ${status}.`,
          `https://cdn.upload.systems/uploads/6Xdg16Gh.png`
        ),
    ],
  });

  client.user.setActivity(status);
};
