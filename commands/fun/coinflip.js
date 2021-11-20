module.exports = {
    name: 'coinflip',
    description: 'Cant decide? Flip a coin.',
    permissions: [],
    cooldown: 0,
    aliases: ['cf'],
    usage: 'coinflip'
}

module.exports.run = async(client, message) => message.channel.send({ embeds: [new client.embed().setDescription(`Coin flipped by ${message.author.username} and it landed on **${Math.random() > 0.5 ? 'Heads' : 'Tails'}**.`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})