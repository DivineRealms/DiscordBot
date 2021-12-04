const Discord = require("discord.js");

module.exports = (client, user, title, description, type = "default") => {
  let embed = new Discord.MessageEmbed();

  if (title.length > 0) embed.setTitle(title);
  if (description.length > 0) embed.setDescription(description);
  if (type == "default")
    embed.setColor(client.conf.settings.embedColor);
  else if (type == "footer")
    embed
      .setFooter(
        "Divine Realms",
        client.user.displayAvatarURL({ size: 1024, dynamic: true })
      )
      .setTimestamp();
  else if (type == "error")
    embed.setColor("RED");
  else if (type == "author")
    embed.setAuthor(user.username, user.displayAvatarURL({ size: 1024, dynamic: true }));

  return embed;
};