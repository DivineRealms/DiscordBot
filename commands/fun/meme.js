const { sample } = require("lodash");
const fetch = require("node-fetch");

module.exports = {
  name: "meme",
  category: "fun",
  description: "View a random meme.",
  permissions: [],
  cooldown: 0,
  aliases: ["pic"],
  usage: "meme",
  slash: true
};

module.exports.run = async (client, message, args) => {
  const subReddits = ["meme", "me_irl", "dankmemes", "memes"],
    list = await fetch(
      `https://www.reddit.com/r/${sample(subReddits)}/new/.json`
    ).then((r) => r.json()),
    item = sample(
      list.data.children.filter((s) =>
        ["gif", "png", "jpg", "jpeg"].some((e) => s.data.url.endsWith(e))
      )
    );

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#ec3d93")
        .setURL(`http://reddit.com/${item.permalink}`)
        .setImage(item.data.url)
        .setAuthor({
          name: "Random Reddit Meme",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const subReddits = ["meme", "me_irl", "dankmemes", "memes"],
    list = await fetch(
      `https://www.reddit.com/r/${sample(subReddits)}/new/.json`
    ).then((r) => r.json()),
    item = sample(
      list.data.children.filter((s) =>
        ["gif", "png", "jpg", "jpeg"].some((e) => s.data.url.endsWith(e))
      )
    );

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#ec3d93")
        .setURL(`http://reddit.com/${item.permalink}`)
        .setImage(item.data.url)
        .setAuthor({
          name: "Random Reddit Meme",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
