module.exports = {
  name: 'advancedpoll',
  category: 'moderation',
  description: 'Creates an advanced poll.',
  permissions: ["MANAGE_CHANNELS"],
  cooldown: 0,
  aliases: ['advpoll'],
  usage: 'advancedpoll Question | op1 | op2 | etc'
}

module.exports.run = async(client, message, args) => {
  let options = args.join(' ').split('|').map(s => s.trim().replace(/\s\s+/g, ' '))
  let question = options.shift(),
    emoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']

  if (!options[1]) return message.channel.send(`To create a poll, do \`${message.px}advancedpoll Question | op1 | op2 | etc\`\nMinimum of 2 options are required`)

  await message.delete

  const embed = client.embedBuilder(client, message, 
    `Poll Created By ${message.author.tag}`,
    `${question}\n\n${emoji[0]} ${options[0]}`
  )

  for (let i = 1; i < options.length && i < 10; i++) embed.addField('\u200b', `${emoji[i]} ${options[i]}`)

  let msg = await message.channel.send({ embeds: [embed] })

  for (let i in options) await msg.react(emoji[i])
};
