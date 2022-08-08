const { ApplicationCommandOptionType } = require("discord.js");
const Discord = require("discord.js")
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
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {};

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

  const ephemeral = client.commands.get(
    interaction.options.getBoolean("ephemeral")
  );

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

        if (
          codeValue.toLowerCase().includes("client.token") ||
          codeValue.toLowerCase().includes("token") ||
          codeValue.toLowerCase().includes("client.conf.Settings.Token")
        )
          return;
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        let embed = client
          .embedBuilder(client, interaction, "", "", "Green")
          .setAuthor({
            name: "Code Evaluation",
            iconURL: `https://cdn.upload.systems/uploads/GVd0PBIt.png`,
          })
          .addFields({
            name: "📥︲Input:",
            value: `\`\`\`js\n${
              codeValue?.length >= 1024
                ? codeValue.slice(0, 990) + "..."
                : codeValue
            }\`\`\``,
          });

        if (evaled.length >= 1024) {
          const body = {
            key: client.conf.Settings.Paste_Key,
            body: evaled,
          };

          const response = await fetch(
            "https://api.upload.systems/pastes/new",
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
            value: `\`\`\`js\n${evaled}\`\`\``,
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
