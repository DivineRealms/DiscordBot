const Discord = require("discord.js");

module.exports = (client, user, author, description, color) => {
  let embed = new Discord.MessageEmbed();

  if (author.length > 0) embed.setAuthor(author);
  if (description.length > 0) embed.setDescription(description);
  if (color) embed.setColor(color);
  else embed.setColor(client.conf.Settings.embedColor);

  return embed;
};
