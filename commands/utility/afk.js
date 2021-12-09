module.exports = {
  name: "afk",
  category: "utility",
  description: "Sets your status to afk so people know.",
  permissions: [],
  cooldown: 0,
  aliases: [`brb`],
  usage: "afk <Reason>",
};

module.exports.run = async (client, message, args) => {
  client.afk.set(message.author.id, {
    time: Date.now(),
    message: args.join(" ") || "AFK",
  });

  message.member
    .setNickname(
      `[AFK] ${message.member.displayName.replace(/(\[AFK\])/g, "")}`
    )
    .catch(() => {});

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#7bc2cc")
        .setAuthor(
          `I have set your AFK status to ${args[0] ? args.join(" ") : "AFK"}`,
          `https://cdn.upload.systems/uploads/Za4oLQsR.png`
        ),
    ],
  });
};
