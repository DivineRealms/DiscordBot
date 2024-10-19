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
        .embedBuilder(client, message, "Minecraft Server IP:", "**`divinerealms.org`**\n**`mc.divinerealms.org`**\n**`old.divinerealms.org`**", "#81b051")
        .addFields({ name: "Version: **`1.8.X`**", value: "_ _", inline: false }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) =>
  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "Minecraft Server IP:", "**`divinerealms.org`**\n**`mc.divinerealms.org`**\n**`old.divinerealms.org`**", "#81b051")
        .addFields({ name: "Version: **`1.8 - 1.18.2`**", value: "_ _", inline: false }),
    ],
  });
