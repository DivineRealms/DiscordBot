const parse = require('ms')
const vcs = new Map()

module.exports = (client, oldState, newState) => {
  const log = client.channels.cache.get(client.conf.logging.Voice_Updates)
  if (!log) return
  const embed = new client.embedBuilder(client, message, "Voice State Update", "")

  if (oldState.serverDeaf !== newState.serverDeaf && newState.serverDeaf) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Was Server Deafened!`) ]})
  else if (oldState.serverDeaf !== newState.serverDeaf && !newState.serverDeaf) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Was Undeafened!`) ]})

  else if (oldState.serverMute !== newState.serverMute && newState.serverMute) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Was Server Muted!`) ]})
  else if (oldState.serverMute !== newState.serverMute && !newState.serverMute) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Was Unmuted!`) ]})

  else if (oldState.selfDeaf !== newState.selfDeaf && newState.selfDeaf) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Self Deafend!`) ]})
  else if (oldState.selfDeaf !== newState.selfDeaf && !newState.selfDeaf) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Undeafend themself!`) ]})

  else if (oldState.selfMute !== newState.selfMute && newState.selfMute) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Self Muted`) ]})
  else if (oldState.selfMute !== newState.selfMute && !newState.selfMute) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** Unmuted themself!`) ]})

  else if (oldState.channelId !== newState.channelId && newState.channelId && !oldState.channelId) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** joined a voice channel!\n**Joined Channel:** ${newState.channel}`) ]})
  else if (oldState.channelId !== newState.channelId && oldState.channelId && !newState.channelId) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** left a voice channel!\n**Left channel:** ${oldState.channel}`) ]})
  else if (oldState.channelId !== newState.channelId && oldState.channelId && newState.channelId) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** moved voice channels!\n**Old Channel:** ${oldState.channel}\n**New Channel:** ${newState.channel}`) ]})

  else if (oldState.streaming !== newState.streaming && newState.streaming) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** starting streaming!\n**Streaming in:** ${newState.channel}`) ]})
  else if (oldState.streaming !== newState.streaming && !newState.streaming) log.send({ embeds: [embed.setDescription(`**${newState.member.user.tag}** stopped streaming!`) ]})
}