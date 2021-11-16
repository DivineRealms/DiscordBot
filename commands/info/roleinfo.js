const { MessageEmbed } = require('discord.js');
const { utc } = require('moment')

module.exports = {
    description: 'Allows you to view information on a role.',
    aliases: ['roleinformation', 'ri'],
    usage: 'roleinfo <@Role>'
}

module.exports.run = async(client, message, args) => {

    const embed = new client.embed()
        .setFooter(`${message.channel.guild.name} | Made By Fuel#2649`, message.channel.guild.iconURL({ dynamic: true }))

    let role = message.mentions.roles.first()
    if (!role) return message.channel.send(embed.setDescription('Please mention a role to get its info'))

    let embed2 = new client.embed()
        .setTitle(`${role.name} Role Information`)
        .addField("Role Creation:", `${utc(role.createdAt).format('dddd, MMMM Do YYYY')}`, false)
        .addField("Role ID:", role.id, false)
        .addField("Position:", role.rawPosition, false)
        .addField("Color:", role.hexColor, false)
        .addField('Hoisted:', role.hoist, false)
        .setFooter(`Requested By ${message.author.tag}  |  Made By Fuel#2649`, message.author.displayAvatarURL({ dynamic: true }))

    message.channel.send(embed2);
}