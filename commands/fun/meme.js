const { sample } = require('lodash')
const fetch = require('node-fetch')

module.exports = {
    description: 'View a random meme.',
    aliases: ['pic'],
    usage: 'meme'
}

module.exports.run = async(client, message, args) => {
    const subReddits = ["meme", "me_irl", "dankmemes", 'memes']
    const list = await fetch(`https://www.reddit.com/r/${sample(subReddits)}/new/.json`).then(r => r.json())
    const item = sample(list.data.children.filter(s => ['gif', 'png', 'jpg', 'jpeg'].some(e => s.data.url.endsWith(e))))

    const embed = new client.embed()
        .setTitle(`The MEMEINATOR 90000`)
        .setURL(`http://reddit.com/${item.permalink}`)
        .setImage(item.data.url)
        .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.guild.iconURL({ dynamic: true }))

    message.channel.send(embed);

}