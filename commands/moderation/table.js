const Pageres = require("pageres");
const {
  AttachmentBuilder,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");

module.exports = {
  name: "table",
  category: "info",
  description: "View challenge.place table for League.",
  permissions: ["ManageMessages"],
  cooldown: 0,
  aliases: [],
  usage: "table [League Name]",
  slash: true,
  options: [
    {
      name: "league",
      description: "Name of League for which to view table",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Svebalkan League",
          value: "svb",
        },
        {
          name: "FCFA Challenge League",
          value: "fcl",
        },
      ],
      required: true,
    },
  ],
};

module.exports.slashRun = async (client, interaction) => {
  const league = interaction.options.getString("league");

  if (league.toLowerCase() == "svebalkan" || league.toLowerCase() == "svb") {
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
          name: "Svebalkan League table is being uploaded...",
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
      ephemeral: true,
    });

    if (fs.existsSync(process.cwd() + "/assets/svebalkan.png"))
      await fs.unlinkSync(process.cwd() + "/assets/svebalkan.png");

    await new Pageres({
      script: `${process.cwd() + "/assets/tableScript.js"}`,
      css: `${process.cwd() + "/assets/tableStyle.css"}`,
      hide: ["ins", ".da-h-responsive", ".adsbygoogle"],
      filename: "svebalkan",
      selector: ".col-12.col-lg-7.col-xl-8.mb-3",
    })
      .src(
        "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf0094c41566e3d56d36c3",
        ["2048x1024"]
      )
      .dest(process.cwd() + "/assets")
      .run();

    const image = new AttachmentBuilder(
      process.cwd() + "/assets/svebalkan.png"
    );

    await interaction.editReply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
          name: "Svebalkan League table has been sent.",
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
      files: [image],
      ephemeral: true,
    });
  } else if (
    league.toLowerCase() == "fcfachallengeleague" ||
    league.toLowerCase() == "fcl"
  ) {
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
          name: "FCFA Challenge League table has been sent.",
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
      ephemeral: true,
    });

    if (fs.existsSync(process.cwd() + "/assets/fcfa-challenge.png"))
      await fs.unlinkSync(process.cwd() + "/assets/fcfa-challenge.png");

    await new Pageres({
      script: `${process.cwd() + "/assets/tableScript.js"}`,
      css: `${process.cwd() + "/assets/tableStyle.css"}`,
      hide: ["ins", ".da-h-responsive", ".adsbygoogle"],
      filename: "fcfa-challenge",
      selector: ".col-12.col-lg-7.col-xl-8.mb-3",
    })
      .src(
        "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf006dba35d7e39e7d1a56",
        ["2048x1024"]
      )
      .dest(process.cwd() + "/assets")
      .run();

    const image = new AttachmentBuilder(
      process.cwd() + "/assets/fcfa-challenge.png"
    );

    await interaction.editReply({
      embeds: [
        client.embedBuilder(client, interaction, "", "", "#f44336").setAuthor({
          name: "FCFA Challenge League table has been sent.",
          iconURL: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
        }),
      ],
      files: [image],
      ephemeral: true,
    });
  }
};
