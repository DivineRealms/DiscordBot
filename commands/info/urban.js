const fetch = require("node-fetch");
const urban = require(`relevant-urban`);

module.exports = {
  name: "urban",
  category: "info",
  description: "Lets you search whatever you want on urban dictionary.",
  permissions: [],
  cooldown: 0,
  aliases: ["ud"],
  usage: "urban <search>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter a term to search for."
        ),
      ],
    });

  let def = await urban(args[0]).catch(() => {});

  if (!def)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `No Results found for ${args[0]}.`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#60b8ff")
        .setAuthor(
          args[0],
          `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
          def.urbanURL
        )
        .addField(`Definition`, `${def.definition}`.slice(0, 1000), false)
        .addField(
          `Definition in an example:`,
          `${def.example || "none"}`.slice(0, 1000),
          false
        )
        .addField(
          `Author:`,
          "<:ArrowRightGray:813815804768026705>" + def.author,
          false
        ),
    ],
  });
};
