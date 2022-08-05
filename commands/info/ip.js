module.exports = {
  name: "ip",
  category: "info",
  description: "Allows you to view information of the Minecraft server.",
  permissions: [],
  cooldown: 0,
  aliases: ["mcip", "serverip"],
  usage: "ip",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  message.reply({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#81b051")
        .setThumbnail(`https://cdn.upload.systems/uploads/YrOfFxGC.png`)
        .addFields([
          {
            name: "Minecraft Server IP:",
            value: "**`divinerealms.org`**\n**`divinerealms.ga`**",
            inline: false,
          },
          { name: "Version: **`1.8 - 1.18.2`**", value: "_ _", inline: false },
        ]),
    ],
  });
};

module.exports.slashRun = async (client, interaction) =>
  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#81b051")
        .setThumbnail(`https://cdn.upload.systems/uploads/YrOfFxGC.png`)
        .addFields([
          {
            name: "Minecraft Server IP:",
            value: "**`divinerealms.org`**\n**`divinerealms.ga`**",
            inline: false,
          },
          { name: "Version: **`1.8 - 1.18.2`**", value: "_ _", inline: false },
        ]),
    ],
  });
