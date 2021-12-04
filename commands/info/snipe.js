module.exports = {
  name: 'snipe',
  category: 'info',
  description: 'Lets you see the last deleted message.',
  permissions: [],
  cooldown: 0,
  aliases: ['snip3'],
  usage: 'snipe'
}

module.exports.run = async(client, message, args) => {
  let embed3 = client.embedBuilder(client, message, "Error", "Theres nothing to snipe :/", "error")

  let snipe = client.snipes.get(message.channel.id)
  if (!snipe || !snipe.content) return message.channel.send({ embeds: [embed3] })
  let user = await client.users.fetch(snipe.user)
  const embed = client.embedBuilder(client, message, 
    `I have sniped ${user.tag}\'s message!`,
    `The last deleted message said: \`\`\`${snipe.content}\`\`\``)

  message.channel.send(`I have sniped this users message!`)
  message.channel.send({ embeds: [embed] });
}