module.exports = {
    description: 'Sets your status to afk so people know.',
    aliases: [`brb`],
    usage: 'afk <Reason>'
}

module.exports.run = async(client, message, args) => {
    client.afk.set(message.author.id, { time: Date.now(), message: args.join(' ') || 'AFK' })
    message.member.setNickname(`[AFK] ${message.member.displayName.replace(/(\[AFK\])/g, '')}`).catch(() => {})
    message.channel.send(`I set your afk status to: ${args.join(' ') || 'AFK'}`)
}