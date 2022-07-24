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
  slash: true,
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
      .embedBuilder(client, message, "", "", "Green")
      .setAuthor({
        name: "Code Evaluation",
        iconURL: `https://cdn.upload.systems/uploads/GVd0PBIt.png`,
      })
      .addFields({ name: "📥︲Input:", value: `\`\`\`${code}\`\`\`` });

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

      embed.addFields(
        "📤︲Output:",
        `\`\`\`xl\nhttps://api.upload.systems/pastes/${json.paste.id}/raw\`\`\``
      );
    } else embed.addFields({ name: "📤︲Output", value: `\`\`\`xl\n${evaled}\`\`\`` });

    message.channel.send({ embeds: [embed] });
  } catch (err) {
    message.channel.send({
      embeds: [
        client.utils
          .errorEmbed(client, message, "Code Evaluation Failed")
          .addFields([{ name: "📥︲Input:", value: `\`\`\`xl\n${code}\`\`\`` }, { name: "📤︲Output:", value: `\`\`\`xl\n${err}\`\`\`` }])
      ],
    });
  }
};

module.exports.slashRun = async (client, interaction) => {
  if (!client.conf.Settings.Owner_Discord_ID.includes(interaction.user.id))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Only Developers can use this command."
        ),
      ],
    });

    let codeInput = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.TextInputBuilder()
          .setCustomId("code_input")
          .setLabel("Enter JS Code")
          .setPlaceholder("Enter code you want to be run")
          .setRequired(true)
          .setStyle(Discord.TextInputStyle.Paragraph)
      );
    
    let suggModal = new Discord.ModalBuilder()
      .setTitle("Evaluate Code")
      .setCustomId("eval_modal")
      .addComponents(codeInput);

    interaction.showModal(suggModal)
    const filter = (i) => i.customId == 'eval_modal' && i.user.id == interaction.user.id;
    interaction.awaitModalSubmit({ filter, time: 120_000 })
      .then(async(md) => {
      let codeValue = md.fields.getTextInputValue("code_input");
      try {
        let evaled = eval(codeValue);
    
        if (
          codeValue.toLowerCase().includes("client.token") ||
          codeValue.toLowerCase().includes("token") ||
          codeValue.toLowerCase().includes("client.conf.Settings.Token")
        )
          return;
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    
        let embed = client
          .embedBuilder(client, interaction, "", "", "Green")
          .setAuthor({
            name: "Code Evaluation",
            iconURL: `https://cdn.upload.systems/uploads/GVd0PBIt.png`,
          })
          .addFields({ name: "📥︲Input:", value: `\`\`\`${codeValue}\`\`\`` });
    
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
    
          embed.addFields(
            "📤︲Output:",
            `\`\`\`xl\nhttps://api.upload.systems/pastes/${json.paste.id}/raw\`\`\``
          );
        } else embed.addFields({ name: "📤︲Output", value: `\`\`\`xl\n${evaled}\`\`\`` });
    
        md.reply({ embeds: [embed] });
      } catch (err) {
        console.log(err)
        md.reply({
          embeds: [
            client.utils
              .errorEmbed(client, interaction, "Code Evaluation Failed")
              .addFields([{ name: "📥︲Input:", value: `\`\`\`xl\n${codeValue}\`\`\`` }, { name: "📤︲Output:", value: `\`\`\`xl\n${err}\`\`\`` }])
          ]
        });
      }
    }).catch((e) => console.log(e));
};
