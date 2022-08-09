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

module.exports.run = async (client, message, args) => {};

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

  const command = client.commands.get(
    (interaction.options.getString("command") || "").toLowerCase()
  );

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
      require.resolve(`../${command.category}/${command.name}.js`)
    ];

    const commandData = require(`../${command.category}/${command.name}.js`);

    client.commands.set(command.name, {
      ...require(`../${command.category}/${command.name}.js`),
      category: command.category,
    });

    client.slashCommands.set(command.name, {
      ...require(`../${command.category}/${command.name}.js`),
    });

    client.slashArray.filter((x) => x.name != command.name);
    client.slashArray.push(commandData);

    const cmdExists = client.application.commands.cache.find(
      (x) => x.name == command.name
    );
    client.application.commands.edit(cmdExists.name, commandData);

    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
          name: `Command ${command} has been reloaded successfully.`,
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
      ],
    });
  } catch (err) {
    interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "An error occurred"),
      ],
      ephemeral: true,
    });
    console.log(err);
  }
};
