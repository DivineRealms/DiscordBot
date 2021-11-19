module.exports = {
    description: 'Allows you to view information on a channel.',
    permissions: [],
    aliases: ['cinfo', 'infochannel'],
    usage: 'channelinfo <#chanel>'
}

module.exports.run = async(client, message, args) => {
    message.channel.send(
        new client.embed()
        .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor(`${message.channel.name} - (${message.channel.id})`, message.guild.iconURL())
        .addField(':shield: Information',
            `**Channel Name**:  ${message.channel.name} 
           **Channel ID:**  ${message.channel.id} 
           **Channel Type:**  ${message.channel.type} 
           **NSFW:**  ${message.channel.nsfw} `, false)
        .addField(':speech_balloon: More Info ',
            `**Position:**  ${message.channel.position} 
            **Last Message ID:**  ${message.channel.lastMessageID || (await message.channel.messages.fetch({limit: 1})).first().id} 
            **Topic:**  ${message.channel.topic || 'No Topic Set!'} 
            **Last Message Pinned:**  ${require('moment')(message.channel.lastPinAt).format('ddd, MMMM Do yyyy [at] hh:mm A') || 'none'}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTimestamp()
    );
}