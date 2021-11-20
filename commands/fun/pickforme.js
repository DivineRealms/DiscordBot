module.exports = {
    name: 'pickforme',
    description: 'Cant decide? Ill pick for you.',
    permissions: [],
    cooldown: 0,
    aliases: ['choose', 'pick'],
    usage: 'pickforme <option,option ETC>'
}

module.exports.run = async(client, message, args) => {

    const choices = args.join(' ').split(/\s*\|\s*/).filter(s => s.length)
    const choice = choices[~~(Math.random() * choices.length)]

    if (!choice) return message.channel.send({ embeds: [new client.embed().setDescription(`You need to give me choices separated with a \`|\`\nExample \`${message.px}pickforme apple | banana | peach\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})

    message.channel.send(`You gave me the options of \`${choices.join(' ')}\`\nI chose: ${choice}`)
}