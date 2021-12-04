module.exports = {
  name: "turnoff",
  category: "owner",
  description: "Lets you turnoff the bot via discord.",
  permissions: [],
  cooldown: 0,
  aliases: ["selfdestruct", "shutdown"],
  usage: "turnoff",
};

module.exports.run = async (client, message, args) => {
  if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id))
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          `You're not Owner`,
          error
        ),
      ],
    });

  let embed = client.embedBuilder(
    client,
    message,
    "Shutdown",
    "Bot has been turned off"
  );

  message.channel.send({ embeds: [embed] }).then(() => {
    client.destroy();
  });
};
