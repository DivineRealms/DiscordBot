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

module.exports.slashRun = async (client, interaction) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(interaction.user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Only developers can use this command."
        ),
      ],
      ephemeral: true,
    });

  const restarting = await interaction.channel.send({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
          name: "Bot is restarting...",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
      ]
    }),
    restarted = client
      .embedBuilder(client, interaction, "", "", "#3db39e")
      .setAuthor({
        name: "Bot has been restarted by ${interaction.user.username}!",
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      });

  await restarting.edit({ embeds: [restarted] }).then(() => process.exit());
};
