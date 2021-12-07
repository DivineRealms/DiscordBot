module.exports = {
  name: "reload",
  category: "owner",
  description: "Lets you reload a command.",
  permissions: [],
  cooldown: 0,
  aliases: ["refresh"],
  usage: "reload <Command>",
};

module.exports.run = async (client, message, args) => {
  if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id))
    return client.utils.errorEmbed(
      client,
      message,
      "Only Developers can use this command."
    );

  const command = client.commands.get((args[0] || "").toLowerCase());
  if (!command)
    return client.utils.errorEmbed(
      client,
      message,
      `You need to provide a command to reload.`
    );
  try {
    delete require.cache[
      require.resolve(`../${command.category}/${args[0].toLowerCase()}.js`)
    ];

    client.commands.set(args[0].toLowerCase(), {
      ...require(`../${command.category}/${args[0].toLowerCase()}.js`),
      category: command.category,
    });

    message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Command has been reloaded successfully.",
          "",
          "GREEN"
        ),
      ],
    });
  } catch (err) {
    message.channel.send({ content: "An error occurred" });
    console.log(err);
  }
};
