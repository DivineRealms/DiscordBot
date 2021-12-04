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

  if (!args[0]) {
    return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to mention who you would like to hug!`, error)]})
  } else {
    let gifs = [
      "https://media.giphy.com/media/bbxTrFmeoM7aU/giphy.gif",
      "https://media.giphy.com/media/SEQrz1SMPl3mo/giphy.gif",
      "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
      "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
    ]

    const randomNumber = Math.floor(Math.random() * gifs.length)
    const randomGif = gifs[randomNumber]

    if (mentionedMember.user.id === message.author.id) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", "You cannot hug yourself.", error)] });

    var embed = client.embedBuilder(client, message, `${message.author.username} just hugged ${mentionedMember.user.username}!`, "").setImage(randomGif)
    message.channel.send({ embeds: [embed] })
  }
}