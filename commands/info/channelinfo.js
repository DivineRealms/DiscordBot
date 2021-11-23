module.exports = {
    name: 'channelinfo',
    category: 'info',
    description: 'Allows you to view information on a channel.',
    permissions: [],
    cooldown: 0,
    aliases: ['cinfo', 'infochannel'],
    usage: 'channelinfo <#chanel>'
}

module.exports.run = async(client, message, args) => {
    message.channel.send({ embeds: [
        new client.embedBuilder(client, message, `${message.channel.name} - (${message.channel.id})`)
          .addField(':shield: Information',
          `>>> **Channel Name**:  ${message.channel.name} 
**Channel ID:**  ${message.channel.id} 
**Channel Type:**  ${message.channel.type} 
**NSFW:**  ${message.channel.nsfw} `, false)
          .addField(':speech_balloon: More Info ',
          `>>> **Position:**  ${message.channel.position} 
**Last Message ID:**  ${message.channel.lastMessageID || (await message.channel.messages.fetch({limit: 1})).first().id} 
**Topic:**  ${message.channel.topic || 'No Topic Set!'} 
**Last Message Pinned:**  ${require('moment')(message.channel.lastPinAt).format('ddd, MMMM Do yyyy [at] hh:mm A') || 'none'}`, false)
    ]});
}
