const Discord = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  description: "Allows you to view the bots ping.",
  permissions: [],
  cooldown: 0,
  aliases: ["pings", "bping"],
  usage: "ping",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let embed = client.embedBuilder(client, message, "Pinging...", "", "#60b8ff");
  embed.data.author.name = "Pinging finished!";
  let msg = await message.channel.send({ embeds: [embed] });

  msg.edit({
    embeds: [
      embed.setDescription(
        `<:ArrowRightGray:813815804768026705>Latency: **${msg.createdTimestamp - message.createdTimestamp}ms**
<:ArrowRightGray:813815804768026705>API Latency: **${client.ws.ping}ms**
<:ArrowRightGray:813815804768026705>Uptime: **${client.utils.formatTime(client.uptime)}**`
      ),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  await interaction.deferReply().catch(() => {});
  let embed = client.embedBuilder(client, interaction, "Pinging...", "", "#60b8ff");
  embed.data.author.name = "Pinging finished!";
  let msg = await interaction.followUp({ embeds: [embed], fethcReply: true });

  msg.edit({
    embeds: [
      embed.setDescription(
        `<:ArrowRightGray:813815804768026705>Latency: **${msg.createdTimestamp - interaction.createdTimestamp}ms**
<:ArrowRightGray:813815804768026705>API Latency: **${client.ws.ping}ms**
<:ArrowRightGray:813815804768026705>Uptime: **${client.utils.formatTime(client.uptime)}**`
      ),
    ],
  });
};
