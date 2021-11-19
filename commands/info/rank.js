const { MessageAttachment } = require('discord.js')
const db = require('quick.db')
const canvacord = require('canvacord')

module.exports = {
    description: 'View your total xp earned on the server.',
    permissions: [],
    aliases: ['xp'],
    usage: 'rank [@user]'
}

module.exports.run = async(client, message, args) => {
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let level = db.fetch(`level_${message.guild.id}_${user.id}`);
    let xp = db.fetch(`xp_${message.guild.id}_${user.id}`);

    let every = db.all().filter(i => i.ID.startsWith(`level_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`level_${message.guild.id}_${user.id}`) + 1 || 0;
    
    let presence = member.presence;
    if(presence == null) presence == "offline";
    else presence = presence.status;

    let image = await canvacord.rank({
        username: user.username,
        discrim: user.discriminator,
        status: presence,
        currentXP: xp,
        neededXP: level * 500,
        rank,
        level: level,
        background: client.conf.leveling.rankCardImage,
        avatarURL: user.displayAvatarURL({ format: "png" }),
        color: client.conf.leveling.rankCardColor
    })

    message.channel.send(new MessageAttachment(image, 'rank.png'));
}