module.exports = {
  name: "rps",
  category: "fun",
  description: "Play a game of rps.",
  permissions: [],
  cooldown: 0,
  aliases: ["rock-paper-scissors"],
  usage: "rps [rock | paper | scissors]",
};

module.exports.run = async (client, message, args, cmd) => {
  if (!args[0]) {
    return client.utils.errorEmbed(
      client,
      message,
      "Please include your choice (rock/paper/scissors)."
    );
  }

  let choices = ["rock", "paper", "scissors"];

  if (choices.includes(args[0].toLowerCase())) {
    let number = Math.floor(Math.random() * 3);

    if (number == 1) {
      return message.channel.send({
        embeds: [
          client.embedBuilder(
            client,
            message,
            "Rock Paper Scissors",
            `It was a tie, we both had ${args[0]}`,
            "#2f3134"
          ),
        ],
      });
    }

    if (number == 2) {
      if (args[0].toLowerCase() == "rock") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "I've won! I had paper."
            ),
          ],
        });
      }

      if (args[0].toLowerCase() == "paper") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "I've won! I had scissors."
            ),
          ],
        });
      }

      if (args[0].toLowerCase() == "scissors") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "I've won! I had rock."
            ),
          ],
        });
      }
    }

    if (number == 0) {
      if (args[0].toLowerCase() == "rock") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "You won, I had scissors."
            ),
          ],
        });
      }
      
      if (args[0].toLowerCase() == "paper") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "You won, I had rock."
            ),
          ],
        });
      }

      if (args[0].toLowerCase() == "scissors") {
        return message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Rock Paper Scissors",
              "You won, I had paper."
            ),
          ],
        });
      }
    }
  } else {
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please include your choice (rock/paper/scissors)."
        ),
      ],
    });
  }
};
