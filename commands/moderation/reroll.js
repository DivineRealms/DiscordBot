module.exports = {
    name: 'reroll',
    category: 'moderation',
    description: 'Rerolls a giveaway.',
    permissions: ["MANAGE_MESSAGES"],
    cooldown: 0,
    aliases: ['greroll', 'giveawayreroll'],
    usage: 'reroll <MessageID>'
}

module.exports.run = async(client, message, args) => {
    if (!args[0]) return message.channel.send({ embeds: [new client.embed().setDescription(`You need to provide me the message id!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    let giveaway = client.giveaways.giveaways.find((g) => g.prize === args.join(" ")) || client.giveaways.giveaways.find((g) => g.messageID === args[0]);

    if (!giveaway) return message.channel.send({ embeds: [new client.embed().setDescription(`I couldnt find a giveaway with the name or ID!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});

    client.giveaways.reroll(giveaway.messageID)
        .then(() => {
            message.channel.send({ embeds: [new client.embed().setDescription(`Giveaway has been rerolled by ${message.author}`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway with ID ${giveaway.messageID} has not ended.`)) {
                message.channel.send({ embeds: [new client.embed().setDescription(`This giveaway hasnt ended yet.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]});
            } else {
                console.log(e);
            }
        })
}