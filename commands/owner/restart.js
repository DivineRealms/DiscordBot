module.exports = {
  name: "restart",
  category: "owner",
  description: "Lets you restart the bot via discord.",
  permissions: [],
  cooldown: 0,
  aliases: ["bootup"],
  usage: "restart",
  slash: true,
};

module.exports.run = async (client, message, args) => {};

module.exports.slashRun = async (client, interaction) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(interaction.user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Only developers can use this command."),
      ],
      ephemeral: true,
    });

  await interaction
    .reply({
      embeds: [
        client.embedBuilder(client, interaction, `Bot has been restarted by ${interaction.user.username}`, "", "#3db39e"),
      ],
    })
    .then(() => process.exit());
};
