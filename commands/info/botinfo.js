module.exports = {
  name: 'botinfo',
  category: 'info',
  description: 'Allows you to view information on the bot.',
  permissions: [],
  cooldown: 0,
  aliases: ['binfo', 'infobot', 'bottinfo'],
  usage: 'botinfo'
}

module.exports.run = async(client, message, args) => {
  const info = new client.embedBuilder(client, message, `Information on ${client.user.username}`)
    .setThumbnail(client.user.displayAvatarURL())
    .addField('ID:', `${client.user.id}`)
    .addField('Name:', `${client.user.username}`)
    .addField('Developers', `${client.conf.settings.BotOwnerDiscordID.map((x) => client.users.cache.get(x)).join(", ").trim()}`)
    .addField('Prefix:', `${message.px}`)
    .addField('Channels:', `${client.channels.cache.size}`)
  message.channel.send({ embeds: [info] })
}