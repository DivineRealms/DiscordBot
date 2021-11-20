const parse = require('ms');

module.exports = {
    name: 'timer',
    description: 'Lets you set a timer.',
    permissions: [],
    cooldown: 0,
    aliases: [`time`],
    usage: 'timer <Time>'
}

module.exports.run = async(client, message, args) => {
    let embed3 = new client.embed()
        .setDescription(`Please provide a valid time!`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    if ([null, Infinity].includes(parse(args[0]))) return message.channel.send({ embeds: [embed3] });

    const end = Date.now() + parse(args[0]);

    const embed = new client.embed()
        .setAuthor(`ACTIVE TIMER`)
        .setDescription(`⏰ **Time**: ${client.utils.formatTime(end - Date.now(), {round: true})}`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

    const msg = await message.channel.send({ embeds: [embed] });

    const timer = setInterval(() => {
        const embed2 = new client.embed()
            .setAuthor(`ACTIVE TIMER`)
            .setDescription(`⏰ **Time**: ${client.utils.formatTime(end - Date.now(), { round: true })}`)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

        if (Date.now() > end) {
            const done = new client.embed()
                .setDescription(`Timer has ended!`)
            clearInterval(timer)
            return msg.edit(done)
        } else msg.edit({ embeds: [embed2] })
    }, 5000);
}