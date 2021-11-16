const parse = require('parse-duration')

module.exports = {
    description: 'Remove users to your temporary voice channel.',
    aliases: ['removefromvc'],
    usage: 'removeuser <@user>'
}

module.exports.run = async(client, message, args) => {
    const vcSettings = client.settings.get(message.guild.id, `vc.${message.member.voice.channelID}`)
    const members = message.mentions.members
    if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    if (!client.conf.tempvc.enabled) return
    if (!message.member.voice.channelID) message.channel.send(new client.embed().setDescription('You need to enter your temporary vc to add users!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!vcSettings) return message.channel.send(new client.embed().setDescription('This isnt a temporary vc channel!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (vcSettings.user !== message.author.id) return message.channel.send(new client.embed().setDescription('You can only remove users to your own temporary vc').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (!members.size) return message.channel.send(new client.embed().setDescription('You need to mention members youre going to remove from the vc!').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))
    if (members.size > 5) return message.channel.send(new client.embed().setDescription('You cant remove more than 5 members at once.').setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))

    members.each(s => message.member.voice.channel.updateOverwrite(s.id, { CONNECT: false }))
}