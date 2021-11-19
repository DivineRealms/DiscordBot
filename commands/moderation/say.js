module.exports = {
    description: 'Lets you speak as the bot and be a cool kid.',
    permissions: [],
    aliases: [`speak`],
    usage: 'say <Message>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry you are missing the permission \`ADMINISTRATOR\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    const filter = response => response.author.id === message.author.id

    let say = args.slice(0).join(" ")
    if (!say) return message.channel.send({ embeds: [new client.embed().setDescription(`You didn\'t provide any text for me to say!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    message.delete()
    message.channel.send(say)
}