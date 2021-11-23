module.exports = {
  name: 'createpanel',
  category: 'moderation',
  description: 'Creates the ticket panel message!',
  permissions: ["MANAGE_GUILD"],
  cooldown: 0,
  aliases: [`cpcreate`, `panelcreate`],
  usage: 'createpanel'
}

module.exports.run = async(client, message, args) => {
  const settings = client.conf.ticketSystem
  const embed = client.embedBuilder(client, message, "", "")

  const msg = await message.channel.send({ embeds: [embed.setTitle(settings.Panel_Title).setDescription(settings.Panel_Message)]});
  await msg.react(settings.Panel_Emoji).catch(() => msg.react('✉️'))
  client.settings.push(message.guild.id, msg.id, 'panels')
}