const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "suggest",
  category: "utility",
  description: "Lets you submit a suggestion.",
  permissions: [],
  cooldown: 0,
  aliases: [`sug`],
  usage: "suggest <Suggestion>",
};

module.exports.run = async (client, message, args) => {
  let channel = client.channels.cache.get(client.conf.Logging.Suggestions);

  if (!channel)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "The suggestions channel hasn't been setup for this server."
        ),
      ],
    });

  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please provide a suggestion."
        ),
      ],
    });

  setTimeout(() => message.delete(), 3000);
  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: "Your suggestion has been submitted successfully.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        }),
    ],
  });

  const msg = await channel.send({
    embeds: [
      client.embedBuilder(client, message, "Suggestion", `${args.join(" ")}`),
    ],
  });

  await msg.react("👍");
  await msg.react("👎");

  await db.set(`suggestion_${msg.id}`, {
    user: message.author,
    suggestion: args.join(" "),
  });
};
