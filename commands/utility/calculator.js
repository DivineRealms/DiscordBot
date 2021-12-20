const { evaluate } = require("mathjs");

module.exports = {
  name: "calculator",
  category: "utility",
  description: "Does your math homework for you!",
  permissions: [],
  cooldown: 0,
  aliases: ["solve", "math"],
  usage: "calculator <Problem>",
};

module.exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Please provide a problem."),
      ],
    });

  try {
    message.channel.send({
      embeds: [
        client
          .embedBuilder(client, message, "", "")
          .setAuthor(
            "Calculator",
            `https://cdn.upload.systems/uploads/LRa9Ebl5.png`
          )
          .addField("📥︲Problem:", "```\n" + args.join(" ") + "```")
          .addField(
            "📤︲Solution:",
            "```\n" + evaluate(args.join(" ")) + "```"
          ),
      ],
    });
  } catch (e) {
    client.utils.errorEmbed(client, message, "Please provide a problem.");
  }
};
