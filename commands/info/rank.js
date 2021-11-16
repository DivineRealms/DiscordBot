const { MessageAttachment } = require('discord.js')
const canvacord = require('canvacord')

module.exports = {
    description: 'View your total xp earned on the server.',
    aliases: ['xp'],
    usage: 'rank [@user]'
}

module.exports.run = async(client, message, args) => {
    const data = client.members.get(message.guild.id, `${message.author.id}.xp`)
    if (!data.level) return message.channel.send(new client.embed().setDescription('You need to be at least level 1 to view your rank!'))

    const rank = Object.entries(client.members.get(message.guild.id)).filter(s => s[1].xp).sort((a, b) => b[1].xp.xp - a[1].xp.xp).map(s => s[0]).indexOf(message.author.id) + 1
    let image = await canvacord.rank({
        username: message.author.username,
        discrim: message.author.discriminator,
        status: message.author.presence.status,
        currentXP: data.xp,
        neededXP: data.level * 500,
        rank,
        level: data.level,
        background: client.conf.leveling.rankCardImage,
        avatarURL: message.author.displayAvatarURL({ format: "png" }),
        color: client.conf.leveling.rankCardColor
    })

    message.channel.send(new MessageAttachment(image, 'rank.png'));
}