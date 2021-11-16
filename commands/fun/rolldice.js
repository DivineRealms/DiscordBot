module.exports = {
    description: 'Lets you roll a dice.',
    aliases: ['diceroll', 'droll'],
    usage: 'rolldice [lower-upper]'
}

module.exports.run = async(client, message, args) => message.channel.send(new client.embed().setTitle(`🎲 Dices Rolled! 🎲`).setDescription(`First Dice:  \`${~~(Math.random() * 6)+1}\`\nSecond Dice: \`${~~(Math.random() * 6)+1}\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 })))