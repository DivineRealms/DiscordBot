module.exports = {
  name: "deletesettings",
  category: "owner",
  description: "Deletes all the settings for the bot (PERMANENT)",
  permissions: [],
  cooldown: 0,
  aliases: ["deleteset"],
  usage: "deletesettings",
};

module.exports.run = (client, message, args) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(message.author.id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Only Developers can use this command."
        ),
      ],
    });

  client.settings.deleteAll();
};
