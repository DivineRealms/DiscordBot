module.exports = (client, channel) => {
  const log = client.channels.cache.get(client.conf.logging.Channel_Updates);
  if (!log || !channel.guild) return

  const embed = new client.embedBuilder(client, message, "Channel was created",
    `**Channel name:** ${channel.name}\n**Channel ID:** \`${channel.id}\``)

  log.send({ embeds: [embed] })
}