const fetch = require("node-fetch");

module.exports = {
  name: "advice",
  category: "fun",
  description: "Gives you an advice.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "advice",
};

module.exports.run = async (client, message, args) => {
  const res = await fetch("http://api.adviceslip.com/advice").then((r) =>
    r.json()
  );
  
  message.channel.send({
    embeds: [client.embedBuilder(client, message, "Advice", res.slip.advice)],
  });
};
