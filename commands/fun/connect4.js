const { Connect4, Player } = require("connect4-engine");
const requests = new Map(),
  games = new Map();

module.exports = {
  name: "connect4",
  category: "fun",
  description: "Play a game of connect4 with a friend.",
  permissions: [],
  cooldown: 0,
  aliases: ["c4"],
  usage: "connect4 <user | leave>",
};

module.exports.run = async (client, message, args, cmd) => {
  if (args[0] == "leave" && games.get(message.guild.id + message.author.id))
    return games.delete(message.guild.id + message.author.id);

  if (games.get(message.guild.id + message.author.id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You're already playing against someone.",
          `<:ArrowRightGray:813815804768026705>Leave the game using ${
            message.px + "" + cmd
          } leave.`
        ),
      ],
    });

  if (
    !message.mentions.users.first() ||
    message.mentions.users.first().id == message.author.id ||
    message.mentions.users.first().bot
  )
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to mention a valid user."
        ),
      ],
    });

  if (games.get(message.guild.id + message.mentions.users.first().id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "They're already playing."
        ),
      ],
    });

  if (requests.get(message.guild.id + message.mentions.users.first().id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "They've already sent request to someone else."
        ),
      ],
    });

  requests.set(message.guild.id + message.author.id, true);
  requests.set(message.guild.id + message.mentions.users.first().id, true);

  setTimeout(() => {
    requests.delete(message.guild.id + message.mentions.users.first().id);
    requests.delete(message.guild.id + message.author.id);
  }, 10000);

  message.channel.send(
    `${
      message.mentions.users.first().username
    }, do you wish to play connect 4 with ${message.author.username}?`
  );

  let filter1 = (response) =>
    response.content.toLowerCase().includes("yes") &&
    response.author == message.mentions.users.first();

  message.channel
    .awaitMessages({ filter1, max: 1, time: 8000 })
    .then((collected) => {
      if (!collected.first())
        return message.channel.send({
          embeds: [
            client.utils.errorEmbed(
              client,
              message,
              "They didn't confirm in time."
            ),
          ],
        });

      games.set(message.guild.id + message.mentions.users.first().id, true);
      games.set(message.guild.id + message.author.id, true);

      const game = new Connect4([
          new Player(":orange_circle:"),
          new Player(":red_circle:"),
        ]);
      let currentPlayer = message.author.id;

      let embed = client
        .embedBuilder(
          client,
          message,
          "",
          board(game).join("\n").replace(/,/g, ""),
          "#ec3d93"
        )
        .setAuthor(
          `${message.author.username} vs. ${
            message.mentions.users.first().username
          }`,
          `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
        );

      message.channel.send({ embeds: [embed] }).then((emb) => {
        let filter = (m) =>
          m.author.id == currentPlayer &&
          !isNaN(m.content) &&
          m.content > 0 &&
          m.content < 8;

        let collector = message.channel.createMessageCollector({
          filter,
          time: 30000,
        });

        collector.on("collect", (m) => {
          if (
            !games.get(message.guild.id + message.author.id) ||
            !games.get(message.guild.id + message.mentions.users.first().id)
          )
            return;

          if (currentPlayer == message.author.id)
            currentPlayer = message.mentions.users.first().id;
          else currentPlayer = message.author.id;

          game.insert(m.content - 1);

          emb.edit({
            embeds: [
              embed.setDescription(board(game).join("\n").replace(/,/g, "")),
            ],
          });

          m.delete();

          collector.resetTimer({ time: 30000 });

          if (game.state.winner !== null || game.state.status == "1")
            collector.stop();
        });

        collector.on("end", () => {
          if (
            !games.get(message.guild.id + message.author.id) ||
            !games.get(message.guild.id + message.mentions.users.first().id)
          )
            return;

          if (game.state.status == "0")
            embed.setAuthor(
              `The winner is ${
                game.state.winner.color == game.players["0"].color
                  ? message.author.username
                  : message.mentions.users.first().username
              }!`,
              `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
            );
          else if (game.state.status == "1")
            embed.setAuthor(
              `Looks like you tied!`,
              `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
            );
          else
            client.utils.errorEmbed(
              client,
              message,
              "Time Limit has reached and there's no winners."
            );

          emb.edit({ embeds: [embed] });

          games.delete(message.guild.id + message.author.id);
          games.delete(message.guild.id + message.mentions.users.first().id);
        });
      });
    });
};

let board = (game) => {
  let arr = [],
    newarr = [];

  for (let i in game.state.board) {
    if (game.state.board[i] != null) arr.push(game.state.board[i].color);
    else arr.push(":black_circle:");
  }

  while (arr.length) newarr.push(arr.splice(0, 7));

  newarr.push([
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
  ]);

  return newarr;
};
