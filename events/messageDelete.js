module.exports = async(client, message) => {
        const log = client.channels.cache.get(client.conf.logging.Message_Updates);
        if (!log || !message.author || !message.guild || message.author.bot) return
        client.snipes.set(message.channel.id, { user: message.author.id, content: message.content })
        setTimeout(() => {
            if (client.snipes.get(message.channel.id) && client.snipes.get(message.channel.id).id === message.id)
                client.snipes.delete(message.channel.id)
        }, 300000);

        let audit = (await message.guild.fetchAuditLogs({ type: 72 })).entries.filter(s => s.target.id === message.author.id).first()

        const embed = new client.embed()
            .setAuthor('A message was deleted!')
            .setDescription(`**Channel:** ${message.channel}\n**User:** ${message.author.tag}${audit ? `\n**Deleted By**: ${audit.executor}` : ''}\n**Message Deleted:** ${message.content}\n**Message ID:**  ${message.id}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    log.send({ embeds: [embed] })
}