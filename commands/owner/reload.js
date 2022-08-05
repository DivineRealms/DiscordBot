const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "reload",
  category: "owner",
  description: "Lets you reload a command.",
  permissions: [],
  cooldown: 0,
  aliases: ["refresh"],
  usage: "reload <Command>",
  slash: true,
  options: [
    {
      name: "command",
      description: "Name of the command you want to reload.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.slashRun = async (client, interaction, args) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(interaction.user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Only Developers can use this command."
        ),
      ],
      ephemeral: true,
    });

  const command = client.commands.get((args[0] || "").toLowerCase());
  if (!command)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `You need to provide a command to reload.`
        ),
      ],
      ephemeral: true,
    });
  try {
    delete require.cache[
      require.resolve(`../${command.category}/${args[0].toLowerCase()}.js`)
    ];

    const commandData = require(`../${
      command.category
    }/${args[0].toLowerCase()}.js`);

    client.commands.set(args[0].toLowerCase(), {
      ...require(`../${command.category}/${args[0].toLowerCase()}.js`),
      category: command.category,
    });

    client.slashCommands.set(args[0].toLowerCase(), {
      ...require(`../${command.category}/${args[0].toLowerCase()}.js`),
    });

    client.slashArray.filter((x) => x.name != args[0].toLowerCase());
    client.slashArray.push(commandData);

    const cmdExists = client.application.commands.cache.find(
      (x) => x.name == args[0].toLowerCase()
    );
    client.application.commands.edit(cmdExists, commandData);

    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
          name: "Command has been reloaded successfully.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
      ],
      ephemeral: true,
    });
  } catch (err) {
    interaction.reply({
      embeds: [client.errorEmbed(client, interaction, "An error occurred")],
      ephemeral: true,
    });
    console.log(err);
  }
};
