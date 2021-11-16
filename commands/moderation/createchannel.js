const moment = require(`moment`)
module.exports = {
    description: 'Lets you create a channel.',
    aliases: ['createchan', 'createchnl'],
    usage: 'createchannel'
}

module.exports.run = async(client, message, args) => {

    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('Sorry! You are missing the permission \`MANAGE_CHANNELS\`').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send(new client.embed().setDescription('Sorry! My roles not high enough!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    let channelnamebruh = args.join(' ')

    if (!channelnamebruh) return message.channel.send(new client.embed().setDescription('Sorry! You failed to provide me the channel name.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    message.channel.send(
            new client.embed()
            .setTitle(`Sucess! I have created the channel!`)
            .addField('Action', `Channel Created`)
            .addField('Channel Name', channelnamebruh)
            .addField('Moderator', message.author)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
        .addField('Command Executed In', message.channel)
        .addField('Time', require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A'))
    message.guild.channels.create(channelnamebruh);

}