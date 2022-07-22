const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "8ball",
  category: "fun",
  description: "Lets you ask the magic 8 ball.",
  permissions: [],
  cooldown: 0,
  aliases: ["question", "ball8"],
  usage: "8ball <Question>",
  slash: true,
  options: [{
    name: "question",
    description: "Question you want to ask",
    type: ApplicationCommandOptionType.String,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  if (!args[1])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please specify your question."
        ),
      ],
    });

  const responses = [
    "Signs point to yes.",
    "No.",
    "Ask again later.",
    "Maybe.",
    "Possibly",
    "I really dont want to answer.",
    "Stop using me.",
    "I have to help users, no time to answer dumb questions.",
    "Yes",
    "If i answer your question, will you stop bothering me?",
    "Sorry, have to go! My food is ready!",
    "Dont care, didn't ask",
    "I wont tell a lie for you.",
    "In the shower, everytime you use me it stops my music so stop.",
  ];

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#ec3d93")
        .addFields([{ name: "Question:", value: args.join(" "), inline: false }, {
          name: "Answer:",
          value: responses[~~(Math.random() * responses.length)],
          inline: false
        }])
        .setAuthor({
          name: "8ball",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const question = interaction.options.getString("question");

  const responses = [
    "Signs point to yes.",
    "No.",
    "Ask again later.",
    "Maybe.",
    "Possibly",
    "I really dont want to answer.",
    "Stop using me.",
    "I have to help users, no time to answer dumb questions.",
    "Yes",
    "If i answer your question, will you stop bothering me?",
    "Sorry, have to go! My food is ready!",
    "Dont care, didn't ask",
    "I wont tell a lie for you.",
    "In the shower, everytime you use me it stops my music so stop.",
  ];

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#ec3d93")
        .addFields([{ name: "Question:", value: question, inline: false }, {
          name: "Answer:",
          value: responses[~~(Math.random() * responses.length)],
          inline: false
        }])
        .setAuthor({
          name: "8ball",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
