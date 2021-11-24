module.exports = {
  name: 'stealemoji',
  category: 'moderation',
  description: 'Steal emojis from another server and add them to this one.',
  permissions: ["MANAGE_EMOJIS"],
  cooldown: 0,
  aliases: ['stealem'],
  usage: 'stealemoji <custom emojis>'
}

module.exports.run = async(client, message, args) => {
  if (!args.join(' ').match(/<a?:(\w{1,32}):(\d{17,19})>/g)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "Please write some custom emojis for me to steal!", "RED")]})

  const emojis = [...args.join(' ').matchAll(/<a?:(\w{1,32}):(\d{17,19})>/g)].map(s => [s[1], s[2]])
  if (emojis.length > 5) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You can't create more than 5 emojis at once!", "RED")]})
  const created = []

  for (var e of emojis)
    created.push(await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${e[1]}.png?v=1`, e[0]).catch(() => {}))

  message.channel.send({ embeds: [client.embedBuilder(client, message, "Emojis Stolen!", `Created the following emojis: ${created.map(s => s.toString()).join(' ')}`)]})
}
