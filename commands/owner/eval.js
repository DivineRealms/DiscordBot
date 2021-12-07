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
    return client.utils.errorEmbed(
      client,
      message,
      "Only Developers can use this command."
    );

  const code = args.join(" ");
  if (!code)
    return client.utils.errorEmbed(
      client,
      message,
      "You need to enter code to evaluate."
    );
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
      .embedBuilder(client, message, "", "", "GREEN")
      .setAuthor(
        "Code Evaluation",
        `https://cdn.upload.systems/uploads/7GXLEDHZ.png`
      )
      .addField("📥︲Input:", `\`\`\`${code}\`\`\``);

    if (evaled.length >= 1024) {
      const { key } = await fetch(
        "https://www.toptal.com/developers/hastebin/documents",
        {
          method: "POST",
          body: evaled,
        }
      ).then((res) => res.json());
      
      embed.addField(
        "📤︲Output:",
        `\`\`\`xl\nhttps://www.toptal.com/developers/hastebin/raw/${key}\`\`\``
      );
    } else embed.addField("📤︲Output", `\`\`\`xl\n${evaled}\`\`\``);

    message.channel.send({ embeds: [embed] });
  } catch (err) {
    client.utils
      .errorEmbed(client, message, "Code Evaluation Failed")
      .addField("📥︲Input:", `\`\`\`xl\n${code}\`\`\``)
      .addField("📤︲Output:", `\`\`\`xl\n${err}\`\`\``);
  }
};
