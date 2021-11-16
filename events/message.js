const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const utils = require('../handler/utilities')

module.exports = (client, message) => {
        if (!message.guild && !message.author.bot) utils.dms(client, message)
        if (!message.guild || message.author.bot) return
        utils.automod(client, message)


        if (client.afk.has(message.author.id)) {
            message.channel.send(`Welcome back ${message.author}! I removed your afk.`)
            client.afk.delete(message.author.id)
            return message.member.setNickname(message.member.displayName.replace(/(\[AFK\])/g, '')).catch(() => {})
        }

        const prefixRegex = new RegExp(`^(${client.conf.settings.mentionPrefix ? `<@!?${client.user.id}>|` : ''}${escapeRegex(message.px)})\\s*`)
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase()
    const command = client.commands.find((c, a) => a === cmd || c.aliases && c.aliases.includes(cmd))

    if (command && !client.conf.economy.enabled && command.category === 'economy') return message.channel.send(new client.embed().setDescription('The economy hasnt been enabled!'))
    if (command && utils.dj(client, message, cmd)) return
    if (command) command.run(client, message, args)
}