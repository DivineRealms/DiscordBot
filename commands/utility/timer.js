const parse = require('ms');

module.exports = {
  name: 'timer',
  category: 'utility',
  description: 'Lets you set a timer.',
  permissions: [],
  cooldown: 0,
  aliases: [`time`],
  usage: 'timer <Time>'
}

module.exports.run = async(client, message, args) => {
  let embed3 = client.embedBuilder(client, message, "Timer", "Please provide a valid time!", "RED")

  if (isNaN(parse(args[0]))) return message.channel.send({ embeds: [embed3] });

  const end = Date.now() + parse(args[0]);

  const embed = client.embedBuilder(client, message, "Active Timer", 
    `⏰ **Time**: ${client.utils.formatTime(end - Date.now(), {round: true})}`)

  const msg = await message.channel.send({ embeds: [embed] });

  const timer = setInterval(() => {
    const embed2 = client.embedBuilder(client, message, "Active Timer", 
      `⏰ **Time**: ${client.utils.formatTime(end - Date.now(), { round: true })}`)

    if (Date.now() > end) {
      const done = client.embedBuilder(client, message, "Timer", "Timer has ended!")
      clearInterval(timer)
      return msg.edit({ embeds: [done] })
    } else msg.edit({ embeds: [embed2] })
  }, 5000);
}
