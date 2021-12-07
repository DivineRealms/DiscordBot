const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "eval",
  category: "owner",
  description:
    "Lets you run some javascript via discord. (DANGEROUS | ONLY USE IF YOU KNOW WHAT YOU'RE DOING!)",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "eval <code>",
};

module.exports.run = async (client, message, args) => {
  if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id))
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          `You're not Owner`,
          "error"
        ),
      ],
    });

  const code = args.join(" ");
  if (!code)
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          `You need to enter code to evaluate`,
          "error"
        ),
      ],
    });
  try {
    let evaled = eval(code);

    if (
      message.content.toLowerCase().includes("client.token") ||
      message.content.toLowerCase().includes("token") ||
      message.content.toLowerCase().includes("client.conf.settings.token")
    )
      return;
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    let embed = client
      .embedBuilder(client, message, "Eval", "", "GREEN")
      .addField("Input", `\`\`\`${code}\`\`\``);

    if (evaled.length >= 1024) {
      const { key } = await fetch(
        "https://www.toptal.com/developers/hastebin/documents",
        {
          method: "POST",
          body: evaled,
        }
      ).then((res) => res.json());
      embed.addField(
        "Output",
        `\`\`\`xl\nhttps://www.toptal.com/developers/hastebin/raw/${key}\`\`\``
      );
    } else {
      embed.addField("Output", `\`\`\`xl\n${evaled}\`\`\``);
    }

    message.channel.send({ embeds: [embed] });
  } catch (err) {
    let embed = client
      .embedBuilder(client, message, "", "error")
      .addField("Input", `\`\`\`xl\n${code}\`\`\``)
      .addField("Output", `\`\`\`xl\n${err}\`\`\``);

    message.channel.send({ embeds: [embed] });
  }
};
