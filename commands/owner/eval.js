const { ApplicationCommandOptionType } = require("discord.js");
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
  options: [
    {
      name: "ephemeral",
      description: "Should the output be shown only to you?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],
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

    const cleaned = await clean(client, evaled);

    let embed = client
      .embedBuilder(client, message, "", "", "Green")
      .setAuthor({
        name: "Code Evaluation",
        iconURL: `https://cdn.upload.systems/uploads/GVd0PBIt.png`,
      })
      .addFields({ name: "📥︲Input:", value: `\`\`\`js\n${cleaned}\`\`\`` });

    if (cleaned.length >= 1024) {
      const body = {
        key: client.conf.Settings.Paste_Key,
        body: cleaned,
      };

      const response = await fetch("https://api.upload.systems/pastes", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).catch((err) => console.log(err));

      const json = await response.json();

      embed.addFields(
        "📤︲Output:",
        `\`\`\`xl\nhttps://api.upload.systems/pastes/${json.paste.id}/raw\`\`\``
      );
    } else embed.addFields({ name: "📤︲Output", value: `\`\`\`js\n${cleaned}\`\`\`` });

    message.channel.send({ embeds: [embed] });
  } catch (err) {
    message.channel.send({
      embeds: [
        client.utils
          .errorEmbed(client, message, "Code Evaluation Failed")
          .addFields([{ name: "📥︲Input:", value: `\`\`\`js\n${code}\`\`\`` }, { name: "📤︲Output:", value: `\`\`\`xl\n${err}\`\`\`` }])
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
      ephemeral: true,
    });

  const ephemeral = interaction.options.getBoolean("ephemeral");

  let codeInput = new Discord.ActionRowBuilder().addComponents(
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

  interaction.showModal(suggModal);
  const filter = (i) =>
    i.customId == "eval_modal" && i.user.id == interaction.user.id;
  interaction
    .awaitModalSubmit({ filter, time: 120_000 })
    .then(async (md) => {
      let codeValue = md.fields.getTextInputValue("code_input");
      try {
        let evaled = eval(codeValue);

        const cleaned = await clean(client, evaled);

        let embed = client
          .embedBuilder(client, interaction, "", "", "Green")
          .setAuthor({
            name: "Code Evaluation",
            iconURL: `https://cdn.upload.systems/uploads/GVd0PBIt.png`,
          })
          .addFields({
            name: "📥︲Input:",
            value: `\`\`\`js\n${
              cleaned?.length >= 1024
                ? cleaned.slice(0, 990) + "..."
                : cleaned
            }\`\`\``,
          });

        if (evaled.length >= 1024) {
          const body = {
            key: client.conf.Settings.Paste_Key,
            body: evaled,
          };

          const response = await fetch(
            "https://api.upload.systems/pastes",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: { "Content-Type": "application/json" },
            }
          ).catch((err) => console.log(err));

          const json = await response.json();

          embed.addFields({
            name: "📤︲Output:",
            value: `\`\`\`xl\nhttps://api.upload.systems/pastes/${json.paste.id}/raw\`\`\``,
          });
        } else
          embed.addFields({
            name: "📤︲Output",
            value: `\`\`\`js\n${cleaned}\`\`\``,
          });

        if (ephemeral) md.reply({ embeds: [embed], ephemeral: true });
        else md.reply({ embeds: [embed] });
      } catch (err) {
        console.log(err);
        if (ephemeral)
          md.reply({
            embeds: [
              client.utils
                .errorEmbed(client, interaction, "Code Evaluation Failed")
                .addFields([
                  { name: "📥︲Input:", value: `\`\`\`js\n${codeValue}\`\`\`` },
                  { name: "📤︲Output:", value: `\`\`\`js\n${err}\`\`\`` },
                ]),
            ],
            ephemeral: true,
          });
        else
          md.reply({
            embeds: [
              client.utils
                .errorEmbed(client, interaction, "Code Evaluation Failed")
                .addFields([
                  { name: "📥︲Input:", value: `\`\`\`js\n${codeValue}\`\`\`` },
                  { name: "📤︲Output:", value: `\`\`\`js\n${err}\`\`\`` },
                ]),
            ],
          });
      }
    })
    .catch((e) => console.log(e));
};

const clean = async (client, text) => {
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });
  
  text = text.replaceAll(client.token, "[RETARDED]");
  
  return text;
}