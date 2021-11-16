module.exports = {
    description: 'Pulls the servers icon.',
    aliases: ['guildicon'],
    usage: 'servericon'
}

module.exports.run = async(client, message) => {
    const embed = new client.embed()
        .setTitle(`${message.guild.name}\'s Icon`)
        .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    message.channel.send(embed);

}