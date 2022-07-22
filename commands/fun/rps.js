const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "rps",
  category: "fun",
  description: "Play a game of rps.",
  permissions: [],
  cooldown: 0,
  aliases: ["rock-paper-scissors"],
  usage: "rps [rock | paper | scissors]",
  slash: true,
  options: [{
    name: "choice",
    description: "RPS Choice",
    type: ApplicationCommandOptionType.String,
    choices: [{
      name: "Rock",
      value: "rock"
    }, {
      name: "Paper",
      value: "paper"
    }, {
      name: "Scissors",
      value: "scissors"
    }]
  }]
};

module.exports.run = async (client, message, args, cmd) => {
  if (!args[0]) {
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

  let choices = ["rock", "paper", "scissors"];

  if (choices.includes(args[0].toLowerCase())) {
    let number = Math.floor(Math.random() * 3);

    if (number == 1) {
      return message.channel.send({
        embeds: [
          client
            .embedBuilder(
              client,
              message,
              "",
              `<:ArrowRightGray:813815804768026705>It was a tie, we both had ${args[0]}`,
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }

    if (number == 2) {
      if (args[0].toLowerCase() == "rock") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>I won! I had paper.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
          ],
        });
      }

      if (args[0].toLowerCase() == "paper") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>I won! I had scissors.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
          ],
        });
      }

      if (args[0].toLowerCase() == "scissors") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>I won! I had rock.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
          ],
        });
      }
    }

    if (number == 0) {
      if (args[0].toLowerCase() == "rock") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>You won, I had scissors.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
          ],
        });
      }

      if (args[0].toLowerCase() == "paper") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>You won, I had rock.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
          ],
        });
      }

      if (args[0].toLowerCase() == "scissors") {
        return message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                "<:ArrowRightGray:813815804768026705>You won, I had paper.",
                "#ec3d93"
              )
              .setAuthor({
                name: "Rock Paper Scissors",
                iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
              }),
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


module.exports.slashRun = async (client, interaction) => {
  const option = interaction.options.getString("choice");
  let number = Math.floor(Math.random() * 3);

  if (number == 1) {
    return interaction.reply({
      embeds: [
        client
          .embedBuilder(
            client,
            interaction,
            "",
            `<:ArrowRightGray:813815804768026705>It was a tie, we both had ${option}`,
            "#ec3d93"
          )
          .setAuthor({
            name: "Rock Paper Scissors",
            iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
          }),
      ],
    });
  }

  if (number == 2) {
    if (option == "rock") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>I won! I had paper.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }

    if (option == "paper") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>I won! I had scissors.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }

    if (option == "scissors") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>I won! I had rock.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }
  }

  if (number == 0) {
    if (option == "rock") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>You won, I had scissors.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }

    if (option == "paper") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>You won, I had rock.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }

    if (option == "scissors") {
      return interaction.reply({
        embeds: [
          client
            .embedBuilder(
              client,
              interaction,
              "",
              "<:ArrowRightGray:813815804768026705>You won, I had paper.",
              "#ec3d93"
            )
            .setAuthor({
              name: "Rock Paper Scissors",
              iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
            }),
        ],
      });
    }
  }
};