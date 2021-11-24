module.exports = {
  name: 'pickforme',
  category: 'fun',
  description: 'Cant decide? Ill pick for you.',
  permissions: [],
  cooldown: 0,
  aliases: ['choose', 'pick'],
  usage: 'pickforme <option,option ETC>'
}

module.exports.run = async(client, message, args) => {
  const choices = args.join(' ').split(/\s*\|\s*/).filter(s => s.length)
  const choice = choices[~~(Math.random() * choices.length)]

  if (!choice) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to give me choices separated with a \`|\`\nExample \`${message.px}pickforme apple | banana | peach\`!", "RED")]})

  message.channel.send(`You gave me the options of \`${choices.join(' ')}\`\nI chose: ${choice}`)
}