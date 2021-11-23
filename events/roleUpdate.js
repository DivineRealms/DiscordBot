module.exports = (client, oldRole, newRole) => {
  const log = client.channels.cache.get(client.conf.logging.Role_Updates);
  if (!log) return

  const embed = client.embedBuilder(client, "", `Role ${newRole.name} was updated!`, "")

  if (oldRole.name !== newRole.name) log.send({ embeds: [embed.setDescription(`**Old Name:** ${oldRole.name}\n**New Name:** ${newRole.name}`) ]})
  else if (oldRole.hexColor !== newRole.hexColor) log.send({ embeds: [embed.setDescription(`**Old Color:** ${oldRole.hexColor} (\`${oldRole.color}\`)\n**New Color:** ${newRole.hexColor} (\`${newRole.color}\`)`) ]})
}