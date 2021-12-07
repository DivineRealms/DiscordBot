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
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor(
            "Bot has been turned off.",
            `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          ),
      ],
    })
    .then(() => {
      client.destroy();
    });
};
