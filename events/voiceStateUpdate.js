const parse = require('parse-duration')
const vcs = new Map()

module.exports = (client, oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channel && client.player.isPlaying(newState)) client.player.stop(newState.guild.id)
    const tempvc = client.settings.get(oldState.guild.id, `vc.${oldState.channelID}`)

    if (tempvc && !oldState.channel.members.size && ![null, Infinity].includes(parse(client.conf.tempvc.Delete_VCS_After))) //should we just make boost run off a role id?
        vcs.set(oldState.channelID, setTimeout(() =>
        oldState.channel.delete().catch(() => {}), parse(client.conf.tempvc.Delete_VCS_After)))

    if (newState.channelID && client.settings.get(newState.guild.id, `vc.${newState.channelID}`)) clearTimeout(vcs.get(newState.channelID))
    const vcroles = client.conf.automation.VC_Roles
    const vcrole = vcroles.find(r => r.channelID === oldState.channelID || r.channelID === newState.channelID)
    if (vcrole && newState.channelID === vcrole.channelID) newState.member.roles.add(vcrole.roleID).catch(() => {})
    else if (vcrole) newState.member.roles.remove(vcrole.roleID).catch(() => {})

    const log = client.channels.cache.get(client.conf.logging.Voice_Updates)
    if (!log) return
    const embed = new client.embed()
        .setAuthor('Voice Status Update!')
        .setFooter(`Fuel Development | Made By Fuel#2649`, newState.guild.iconURL({ dynamic: true }))

    if (oldState.serverDeaf !== newState.serverDeaf && newState.serverDeaf) log.send(embed.setDescription(`**${newState.member.user.tag}** Was Server Deafened!`))
    else if (oldState.serverDeaf !== newState.serverDeaf && !newState.serverDeaf) log.send(embed.setDescription(`**${newState.member.user.tag}** Was Undeafened!`))

    else if (oldState.serverMute !== newState.serverMute && newState.serverMute) log.send(embed.setDescription(`**${newState.member.user.tag}** Was Server Muted!`))
    else if (oldState.serverMute !== newState.serverMute && !newState.serverMute) log.send(embed.setDescription(`**${newState.member.user.tag}** Was Unmuted!`))

    else if (oldState.selfDeaf !== newState.selfDeaf && newState.selfDeaf) log.send(embed.setDescription(`**${newState.member.user.tag}** Self Deafend!`))
    else if (oldState.selfDeaf !== newState.selfDeaf && !newState.selfDeaf) log.send(embed.setDescription(`**${newState.member.user.tag}** Undeafend themself!`))

    else if (oldState.selfMute !== newState.selfMute && newState.selfMute) log.send(embed.setDescription(`**${newState.member.user.tag}** Self Muted`))
    else if (oldState.selfMute !== newState.selfMute && !newState.selfMute) log.send(embed.setDescription(`**${newState.member.user.tag}** Unmuted themself!`))

    else if (oldState.channelID !== newState.channelID && newState.channelID && !oldState.channelID) log.send(embed.setDescription(`**${newState.member.user.tag}** joined a voice channel!\n**Joined Channel:** ${newState.channel}`))
    else if (oldState.channelID !== newState.channelID && oldState.channelID && !newState.channelID) log.send(embed.setDescription(`**${newState.member.user.tag}** left a voice channel!\n**Left channel:** ${oldState.channel}`))
    else if (oldState.channelID !== newState.channelID && oldState.channelID && newState.channelID) log.send(embed.setDescription(`**${newState.member.user.tag}** moved voice channels!\n**Old Channel:** ${oldState.channel}\n**New Channel:** ${newState.channel}`))

    else if (oldState.streaming !== newState.streaming && newState.streaming) log.send(embed.setDescription(`**${newState.member.user.tag}** starting streaming!\n**Streaming in:** ${newState.channel}`))
    else if (oldState.streaming !== newState.streaming && !newState.streaming) log.send(embed.setDescription(`**${newState.member.user.tag}** stopped streaming!`))
}