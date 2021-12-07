const Discord = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  description: "Allows you to view the bots ping.",
  permissions: [],
  cooldown: 0,
  aliases: ["pings", "bping"],
  usage: "ping",
};

module.exports.run = async (client, message, args) => {
  const embed = await message.channel.send({
    embeds: [client.embedBuilder(client, message, "Pinging...", "")],
  });

  embed.edit({
    embeds: [
      embed
        .setDescription(
          `<:ArrowRightGray:813815804768026705>Latency: **${
            m.createdTimestamp - message.createdTimestamp
          }ms**
<:ArrowRightGray:813815804768026705>API Latency: **${client.ws.ping}ms**
<:ArrowRightGray:813815804768026705>Uptime: **${client.utils.formatTime(
            client.uptime
          )}**`
        )
        .setAuthor("Pinging finished!"),
    ],
  });
};
