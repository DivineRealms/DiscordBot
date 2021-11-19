module.exports = {
    description: 'Lets you lock a channel in the guild.',
    permissions: [],
    aliases: ['lockc', 'lock'],
    usage: 'lockchannel <#Channel>'
}
module.exports.run = async(client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
        return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry! You are missing the permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);

    if (!channel) {
        return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You must provide Valid Channel.", "RED")] });
    }

    channel
        .updateOverwrite(message.guild.roles.everyone.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
        })
        .catch((error) => {
            return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry! You are missing the permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
        });

    message.guild.roles.cache.each((role) => {
        channel
            .updateOverwrite(role.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            })
            .catch((error) => {
                return message.channel.send({ embeds: [new client.embed().setDescription(`Sorry! You are missing the permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
            });
    });

    const embed = new client.embed()
        .setAuthor(`${message.author.tag} - (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Action:** Lock Channel\n**Channel:** ${channel.name}\n**Time:** ${require('moment')().format('ddd, MMMM Do YYYY [at] hh:mm A')}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(`RED`)
    channel.send({ embeds: [embed] });

    message.author.send({ embeds: [new client.embed().setColor(`GREEN`).setDescription(`Success! You have locked ${channel.name}.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
}