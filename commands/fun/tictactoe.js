const ttt = require("tic-tac-toe-stateless-engine");
const requests = new Map(),
  games = new Map();
const { chunk } = require("lodash");

module.exports = {
  name: "tictactoe",
  category: "fun",
  description: "Play a game of tic-tac-toe with a friend.",
  permissions: [],
  cooldown: 0,
  aliases: ["ttt"],
  usage: "tictactoe <user>",
};

module.exports.run = async (client, message, args, cmd) => {
  if (args[0] == "leave" && games.get(message.guild.id + message.author.id))
    return games.delete(message.guild.id + message.author.id);

  if (games.get(message.guild.id + message.author.id))
    return client.utils
      .errorEmbed(`You are already playing a game of tic-tac-toe.`)
      .setDescription(
        `<:ArrowRightGray:813815804768026705>Leave the game by using **\`${
          message.px + cmd
        } leave\`**.`
      );

  if (
    !message.mentions.users.first() ||
    message.mentions.users.first().id == message.author.id ||
    message.mentions.users.first().bot
  )
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          "Please mention a valid person you want to play against."
        ),
      ],
    });

  if (games.get(message.guild.id + message.mentions.users.first().id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          "That user is already playing a game of tic-tac-toe."
        ),
      ],
    });

  if (requests.get(message.guild.id + message.mentions.users.first().id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          "That user is already requesting to play with someone else!"
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
    `<:ArrowRightGray:813815804768026705>${
      message.mentions.users.first().username
    }, Do you wish to play tic-tac-toe with ${message.author.username}?`
  );

  let filter1 = (m) =>
      m.content.toLowerCase().includes("yes") &&
      m.author.id == message.mentions.users.first().id,
    msg = await message.channel.awaitMessages({ filter1,
      max: 1,
      time: 8000,
    });

  if (!msg.first())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed("Looks like they didnt say yes in time.."),
      ],
    });

  games.set(message.guild.id + message.mentions.users.first().id, true);
  games.set(message.guild.id + message.author.id, true);

  let board = new Array(9).fill(null);

  let embed = client
    .embedBuilder(
      client,
      message,
      "",
      `<:ArrowRightGray:813815804768026705>:one:┃:two:┃:three:
<:ArrowRightGray:813815804768026705>─────────
<:ArrowRightGray:813815804768026705>:four:┃:five:┃:six:
<:ArrowRightGray:813815804768026705>─────────
<:ArrowRightGray:813815804768026705>:seven:┃:eight:┃:nine:`,
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
        m.content < 10,
      collector = message.channel.createMessageCollector({
        filter,
        time: 30000,
      });

    collector.on("collect", (m) => {
      if (
        !games.get(message.guild.id + message.author.id) ||
        !games.get(message.guild.id + message.mentions.users.first().id)
      )
        return;
      if (!ttt.squareCanBeSet(board, m.content - 1)) return;
      if (currentPlayer !== message.author.id)
        currentPlayer = message.author.id;
      else currentPlayer = message.mentions.users.first().id;

      board = ttt.setSquare(board, m.content - 1);
      setBoard(
        embed,
        board,
        m.content - 1,
        ttt.xIsNext(board) ? "O" : "X",
        message
      );

      emb.edit({ embeds: [embed] });

      m.delete();

      collector.resetTimer({ time: 30000 });

      if (ttt.getWinner(board) || ttt.allSquaresSet(board)) collector.stop();
    });

    collector.on("end", () => {
      if (
        !games.get(message.guild.id + message.author.id) ||
        !games.get(message.guild.id + message.mentions.users.first().id)
      )
        return;
      if (!ttt.getWinner(board) && ttt.allSquaresSet(board))
        embed.setAuthor(
          "Looks like nobody won, It's a tie!",
          `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
        );
      else if (!ttt.getWinner(board))
        embed.setAuthor(
          "Time's Up! Looks like nobody won!",
          `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`
        );

      emb.edit({ embeds: [embed] });

      games.delete(message.guild.id + message.author.id);
      games.delete(message.guild.id + message.mentions.users.first().id);
    });
  });
};

const setBoard = (embed, board, i, pl, message) => {
  const winnerOfSet = (a, b, c) =>
    board[a] === board[b] && board[a] === board[c] && board[a];
  let choices = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
  ];
  let win = [":negative_squared_cross_mark:", ":green_circle:"];
  let player = [":x:", ":o2:"];
  let winner = [];
  let valid = new Map([
    ["012"],
    ["345"],
    ["678"],
    ["036"],
    ["147"],
    ["258"],
    ["048"],
    ["246"],
  ]);

  for (let a = 0; a < 9; a++)
    for (let b = 0; b < 9; b++)
      for (let c = 0; c < 9; c++)
        if (
          winnerOfSet(a, b, c) &&
          valid.has(`${c}${b}${a}`) &&
          ttt.getWinner(board) &&
          new Set([a, b, c]).size > 2
        )
          winner = [winnerOfSet(a, b, c), a, b, c];

  if (!winner.length)
    embed.description = embed.description.replace(
      choices[i],
      player[pl === "X" ? 0 : 1]
    );
  else {
    embed.author.name = `${
      ttt.getWinner(board) == "X"
        ? message.author.tag
        : message.mentions.users.first().tag
    } has won the match!`;

    board[winner[1]] = win[pl == "X" ? 0 : 1];
    board[winner[2]] = win[pl == "X" ? 0 : 1];
    board[winner[3]] = win[pl == "X" ? 0 : 1];

    embed.description = updateBoard(board);
  }
};

const updateBoard = (board) => {
  let choices = [
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
  ];

  for (let i in board) if (!board[i]) board[i] = choices[i];

  return chunk(board, 3)
    .join(" ")
    .replace(/ /g, "\n─────────\n")
    .replace(/,/g, "┃")
    .replace(/O/g, ":o2:")
    .replace(/X/g, ":x:");
};
