module.exports = {
  name: "darkjoke",
  category: "fun",
  description: "A very dark joke for some laughs.",
  permissions: [],
  cooldown: 0,
  aliases: ["drkjoke"],
  usage: "darkjoke",
  slash: true,
};

module.exports.run = async (client, message) => {
  let responses = [
      "Give a man a match, and he'll be warm for a few hours. Set a man on fire, and he will be warm for the rest of his life.",
      "My wife and I have reached the difficult decision that we do not want children. If anybody does, please just send me your contact details and we can drop them off tomorrow.",
      "What do you give an armless child for Christmas?\nNothing, he wouldn’t be able to open it anyways.",
      "I took away my ex-girlfriend’s wheelchair.\nGuess who came crawling back to me?",
      "When does a joke become a dad joke?\nWhen it leaves and never comes back.",
      "Can orphans eat at a family restaurant?",
      "A man went into a library and asked for a book on how to commit suicide. The librarian said: “Fuck off, you won’t bring it back.”",
      "My grandma with alzheimer's used to tell us a joke.\nShe’d say “Knock knock”, we’d say “Who’s there?”\nThen she’d say “I can’t remember”… and start to cry.",
      "Why can’t orphans play baseball?\nThey don’t know where home is.",
      "Where did Suzy go after getting lost on a minefield?\nEVERYWHERE!",
      "I’ve been looking for my ex girlfriend’s killer for the past two years. But no one would do it.",
      "What was Steven Hawking’s last words?\nThe windows xp log out sound",
      "When you hit a speed bump in a school zone and remember, there are no speed bumps.",
      "Two kids were beating up a kid in an ally, so I stepped into help. He didn’t stand a chance against the three of us.",
      "My ex got into a bad accident recently. I told the doctors the wrong blood type. Now she will really know what rejection feels like",
      "When Jim was playing on his phone, my grandfather told him, “You use way too much technology!”. Jim then said, “No, YOU use too much technology!” and then Jim disconnected his grandfather’s life support.",
      "I will always remember my grandpa’s last words: Stop shaking the ladder you cunt!",
      "Would you like to try African food??\nThey would too.",
      "Kids in the backseat make accidents and accidents in the back seat make kids.",
      "What do you do when you finish a magazine at a hospital? Reload and keep shooting.",
      "How do you throw a surprise party at a hospital?\nBring a strobe light into the epilepsy ward.",
    ],
    response = responses[Math.floor(Math.random() * responses.length)];

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", `${response}`, "#ec3d93")
        .setAuthor({
          name: "Dark Joke",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let responses = [
      "Give a man a match, and he'll be warm for a few hours. Set a man on fire, and he will be warm for the rest of his life.",
      "My wife and I have reached the difficult decision that we do not want children. If anybody does, please just send me your contact details and we can drop them off tomorrow.",
      "What do you give an armless child for Christmas?\nNothing, he wouldn’t be able to open it anyways.",
      "I took away my ex-girlfriend’s wheelchair.\nGuess who came crawling back to me?",
      "When does a joke become a dad joke?\nWhen it leaves and never comes back.",
      "Can orphans eat at a family restaurant?",
      "A man went into a library and asked for a book on how to commit suicide. The librarian said: “Fuck off, you won’t bring it back.”",
      "My grandma with alzheimer's used to tell us a joke.\nShe’d say “Knock knock”, we’d say “Who’s there?”\nThen she’d say “I can’t remember”… and start to cry.",
      "Why can’t orphans play baseball?\nThey don’t know where home is.",
      "Where did Suzy go after getting lost on a minefield?\nEVERYWHERE!",
      "I’ve been looking for my ex girlfriend’s killer for the past two years. But no one would do it.",
      "What was Steven Hawking’s last words?\nThe windows xp log out sound",
      "When you hit a speed bump in a school zone and remember, there are no speed bumps.",
      "Two kids were beating up a kid in an ally, so I stepped into help. He didn’t stand a chance against the three of us.",
      "My ex got into a bad accident recently. I told the doctors the wrong blood type. Now she will really know what rejection feels like",
      "When Jim was playing on his phone, my grandfather told him, “You use way too much technology!”. Jim then said, “No, YOU use too much technology!” and then Jim disconnected his grandfather’s life support.",
      "I will always remember my grandpa’s last words: Stop shaking the ladder you cunt!",
      "Would you like to try African food??\nThey would too.",
      "Kids in the backseat make accidents and accidents in the back seat make kids.",
      "What do you do when you finish a magazine at a hospital? Reload and keep shooting.",
      "How do you throw a surprise party at a hospital?\nBring a strobe light into the epilepsy ward.",
    ],
    response = responses[Math.floor(Math.random() * responses.length)];

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", `${response}`, "#ec3d93")
        .setAuthor({
          name: "Dark Joke",
          iconURL: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
        }),
    ],
  });
};
