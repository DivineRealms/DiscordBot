const figlet = require("figlet");

module.exports = {
  name: "ascii",
  category: "fun",
  description: "Lets you turn text into ascii art.",
  permissions: [],
  cooldown: 0,
  aliases: [`cooltext`],
  usage: "ascii <text>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return client.utils.errorEmbed(client, message, "Please provide some text.");

  figlet.text(args.join(" "), (err, data) => {
    if (err) return;
    if (data.length > 2000)
      return client.utils.errorEmbed(client, message, "Max 2000 charachters.");

    message.channel.send("```\n" + data + "```");
  });
};
