const db = require('quick.db')
const Discord = require('discord.js')

module.exports = async(client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch()
  if (user.bot || !reaction.message.guild) return
  const starboard = client.conf.starBoard
  const schannel = client.channels.cache.get(starboard.StarBoard_Channel)
  const suggestion = client.settings.get(reaction.message.guild.id, `suggestions.${reaction.message.id}`)

  if (['✅', '❌'].includes(reaction.emoji.name) && suggestion) {
    const user2 = await client.users.fetch(suggestion.user)
    const embed = new client.embed()
      .setDescription(`**Suggestion by ${user2}**\n\n Suggestion: \`${suggestion.suggestion}\`\n\n**Status:**\n${reaction.emoji.name === '✅' ? 'Approved':'Denied'} by ${user}`)
      .setColor(reaction.emoji.name === '✅' ? 'GREEN' : 'RED')
      .setThumbnail(user2.displayAvatarURL({ dynamic: true }))

    user2.send({ embeds: [embed] }).catch(console.error)
    reaction.message.channel.send({ embeds: [embed] })
    client.settings.delete(reaction.message.guild.id, `suggestions.${reaction.message.id}`)
  }

  if (starboard.Enabled && reaction.message) {
    if (schannel && starboard.Enabled && reaction.emoji.name == starboard.StarBoard_Emoji) {
      const stars = db.fetch(`stars_${reaction.message.guild.id}_${reaction.message.id}`);

      if (stars) {
        const board = await schannel.messages.fetch(stars).catch(() => {})
        if (!board) return db.delete(`stars_${reaction.message.guild.id}_${reaction.message.id}`);
        const count = board.reactions.cache.get(starboard.Minimum_Reactions)
        board.embeds[0].footer.text = `${count} ${starboard.StarBoard_Emoji}`
        board.edit({ embeds: [board.embeds[0]] })
      } else if (reaction.count >= starboard.Minimum_Reactions) {
        const embed = new client.embed()
          .setTitle(reaction.message.author.username)
          .setThumbnail(reaction.message.author.displayAvatarURL({ dynamic: true }))

        if (reaction.message.content) embed.setDescription(`> ${reaction.message.content}\n\n[Click Here to View Message](${reaction.message.url})`)
        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].some(e => (reaction.message.attachments.first() || { url: '' }).url.endsWith(e))) embed.setImage(reaction.message.attachments.first().url)
        let msg = await schannel.send({ embeds: [embed] })
        db.set(`stars_${reaction.message.guild.id}_${reaction.message.id}`, msg.id);
      }
    }
  }

  client.settings.ensure(reaction.message.guild.id, client.defaultSettings)
  const panel = client.settings.get(reaction.message.guild.id, 'panels').includes(reaction.message.id)
  const settings = client.conf.ticketSystem
  if (!panel || reaction.emoji.name !== client.conf.ticketSystem.Panel_Emoji) return

  const tickets = db.all().filter(i => i.ID.startsWith(`tickets_${reaction.message.guild.id}_`)) || [];;
  if (tickets.find((u) => u.data.includes(user.id))) return reaction.users.remove(user.id);
  
  reaction.users.remove(user.id)

  const num = Object.entries(tickets).length || 1
  const ticketNumber = '0'.repeat(4 - num.toString().length) + num
  const permissions = settings.Support_Team_Roles.map(r => ({ id: r, allow: ['VIEW_CHANNEL'] }))

  const channel = await reaction.message.guild.channels.create(settings.Ticket_Name.replace('{number}', ticketNumber).replace('{username}', user.username), {
    parent: settings.Ticket_Category,
    permissionOverwrites: [{
      id: reaction.message.guild.id,
      deny: 'VIEW_CHANNEL'
    }, { id: user.id, allow: 'VIEW_CHANNEL' }, ...permissions]
  })

  channel.send({ embeds: [new client.embed()
    .setTitle(settings.Ticket_Title)
    .setDescription(client.resolveMember(settings.Ticket_Message, user))]})

  db.set(`tickets_${reaction.message.guild.id}_${channel.id}`, user.id);
}
