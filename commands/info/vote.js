module.exports = {
  name: "vote",
  category: "info",
  description: "Links for voting.",
  permissions: [],
  cooldown: 0,
  aliases: ["servervote"],
  usage: "vote",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  const drButton = new ButtonBuilder()
    .setEmoji("<:DR:765260828714467418>")
    .setURL("https://minecraft-mp.com/server/295045/vote/")
    .setLabel("Vote for Divine Realms")
    .setStyle(ButtonStyle.Link);
  const hogButton = new ButtonBuilder()
    .setEmoji("<:hog:916427016071442442>")
    .setURL("https://minecraft-mp.com/server/296478/vote/")
    .setLabel("Vote for HogRealms")
    .setStyle(ButtonStyle.Link);

  let row = new ActionRowBuilder().addComponents([drButton, hogButton]);

  message.reply({ components: [row] });
}

module.exports.slashRun = async (client, interaction) => {
  const drButton = new ButtonBuilder()
    .setEmoji("<:DR:765260828714467418>")
    .setURL("https://minecraft-mp.com/server/295045/vote/")
    .setLabel("Vote for Divine Realms")
    .setStyle(ButtonStyle.Link);
  const hogButton = new ButtonBuilder()
    .setEmoji("<:hog:916427016071442442>")
    .setURL("https://minecraft-mp.com/server/296478/vote/")
    .setLabel("Vote for HogRealms")
    .setStyle(ButtonStyle.Link);

  let row = new ActionRowBuilder().addComponents([drButton, hogButton]);

  interaction.reply({ components: [row] });
};
