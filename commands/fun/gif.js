const { load } = require("cheerio");
const fetch = require("node-fetch");

module.exports = {
  name: "gif",
  category: "fun",
  description: "Search online for a random gif.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "gif <search>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter something to search for!"
        ),
      ],
    });

  const body = await fetch(
    `https://tenor.com/search/${args.join("-")}-gifs`
  ).then((r) => r.text());
  let data = load(body)("div.Gif > img");
  let urls = new Array(data.length)
    .fill(0)
    .map((s, i) => data.eq(i).attr("src"));

  if (!urls[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "No search results found, did you check your spelling?"
        ),
      ],
    });

  let embed = client
    .embedBuilder(
      client,
      message,
      "",
      `<:ArrowRightGray:813815804768026705>Image not loading? click [here](${urls[0]}).`,
      "#ec3d93"
    )
    .setImage(urls[0])
    .setFooter(`Pages 1/${urls.length}`)
    .setAuthor("GIF", `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`);

  message.channel.send({ embeds: [embed] }).then(async (emb) => {
    ["⏮️", "◀️", "▶️", "⏭️", "⏹️", "🔢"].forEach(
      async (m) => await emb.react(m)
    );

    const filter = (_, u) => u.id === message.author.id;
    let collector = emb.createReactionCollector({ filter, time: 300000 });
    let page = 1;

    collector.on("collect", async (r, user) => {
      let current = page;
      emb.reactions.cache.get(r.emoji.name).users.remove(user.id);
      if (r.emoji.name === "◀️" && page !== 1) page--;
      else if (r.emoji.name === "▶️" && page !== urls.length) page++;
      else if (r.emoji.name === "⏮️") page = 1;
      else if (r.emoji.name === "⏭️") page = urls.length;
      else if (r.emoji.name === "⏹️") return collector.stop();
      else if (r.emoji.name === "🔢") {
        let msg = await message.channel.send(
          "What page would you like to flip to?"
        );

        let filterTic = (m) => {
          return (
            m.author.id === message.author.id &&
            m.content > 0 &&
            m.content <= urls.length
          );
        };
        collector = await message.channel.awaitMessages({
          filterTic,
          max: 1,
          time: 8000,
        });

        msg.delete();

        if (
          collector.first() &&
          collector.first().content > 0 &&
          collector.first().content <= urls.length
        )
          page = collector.first().content;
      }

      embed.setDescription(
        `Image not loading? click [here](${urls[page - 1]}).`
      );

      embed.setImage(urls[page - 1]);

      if (current !== page)
        emb.edit({
          embeds: [embed.setFooter(`Pages ${page}/${urls.length}`)],
        });
    });
  });
};
