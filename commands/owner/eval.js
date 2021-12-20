const Discord = require("discord.js");
const { result } = require("lodash");
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
  if (!client.conf.Settings.Owner_Discord_ID.includes(message.author.id))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Only Developers can use this command."
        ),
      ],
    });

  const code = args.join(" ");
  if (!code)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter code to evaluate."
        ),
      ],
    });
  try {
    let evaled = eval(code);

    if (
      message.content.toLowerCase().includes("client.token") ||
      message.content.toLowerCase().includes("token") ||
      message.content.toLowerCase().includes("client.conf.Settings.Token")
    )
      return;
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    let embed = client
      .embedBuilder(client, message, "", "", "GREEN")
      .setAuthor(
        "Code Evaluation",
        `https://cdn.upload.systems/uploads/GVd0PBIt.png`
      )
      .addField("📥︲Input:", `\`\`\`${code}\`\`\``);

    if (evaled.length >= 1024) {
      const body = {
        key: client.conf.Settings.Paste_Key,
        body: evaled,
      };

      const response = await fetch("https://api.upload.systems/pastes/new", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log(err));

      const json = await response.json();

      embed.addField(
        "📤︲Output:",
        `\`\`\`xl\nhttps://api.upload.systems/pastes/${json.paste.id}/raw\`\`\``
      );
    } else embed.addField("📤︲Output", `\`\`\`xl\n${evaled}\`\`\``);

    message.channel.send({ embeds: [embed] });
  } catch (err) {
    message.channel.send({
      embeds: [
        client.utils
          .errorEmbed(client, message, "Code Evaluation Failed")
          .addField("📥︲Input:", `\`\`\`xl\n${code}\`\`\``)
          .addField("📤︲Output:", `\`\`\`xl\n${err}\`\`\``),
      ],
    });
  }
};
