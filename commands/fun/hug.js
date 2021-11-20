module.exports = {
    name: 'hug',
    description: 'Feel Lonely? Give someone a hug.',
    permissions: [],
    cooldown: 0,
    aliases: ['hugs', 'cuddles'],
    usage: 'hug <@User>'
}

module.exports.run = async(client, message, args) => {
    const mentionedMember = message.mentions.members.first()

    const gifs = client.users.fetch(args[0]).catch(() => {});

    if (!gifs) {
        return message.channel.send({ embeds: [new client.embed().setDescription(`You need to mention who you would like to hug!`).setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))]})
    } else {
        let gifs = [
            "https://media.giphy.com/media/bbxTrFmeoM7aU/giphy.gif",
            "https://media.giphy.com/media/SEQrz1SMPl3mo/giphy.gif",
            "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
            "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
        ]

        let reponses = [
            `${message.author.username} just hugged ${mentionedMember.user.username}!`
        ]

        let botMessgaes = [
            `**${message.author.username} ... How many times have I told you.. stop being a idiot, you can\'t hug yourself!**`
        ]

        const randomNumber = Math.floor(Math.random() * gifs.length)
        const randomGif = gifs[randomNumber]

        const randomNumber2 = Math.floor(Math.random() * reponses.length)
        const randomResponse = reponses[randomNumber2]

        const randomNumber3 = Math.floor(Math.random() * botMessgaes.length)
        const randomBotMsg = botMessgaes[randomNumber3]

        if (mentionedMember.user.id === message.author.id) return message.channel.send(randomBotMsg)

        var embed = new client.embed()
            .setAuthor(randomResponse, message.author.displayAvatarURL())
            .setImage(randomGif)
        message.channel.send({ embeds: [embed] })
    }
}