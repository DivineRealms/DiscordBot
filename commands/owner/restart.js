module.exports = {
  name: "restart",
  category: "owner",
  description: "Lets you restart the bot via discord.",
  permissions: [],
  cooldown: 0,
  aliases: ["bootup"],
  usage: "restart",
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

  const restarting = await message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor(
            "Bot is restarting...",
            `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          ),
      ],
    }),
    restarted = client
      .embedBuilder(client, message, "", "", "#3db39e")
      .setAuthor(
        `Bot has been restarted by ${message.author.username}.`,
        `https://cdn.upload.systems/uploads/6KOGFYJM.png`
      );

  await restarting.edit({ embeds: [restarted] }).then(() => {
    process.exit();
  });
};
