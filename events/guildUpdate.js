module.exports = (client, oldGuild, newGuild) => {
  const log = client.channels.cache.get(client.conf.logging.Role_Updates);
  if (!log) return

  const embed = new client.embedBuilder(client, message, "The server has been Updated!", "")

  if (oldGuild.name !== newGuild.name) log.send({ embeds: [embed.setDescription(`**Old Name**: ${oldGuild.name}\n**New Name**: ${newGuild.name}`)]});
  else if (newGuild.iconURL() && oldGuild.iconURL() !== newGuild.iconURL()) log.send({ embeds: [embed.setDescription(`**New Icon:** [View here](${newGuild.iconURL()})\n**Old Icon:** ${oldGuild.iconURL() ? `[View here](${oldGuild.iconURL()})` : 'None'}`).setImage(newGuild.iconURL())]});
  else if (oldGuild.iconURL() !== newGuild.iconURL()) log.send({ embeds: [embed.setDescription(`**Server icon removed**\n**Old Icon:** [View here](${oldGuild.iconURL()})`)]});
}