const { sample } = require('lodash')
const fetch = require('node-fetch')

module.exports = {
  name: 'meme',
  category: 'fun',
  description: 'View a random meme.',
  permissions: [],
  cooldown: 0,
  aliases: ['pic'],
  usage: 'meme'
}

module.exports.run = async(client, message, args) => {
  const subReddits = ["meme", "me_irl", "dankmemes", 'memes']
  const list = await fetch(`https://www.reddit.com/r/${sample(subReddits)}/new/.json`).then(r => r.json())
  const item = sample(list.data.children.filter(s => ['gif', 'png', 'jpg', 'jpeg'].some(e => s.data.url.endsWith(e))))

  const embed = client.embedBuilder(client, message, "Random Reddit Meme", "")
    .setURL(`http://reddit.com/${item.permalink}`)
    .setImage(item.data.url)

  message.channel.send({ embeds: [embed] });
}