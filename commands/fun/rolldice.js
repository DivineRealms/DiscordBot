module.exports = {
    name: 'rolldice',
    category: 'fun',
    description: 'Lets you roll a dice.',
    permissions: [],
    cooldown: 0,
    aliases: ['diceroll', 'droll'],
    usage: 'rolldice [lower-upper]'
}

module.exports.run = async(client, message, args) => message.channel.send({ embeds: [new client.embedBuilder(client, message, "🎲 Dices Rolled! 🎲", `First Dice:  \`${~~(Math.random() * 6)+1}\`\nSecond Dice: \`${~~(Math.random() * 6)+1}\``)]})
