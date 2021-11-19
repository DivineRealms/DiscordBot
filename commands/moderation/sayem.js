module.exports = {
    description: 'Allows you to speak as the bot but in an embed.',
    permissions: [],
    aliases: [`speakem`],
    usage: 'Sayem <Message>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry you are missing the permission \`ADMINISTRATOR\`!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    const filter = m => m.author.id === message.author.id
    let say = args.slice(0).join(" ")
    if (!say) return message.channel.send({ embeds: [new client.embed().setDescription(`You didn\'t provide any text for me to say!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    message.delete()
    const embed = new client.embed().setDescription(say)
    message.channel.send({ embeds: [embed] })


}