module.exports = {
  name: 'rps',
  category: 'fun',
  description: 'Play a game of rps.',
  permissions: [],
  cooldown: 0,
  aliases: ['rock-paper-scissors'],
  usage: 'rps [rock | paper | scissors]'
}

module.exports.run = async(client, message, args, cmd) => {
  let embed1 = client.embedBuilder(client, message, "Error", "Please include your choice, you can pick from rock,paper or scissors.", error)
  let embed2 = client.embedBuilder(client, message, "RPS", "I won, I had paper.")
  let embed3 = client.embedBuilder(client, message, "RPS", "I won, I had scissors.")
  let embed4 = client.embedBuilder(client, message, "RPS", "I won I had rock.")
  let embed5 = client.embedBuilder(client, message, "RPS", "You won, I had scissors.")
  let embed6 = client.embedBuilder(client, message, "RPS", "You won, I had rock.")
  let embed7 = client.embedBuilder(client, message, "RPS", "You won, I had paper.")
  let embed8 = client.embedBuilder(client, message, "RPS", "Please include either: Rock, Paper, or Scissors.")
  let embed9 = client.embedBuilder(client, message, "RPS", "It was a tie, we both had ${args[0]}")


  if (!args[0]) {
    return message.channel.send({ embeds: [embed1] })
  }

  let choices = ['rock', 'paper', 'scissors'];
  if (choices.includes((args[0]).toLowerCase())) {
    let number = Math.floor(Math.random() * 3);
    if (number == 1) {
      return message.channel.send({ embeds: [embed9] })
    }
    if (number == 2) {
      if ((args[0]).toLowerCase() == "rock") {
        return message.channel.send({ embeds: [embed2] })
      }
      if ((args[0]).toLowerCase() == "paper") {
        return message.channel.send({ embeds: [embed3] })
      }
      if ((args[0]).toLowerCase() == "scissors") {
        return message.channel.send({ embeds: [embed4] })
      }
    }
    if (number == 0) {
      if ((args[0]).toLowerCase() == "rock") {
        return message.channel.send({ embeds: [embed5] })
      }
      if ((args[0]).toLowerCase() == "paper") {
        return message.channel.send({ embeds: [embed6] })
      }
      if ((args[0]).toLowerCase() == "scissors") {
        return message.channel.send({ embeds: [embed7] })
      }
    }
  } else {
    return message.channel.send({ embeds: [embed8] })
  }
}