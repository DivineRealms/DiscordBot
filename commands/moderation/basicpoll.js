module.exports = {
  name: 'basicpoll',
  category: 'moderation',
  description: 'Lets you create a Yes or no poll.',
  permissions: ["MANAGE_CHANNELS"],
  cooldown: 0,
  aliases: ['bpoll', 'simplepoll.'],
  usage: 'basicpoll <question>'
}

module.exports.run = async(client, message, args) => {
  const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
  const description = args.slice(1).join(" ")

  if (!channel) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You have entered invalid channel.", "", "error")] });
  if (!args[1]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "You didn't specified question.", "", "error")] });

  const embed = client.embedBuilder(client, message, `Poll Created By ${message.author.tag}`, description)

  const msg = await client.channels.cache.get(channel.id).send({ embeds: [embed] })
  msg.react('✅').then(msg.react('❌'))
  message.delete();
}