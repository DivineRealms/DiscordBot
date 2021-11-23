module.exports = {
    name: 'hug',
    category: 'fun',
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
        return message.channel.send({ embeds: [new client.embedBuiler(client, message, "Error", "You need to mention who you would like to hug!")]})
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

        const randomNumber = Math.floor(Math.random() * gifs.length)
        const randomGif = gifs[randomNumber]

        const randomNumber2 = Math.floor(Math.random() * reponses.length)
        const randomResponse = reponses[randomNumber2]

        const randomNumber3 = Math.floor(Math.random() * botMessgaes.length)

        if (mentionedMember.user.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot hug yourself.", "RED")] });

        var embed = new client.embed()
            .setAuthor(randomResponse, message.author.displayAvatarURL())
            .setImage(randomGif)
        message.channel.send({ embeds: [embed] })
    }
}
