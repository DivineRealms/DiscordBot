module.exports = {
    name: 'rolldice',
    description: 'Lets you roll a dice.',
    permissions: [],
    cooldown: 0,
    aliases: ['diceroll', 'droll'],
    usage: 'rolldice [lower-upper]'
}

module.exports.run = async(client, message, args) => message.channel.send({ embeds: [new client.embed().setTitle(`🎲 Dices Rolled! 🎲`).setDescription(`First Dice:  \`${~~(Math.random() * 6)+1}\`\nSecond Dice: \`${~~(Math.random() * 6)+1}\``).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})