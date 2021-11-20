const parse = require('ms')

module.exports = {
    description: 'Sets the channel slowmode to the requested time.',
    permissions: ["MANAGE_CHANNELS"],
    aliases: [`smode`],
    usage: 'slowmode <Time>'
}

module.exports.run = async(client, message, args) => {
    if ([null, Infinity].includes(parse(args[0]))) return message.channel.send({ embeds: [new client.embed().setDescription(`You failed to provide me the time!`)]})
    const amt = ms(args[0]) / 1000
    if (amt > 21600) return message.channel.send({ embeds: [new client.embed().setDescription(`The time cannot exceed more than 6 hours!`)]})
    if (amt < 5) return message.channel.send({ embeds: [new client.embed().setDescription(`The time needs to be atleast 5 seconds!`)]})

    message.channel.setRateLimitPerUser(amt)
    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Action:** Slowmode\n**Time:**  ${parse(args[0]) / 1000}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })

}