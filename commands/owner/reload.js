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

  const command = client.commands.get((args[0] || "").toLowerCase());
  if (!command)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You need to provide a command to reload.`
        ),
      ],
    });
  try {
    delete require.cache[
      require.resolve(`../${command.category}/${args[0].toLowerCase()}.js`)
    ];

    const commandData = require(`../${command.category}/${args[0].toLowerCase()}.js`);

    client.commands.set(args[0].toLowerCase(), {
      ...require(`../${command.category}/${args[0].toLowerCase()}.js`),
      category: command.category,
    });

    client.slashCommands.set(args[0].toLowerCase(), {
      ...require(`../${command.category}/${args[0].toLowerCase()}.js`),
    });

    client.slashArray.filter((x) => x.name != args[0].toLowerCase());
    client.slashArray.push(commandData);

    const cmdExists = client.application.commands.cache.find(x => x.name == args[0].toLowerCase())
    client.application.commands.edit(cmdExists, commandData)

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#3db39e")
          .setAuthor({
            name: "Command has been reloaded successfully.",
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
          }),
      ],
    });
  } catch (err) {
    message.channel.send({ content: "An error occurred" });
    console.log(err);
  }
};
