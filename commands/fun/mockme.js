module.exports = {
  name: "mockme",
  category: "fun",
  description: "Mocks whatever you enter.",
  permissions: [],
  cooldown: 0,
  aliases: ["mock"],
  usage: "mockme <words>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return client.utils.errorEmbed(
      client,
      message,
      "You need to give me something to mock!"
    );

  message.channel.send(
    args
      .join(" ")
      .split("")
      .map((s, i) => (i % 2 ? s.toLowerCase() : s.toUpperCase()))
      .join("")
  );
};
