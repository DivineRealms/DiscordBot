module.exports = {
    name: 'avatar',
    category: 'fun',
    description: 'Lets you view the requested avatar.',
    permissions: [],
    cooldown: 0,
    aliases: ['pfp', 'av'],
    usage: 'avatar <@User>'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author

    message.channel.send({ embeds: [new client.embed()
        .setTitle(`${user.tag}'s Avatar!`)
        .setImage(user.displayAvatarURL({ dynamic: true }))
    ]});
}