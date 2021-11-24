module.exports = {
  name: 'lockserver',
  category: 'moderation',
  description: 'Lock the server, kicking anyone who joins.',
  permissions: ["ADMINISTRATOR"],
  cooldown: 0,
  aliases: [`serverlock`],
  usage: 'lockserver'
}

module.exports.run = (client, message, args) => {
  const locked = client.settings.get(message.guild.id, 'locked')
  if (!client.conf.moderation.serverLock) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "This command is disabled, enable it in the configuration.", "RED")]})

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Server Locked", "Server has been locked successfully.")] });
  
  client.settings.set(message.guild.id, !locked, 'locked')
}
