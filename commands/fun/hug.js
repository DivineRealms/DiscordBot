const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "hug",
  category: "fun",
  description: "Feel Lonely? Give someone a hug.",
  permissions: [],
  cooldown: 0,
  aliases: ["hugs", "cuddles"],
  usage: "hug <@User>",
  slash: true,
  options: [{
    name: "user",
    description: "User which you want to hug",
    type: ApplicationCommandOptionType.User,
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  const mentionedMember = message.mentions.members.first();

  if (!args[0]) {
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to mention who you would like to hug!"
        ),
      ],
    });
  } else {
    const gifs = [
        "https://media.giphy.com/media/bbxTrFmeoM7aU/giphy.gif",
        "https://media.giphy.com/media/SEQrz1SMPl3mo/giphy.gif",
        "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
        "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
      ],
      randomNumber = Math.floor(Math.random() * gifs.length),
      randomGif = gifs[randomNumber];

    if (mentionedMember.user.id === message.author.id)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(client, message, "You cannot hug yourself."),
        ],
      });

    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "", "#ec3d93")
          .setImage(randomGif)
          .setAuthor({
            name: `${message.author.username} just hugged ${mentionedMember.user.username}!`,
            iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
          }),
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  const mentionedMember = interaction.options.getUser("user");

  const gifs = [
    "https://media.giphy.com/media/bbxTrFmeoM7aU/giphy.gif",
    "https://media.giphy.com/media/SEQrz1SMPl3mo/giphy.gif",
    "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
    "https://media.giphy.com/media/1o1ik0za0oj0461zPR/giphy.gif",
  ],
  randomNumber = Math.floor(Math.random() * gifs.length),
  randomGif = gifs[randomNumber];

  if (mentionedMember.id === interaction.user.id)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot hug yourself."),
      ],
    });

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#ec3d93")
        .setImage(randomGif)
        .setAuthor({
          name: `${interaction.user.username} just hugged ${mentionedMember.username}!`,
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};