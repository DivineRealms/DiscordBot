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

module.exports.run = async (client, message, args) =>
  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "Vote Links",
          `<:DR:765260828714467418> (https://minecraft-mp.com/server/295045/vote/)[**Divine Realms**]
<:hog:916427016071442442> (https://minecraft-mp.com/server/296478/vote/)[**HogRealms**]`
        )
        .setThumbnail(`https://cdn.upload.systems/uploads/YrOfFxGC.png`),
    ],
  });

module.exports.slashRun = async (client, interaction) =>
  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "Vote Links",
          `<:DR:765260828714467418> (https://minecraft-mp.com/server/295045/vote/)[**Divine Realms**]
<:hog:916427016071442442> (https://minecraft-mp.com/server/296478/vote/)[**HogRealms**]`
        )
        .setThumbnail(`https://cdn.upload.systems/uploads/YrOfFxGC.png`),
    ],
  });
