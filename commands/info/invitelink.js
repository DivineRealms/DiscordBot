module.exports = {
    description: 'Allows you to see the permanent server invite.',
    aliases: ['invlink', 'invitelnk'],
    usage: 'invitelink'
}

module.exports.run = async(client, message, args) => {

    const embed = new client.embed()
        .setTitle(`Servers Invite Link!`)
        .setDescription(client.conf.automation.Invite_Link)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }));
    message.channel.send(embed)
}