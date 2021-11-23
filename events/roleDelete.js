module.exports = (client, role) => {
  const log = client.channels.cache.get(client.conf.logging.Role_Updates);
  if (!log) return

  const embed = client.embedBuilder(client, "", "A role was deleted!", `**Role name:** ${role.name}\n**Role ID:** \`${role.id}\``)

  log.send({ embeds: [embed] })
}