module.exports = {
    name: 'botinfo',
    description: 'Allows you to view information on the bot.',
    permissions: [],
    cooldown: 0,
    aliases: ['binfo', 'infobot', 'bottinfo'],
    usage: 'channelinfo <#chanel>'
}

module.exports.run = async(client, message, args) => {
    const info = new client.embed()
        .setTitle(`Information on ${client.user.username}`)
        .setThumbnail(client.user.displayAvatarURL())
        .addField('ID:', client.user.id)
        .addField('Name:', client.user.username)
        .addField('Prefix:', message.px)
        .addField('Channels:', client.channels.cache.size)
    message.channel.send({ embeds: [info] })
}