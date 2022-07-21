module.exports = {
  name: "ip",
  category: "info",
  description: "Allows you to view information of the Minecraft server.",
  permissions: [],
  cooldown: 0,
  aliases: ["mcip", "serverip"],
  usage: "ip",
};

module.exports.run = async (client, message, args) =>
  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#81b051")
        .setThumbnail(`https://cdn.upload.systems/uploads/YrOfFxGC.png`)
        .addFields([{
          name: "Minecraft Server IPs:",
          value: "`1️⃣` **`divinerealms.ga`**\n`2️⃣` **`divinemc.ga`**",
          inline: false
        }, { name: "Version: **`1.17.1`**", value: "_ _", inline: false }])
    ],
  });
