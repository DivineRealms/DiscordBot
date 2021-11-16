const ms = require('parse-duration')
const dur = require('humanize-duration')

module.exports = {
    description: 'Creates a timed poll.',
    aliases: ['tp'],
    usage: 'timedpoll <time> <question> | op1 | op2 | etc'
}

module.exports.run = async(client, message, args, cmd) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`MANAGE_CHANNELS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    const options = args.slice(1).join(' ').split('|').map(s => s.trim().replace(/\s\s+/g, ' ')),
        question = options.shift(),
        emoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'],
        time = ms(args[0]),
        end = Date.now() + ms(args[0])

    if (!options[1]) return message.channel.send(`To create a poll, do \`${message.px}timedpoll <time> <question> | op1 | op2 | etc\`\nMinimum of 2 options are required`)
    if ([null, Infinity].includes(time)) return message.channel.send('To create a poll, enter a valid time. For example: `1d`')

    await message.delete()
    const embed = new client.embed()
        .setAuthor(`Poll Created By ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/745089083008745553/758900685919223858/poll.png')
        .setTitle(question)
        .setDescription(`\n\n**__TIME REMAINING__** ${dur(time, { conjunction: " and ", serialComma: false, round: true })}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    for (let i = 0; i < options.length && i < 10; i++) embed.addField('\u200b', `${emoji[i]} ${options[i]}`)

    const msg = await message.channel.send(embed)
    for (let i = 0; i < options.length; i++) await msg.react(emoji[i])

    const x = setInterval(() => {
        msg.edit(embed.setDescription(`\n\n**__TIME REMAINING__** ${dur(end - Date.now(), { conjunction: " and ", serialComma: false, round: true })}`)).catch(() => {})
        if (Date.now() > end) {
            msg.edit(embed.setDescription(`\n\n**__TIME REMAINING__** Times Up!`)).catch(() => {})
            message.channel.send(new client.embed().setDescription(`Poll created by ${message.author.tag} has ended!`))
            clearInterval(x)
        }
    }, 5000)
}