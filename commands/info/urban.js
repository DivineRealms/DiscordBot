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
        .setAuthor({
          name: args[0],
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
          url: def.urbanURL,
        })
        .addFields([{ name: `Definition`, value: `${def.definition}`.slice(0, 1000), inline: false },
        {
          name: `Definition in an example:`,
          value: `${def.example || "none"}`.slice(0, 1000),
          inline: false
        },{
          name: `Author:`,
          value: "<:ArrowRightGray:813815804768026705>" + def.author,
          inline: false
        }])
    ],
  });
};
