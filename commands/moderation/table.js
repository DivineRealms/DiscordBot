const Pageres = require("pageres");
const {
  AttachmentBuilder,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");
const fs = require("fs");

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

module.exports.run = async (client, message, args) => {};

module.exports.slashRun = async (client, interaction) => {
  const league = interaction.options.getString("league");

  if (league.toLowerCase() == "svebalkan" || league.toLowerCase() == "svb") {
    interaction.reply({
      content: "Svebalkan League table is being downloaded...",
      ephemeral: true,
    });

    if (fs.existsSync(process.cwd() + "/assets/svebalkan.png"))
      fs.unlinkSync(process.cwd() + "/assets/svebalkan.png");

    await new Pageres({
      script: `${process.cwd() + "/assets/tableScript.js"}`,
      css: `${process.cwd() + "/assets/tableStyle.css"}`,
      hide: ["ins", ".da-h-responsive", ".adsbygoogle"],
      filename: "svebalkan",
      selector: ".col-12.col-lg-7.col-xl-8.mb-3",
    })
      .src(
        "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/6311ed215097d41839b2319b",
        ["2048x1024"]
      )
      .dest(process.cwd() + "/assets")
      .run();

    const image = new AttachmentBuilder(
      process.cwd() + "/assets/svebalkan.png"
    );

    await interaction.editReply({
      content: "Done!",
      files: [image],
      ephemeral: true,
    });
  } else if (
    league.toLowerCase() == "fcfachallengeleague" ||
    league.toLowerCase() == "fcl"
  ) {
    interaction.reply({
      content: "FCFA Challenge League table is being downloaded...",
      ephemeral: true,
    });

    if (fs.existsSync(process.cwd() + "/assets/fcfa-challenge.png"))
      fs.unlinkSync(process.cwd() + "/assets/fcfa-challenge.png");

    await new Pageres({
      script: `${process.cwd() + "/assets/tableScript.js"}`,
      css: `${process.cwd() + "/assets/tableStyle.css"}`,
      hide: ["ins", ".da-h-responsive", ".adsbygoogle"],
      filename: "fcfa-challenge",
      selector: ".col-12.col-lg-7.col-xl-8.mb-3",
    })
      .src(
        "https://challenge.place/c/62aa8b995f6adfd26e923544/stage/6311f0d27f11701814dda779",
        ["2048x1024"]
      )
      .dest(process.cwd() + "/assets")
      .run();

    const image = new AttachmentBuilder(
      process.cwd() + "/assets/fcfa-challenge.png"
    );

    await interaction.editReply({
      content: "Done!",
      files: [image],
      ephemeral: true,
    });
  }
};
