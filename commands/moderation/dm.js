module.exports = {
    description: 'I will dm someone for you.',
    aliases: [`direct-message`],
    usage: 'dm <Text>'
}

module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR'))
        return message.channel.send(new client.embed().setDescription(`Sorry you are missing the permission \`ADMINISTRATOR\`.`));

    const user = message.mentions.users.first() || message.guild.member(args[0]);

    if (!user) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You have provided invalid user.", "RED")] });

    const text = args.slice(1).join(' ');

    if (!text) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You need to provide text to send.", "RED")] });

    user.send(text).catch(() => {
        return message.channel.send(new client.embed().setDescription(`Sorry this user has their dms locked!`))
    });

    const embed = new client.embed()
        .setColor('GREEN')
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setDescription(`Successfully sent a direct message to ${user}!`);

    message.channel.send(embed);
}