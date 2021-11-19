const { random, sample } = require('lodash')
const db = require('quick.db')

module.exports = {
    description: 'Rob a bank and get some quick cash.',
    permissions: [],
    aliases: ['robabank'],
    usage: 'robbank'
}

module.exports.run = async(client, message, args) => {
    const chance = Math.random()

    if (chance > 0.8) {
        const profits = random(10, 30)
        message.channel.send(`You robbed **${sample(['scotia', 'TD', 'CIBC', 'Tangarine'])} bank** and got **${random(5, 20)}** bags of cash!\n**${profits}** ${message.coin} has been added to your wallet!`)
        return client.members.math(message.guild.id, '+', profits, `${message.author.id}.balance.wallet`)
    } else if (chance > 0.4) return message.channel.send(`You attempted to rob **${sample(['scotia', 'TD', 'CIBC', 'Tangarine'])} bank** and got caught!\nYou escaped the police car and left uncharged!`)

    const fine = random(10, 100)
    message.channel.send(`You attempted to rob **${sample(['scotia', 'TD', 'CIBC', 'Tangarine'])} bank** and got caught!\nYou were fined **${fine}** ${message.coin}`)
    client.members.math(message.guild.id, '-', fine, `${message.author.id}.balance.wallet`)
}