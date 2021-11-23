const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'Allows you to view the bots ping.',
    permissions: [],
    cooldown: 0,
    aliases: ['pings', 'bping'],
    usage: 'ping'
}

module.exports.run = async(client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setDescription("Ping...")
        .setColor(client.conf.settings.embedColor);

    let m = await message.channel.send({ embeds: [embed] });

    m.edit({ embeds: [embed.setColor(client.conf.settings.embedColor).setDescription(`**Latency:** ${m.createdTimestamp - message.createdTimestamp}ms
**API Latency:** ${client.ws.ping}ms
**Uptime:** ${client.utils.formatTime(client.uptime)}`)] })
}
