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
        client.utils.errorEmbed(
          client,
          message,
          "Only Developers can use this command."
        ),
      ],
    });

  message.channel
    .send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Bot has been turned off.",
          "",
          "#3db39e"
        ),
      ],
    })
    .then(() => {
      client.destroy();
    });
};
