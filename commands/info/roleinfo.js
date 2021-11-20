const { MessageEmbed } = require('discord.js');
const { utc } = require('moment')

module.exports = {
    name: 'roleinfo',
    category: 'info',
    description: 'Allows you to view information on a role.',
    permissions: [],
    cooldown: 0,
    aliases: ['roleinformation', 'ri'],
    usage: 'roleinfo <@Role>'
}

module.exports.run = async(client, message, args) => {
    let role = message.mentions.roles.first()
    if (!role) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to mention role.", "RED")] });

    let embed = new client.embed()
        .setTitle(`${role.name} Role Information`)
        .addField("Role Creation:", `${utc(role.createdAt).format('dddd, MMMM Do YYYY')}`, false)
        .addField("Role ID:", role.id, false)
        .addField("Position:", role.position, false)
        .addField("Color:", role.hexColor, false)
        .addField('Hoisted:', role.hoist, false)
        .setFooter(`Divine Realms`, client.user.displayAvatarURL({ size: 1024 }))

    message.channel.send({ embeds: [embed] });
}