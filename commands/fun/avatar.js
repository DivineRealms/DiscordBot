module.exports = {
    description: 'Lets you view the requested avatar.',
    aliases: ['pfp', 'av'],
    usage: 'avatar <@User>'
}

module.exports.run = async(client, message, args) => {
    const Embed = new client.embed()
    const user = message.mentions.users.first() || message.author

    message.channel.send(new client.embed()
        .setTitle(`${user.tag}'s Avatar!`)
        .setImage(user.displayAvatarURL({ dynamic: true }))
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    )
}