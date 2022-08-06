module.exports = {
  name: "turnoff",
  category: "owner",
  description: "Lets you turnoff the bot via discord.",
  permissions: [],
  cooldown: 0,
  aliases: ["selfdestruct", "shutdown"],
  usage: "turnoff",
  slash: true,
};

module.exports.run = async (client, message, args) => {};

module.exports.slashRun = async (client, interaction) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(interaction.user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Only Developers can use this command."
        ),
      ],
      ephemeral: true,
    });

  interaction
    .reply({
      embeds: [
        client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
          name: "Bot has been turned off.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        }),
      ],
    })
    .then(() => client.destroy());
};
