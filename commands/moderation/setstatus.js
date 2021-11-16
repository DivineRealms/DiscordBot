module.exports = {
    description: 'Allows you to set the bots status.',
    aliases: [],
    usage: 'setstatus <TEXT>'
}
module.exports.run = async(client, message, args) => {
    let embed3 = new client.embed()
        .setDescription(`Sorry, but this command requires \`ADMINISTRATOR\`!`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    let embed4 = new client.embed()
        .setDescription(`I mean if you wanna be dumb.. as usual dont tell me what to set my status to smh.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    if (!message.member.hasPermission('ADMINISTRATOR'))
        return message.channel.send(embed3);

    const status = args.join(' ');
    if (!status)
        return message.channel.send(embed4)

    const embed = new client.embed()
        .setDescription(`I have set my status to \`${status}\``)
        .setFooter(`Status Changed By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))

    message.channel.send(embed);

    client.user.setActivity(status);
}