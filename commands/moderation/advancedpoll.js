module.exports = {
    description: 'Creates an advanced poll.',
    aliases: ['advpoll'],
    usage: 'advancedpoll Question | op1 | op2 | etc\`\nMinimum of 2 options are required'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`MANAGE_CHANNELS\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    let options = args.join(' ').split('|').map(s => s.trim().replace(/\s\s+/g, ' '))
    let question = options.shift(),
        emoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']

    if (!options[1]) return message.channel.send(`To create a poll, do \`${message.px}advancedpoll Question | op1 | op2 | etc\`\nMinimum of 2 options are required`)

    await message.delete

    const embed = new client.embed()
        .setAuthor(`Poll Created By ${message.author.tag}`, 'https://cdn.discordapp.com/attachments/745089083008745553/758900685919223858/poll.png')
        .setDescription(`${question}\n\n${emoji[0]} ${options[0]}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    for (let i = 1; i < options.length && i < 10; i++) embed.addField('\u200b', `${emoji[i]} ${options[i]}`)

    let msg = await message.channel.send(embed)

    for (let i in options) await msg.react(emoji[i])
};