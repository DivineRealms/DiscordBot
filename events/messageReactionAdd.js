module.exports = async(client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch()
    if (user.bot || !reaction.message.guild) return
    const settings2 = client.conf.starBoard
    const schannel = client.channels.cache.get(settings2.StarBoard_Channel)
    const vSettings = client.conf.verification
    const suggestion = client.settings.get(reaction.message.guild.id, `suggestions.${reaction.message.id}`)
    let orderID = Math.floor(Math.random() * 1e+15)
    let log = client.channels.cache.get(client.conf.purchaseSystem.Purchase_Logs)

    if (['✅', '❌'].includes(reaction.emoji.name) && suggestion) {
        const user2 = await client.users.fetch(suggestion.user)
        const embed = new client.embed()
            .setDescription(`**Suggestion by ${user2}**\n\n Suggestion: \`${suggestion.suggestion}\`\n\n**Status:**\n${reaction.emoji.name === '✅' ? 'Approved':'Denied'} by ${user}`)
            .setColor(reaction.emoji.name === '✅' ? 'GREEN' : 'RED')
            .setThumbnail(user2.displayAvatarURL({ dynamic: true }))

        user2.send(embed).catch(console.error)
        reaction.message.channel.send(embed)
        client.settings.delete(reaction.message.guild.id, `suggestions.${reaction.message.id}`)
    }

    if (vSettings.enabled && vSettings.verificationType === 'reaction' && reaction.message.id === vSettings.Reaction_Message_ID && reaction.emoji.name === vSettings.Reaction_Emoji) {
        const member = reaction.message.guild.member(user)
        member.roles.add(vSettings.verifyRole)
        member.roles.remove(vSettings.roleToRemove)
    }
    if (settings2.Enabled && reaction.message)
        if (schannel && settings2.Enabled && reaction.emoji.name === settings2.StarBoard_Emoji) {
            const stars = client.settings.get(reaction.message.guild.id, `stars.${reaction.message.id}`)

            if (stars) {
                const board = await schannel.messages.fetch(stars.board).catch(() => {})
                if (!board) return client.settings.delete(reaction.message.guild, `stars.${reaction.message.id}`)
                const count = board.reactions.cache.get(settings2.Minimum_Reactions)
                board.embeds[0].footer.text = `${count} ${settings2.StarBoard_Emoji}`
                board.edit(board.embeds[0])
            } else if (reaction.count >= settings2.Minimum_Reactions) {
                const embed = new client.embed()
                    .setColor('#F1C40F')
                    .addField('Author', reaction.message.author, true)
                    .addField('Channel', reaction.message.channel, true)
                    .setThumbnail(reaction.message.author.displayAvatarURL({ dynamic: true }))
                    .setFooter(`${reaction.count} ${settings2.StarBoard_Emoji}`)
                    .setTimestamp()

                if (reaction.message.content) embed.addField('Content', reaction.message.content)
                if (['png', 'jpg', 'jpeg', 'gif', 'webp'].some(e => (reaction.message.attachments.first() || { url: '' }).url.endsWith(e))) embed.setImage(reaction.message.attachments.first().url)
                let msg = await schannel.send(embed)
                client.settings.set(reaction.message.guild.id, { board: msg.id }, `stars.${reaction.message.id}`)
            }
        }

    client.settings.ensure(reaction.message.guild.id, client.defaultSettings)
    const panel = client.settings.get(reaction.message.guild.id, 'panels').includes(reaction.message.id)
    const settings = client.conf.ticketSystem
    if (!panel || reaction.emoji.name !== client.conf.ticketSystem.Panel_Emoji) return

    const tickets = client.settings.get(reaction.message.guild.id, 'tickets')
    if (Object.entries(tickets).find(s => s[1].user === user.id)) return

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

    channel.send(new client.embed()
        .setTitle(settings.Ticket_Title)
        .setDescription(client.resolveMember(settings.Ticket_Message, user))
    )

    client.settings.set(reaction.message.guild.id, { user: user.id }, `tickets.${channel.id}`)
}