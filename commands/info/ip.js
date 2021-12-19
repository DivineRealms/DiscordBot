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
        .embedBuilder(client, message, "", "", "#60b8ff")
        .addField(
          "Minecraft Server IPs:",
          "`:one:` **`divinerealms.ga`**\n`:two:` **`divinemc.ga`**",
          true
        )
        .addField("Version:", "**`1.17.1`**", true)
        .setAuthor(
          "Divine Realms",
          `https://cdn.upload.systems/uploads/i5Mm2j9b.png`
        ),
    ],
  });
