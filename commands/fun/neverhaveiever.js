const fetch = require("node-fetch");
const { load } = require("cheerio");

module.exports = {
  name: "neverhaveiever",
  category: "fun",
  description: "Get asked never have I ever questions.",
  permissions: [],
  cooldown: 0,
  aliases: ["nvhie"],
  usage: "neverhaveiever",
};

module.exports.run = async (client, message, args) => {
  const page = await fetch(
    "https://randomwordgenerator.com/never-have-i-ever-question.php"
  ).then((r) => r.text());

  let nhie = load(page)(".support-sentence").text();

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705>${nhie.slice(13, nhie.length)}`,
          "#ec3d93"
        )
        .setAuthor({
          name: "Never have I ever",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
