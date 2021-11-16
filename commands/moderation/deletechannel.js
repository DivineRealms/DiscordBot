const moment = require(`moment`)
module.exports = {
    description: 'Lets you delete a channel.',
    aliases: ['deletechan', 'deletechnl'],
    usage: 'deletechannel name'
}

module.exports.run = async(client, message, args) => {

    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('Sorry! You are missing the permission \`MANAGE_CHANNELS\`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('Sorry! My roles not high enough!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    let Channeldeletelol = message.mentions.channels.first()

    if (!Channeldeletelol) return message.channel.send(new client.embed().setDescription('Sorry! You need to mention the channel.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))


    message.channel.send(
        new client.embed()
        .setTitle(`Sucess! I have deleted the channel!`)
        .addField('Action', `Channel Deleted`)
        .addField('Moderator', message.author)
        .addField('Command Executed In', message.channel)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addField('Time', require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A')))
    await Channeldeletelol.delete()

}