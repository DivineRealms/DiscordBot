const Discord = require("discord.js");

module.exports = (client, user, fieldsTitle, fieldsValue, color) => {
  let embed = new Discord.EmbedBuilder();

  if (fieldsTitle.length > 0) embed.addFields({ name: fieldsTitle });
  if (fieldsValue.length > 0) embed.addFields({ name: fieldsTitle, value: fieldsValue });
  if (color) embed.setColor(color);
  else embed.setColor(client.conf.Settings.Embed_Color);

  return embed;
};
