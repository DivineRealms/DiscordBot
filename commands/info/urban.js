const fetch = require('node-fetch')
const urban = require(`relevant-urban`)

module.exports = {
  name: 'urban',
  category: 'info',
  description: 'Lets you search whatever you want on urban dictionary.',
  permissions: [],
  cooldown: 0,
  aliases: ['ud'],
  usage: 'urban <search>'
}

module.exports.run = async(client, message, args) => {
  if (!args[0]) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to enter term to search for.", "error")] });

  let def = await urban(args[0]).catch(() => {})
  if (!def) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `No Results found for ${args[0]}.`, "error")] });

  const embed = client.embedBuilder(client, message, "Click Me To View The Word Online!", "")
    .setURL(def.urbanURL)
    .addField(`Definition`, `${def.definition}`.slice(0, 1000), false)
    .addField(`Definition In An Example`, `${def.example || 'none'}`.slice(0, 1000), false)
    .addField(`Author`, def.author, false)

  message.channel.send({ embeds: [embed] })
}