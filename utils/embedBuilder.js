const Discord = require("discord.js");

module.exports = (client, user, author, description, type = "default") => {
  let embed = new Discord.MessageEmbed();

  if (author.length > 0) embed.setAuthor(author);
  if (description.length > 0) embed.setDescription(description);
  if (type == "default") embed.setColor(client.conf.settings.embedColor);
  else if (type == "footer")
    embed
      .setFooter(
        "Divine Realms",
        client.user.displayAvatarURL({ size: 1024, dynamic: true })
      )
      .setTimestamp();
  else if (type == "error")
    embed
      .setColor("RED")
      .setAuthor(
        "Error",
        `https://cdn.upload.systems/uploads/nI7qtXd7.png`
      );

  return embed;
};
