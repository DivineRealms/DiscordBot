module.exports = {
    description: 'Allows you to create the partner embed.',
    aliases: [`part`],
    usage: 'partner'
}

module.exports.run = async(client, message, args) => {

    let embed3 = new client.embed()
        .setDescription(`What is the server name you are partnering with?`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    let embed4 = new client.embed()
        .setDescription(`What is the server discord you are partnering with?`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    let embed5 = new client.embed()
        .setDescription(`What is your partners website?`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    let embed6 = new client.embed()
        .setDescription(`Post your partners advert or info on them!`)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
    await message.delete();
    if (!message.member.hasPermission("ADMINISTRATOR"))
        return message.channel.send(new client.embed().setDescription(`You are missing permission \`ADMINISTRATOR\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })));
    const filter = response => {
        return response.author.id === message.author.id
    };
    message.channel.send(embed3).then(() => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ['time']
        }).then(collected => {
            var parntername = collected.first().content;
            message.channel.send(embed4).then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                }).then(collected => {
                    var partnerdiscord = collected.first().content;
                    message.channel.send(embed5).then(() => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        }).then(collected => {
                            var partnerwebsite = collected.first().content;
                            message.channel.send(embed6).then(() => {
                                message.channel.awaitMessages(filter, {
                                    max: 1,
                                    time: 60000,
                                    errors: ['time']
                                }).then(collected => {
                                    var partnerad = collected.first().content;
                                    const product = new client.embed()
                                        .setAuthor(`New Discord Partner Of ${message.guild.name}`, false)
                                        .addField(`Partner:`, parntername, false)
                                        .addField(`Discord:`, partnerdiscord, false)
                                        .addField(`Website:`, partnerwebsite, false)
                                        .addField(`About Them`, `\`\`\`${partnerad}\`\`\``, false)
                                        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))

                                    message.channel.send(product);
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}