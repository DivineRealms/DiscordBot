const { MessageAttachment } = require('discord.js')
const db = require('quick.db')
const canvacord = require('canvacord')

module.exports = {
    name: 'rank',
    category: 'info',
    description: 'View your total xp earned on the server.',
    permissions: [],
    cooldown: 0,
    aliases: ['xp'],
    usage: 'rank [@user]'
}

module.exports.run = async(client, message, args) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let member = message.guild.members.cache.get(user.id);
    let level = db.fetch(`level_${message.guild.id}_${user.id}`) || 1;
    let xp = db.fetch(`xp_${message.guild.id}_${user.id}`) || 1;

    let every = db.all().filter(i => i.ID.startsWith(`level_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`level_${message.guild.id}_${user.id}`) + 1 || 1;
    
    let presence = member.presence;
    if(presence == null) presence == "offline";
    else presence = presence.status;

    let image = await canvacord.rank({
        username: user.username,
        discrim: user.discriminator,
        status: presence,
        currentXP: xp,
        neededXP: (level + 1) * 2 * 250 + 250,
        rank: rank,
        level: level,
        background: client.conf.leveling.rankCardImage,
        avatarURL: user.displayAvatarURL({ format: "png" }),
        color: client.conf.leveling.rankCardColor
    })

    let file = new MessageAttachment(image, 'rank.png') 

    message.channel.send({ files: [file] });
}