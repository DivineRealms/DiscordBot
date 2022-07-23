const Pageres = require('pageres');
const { AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "table",
  category: "info",
  description: "View Challange.place table for League.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "table [League Name]",
  slash: true,
  options: [{
    name: "league",
    description: "Name of League for which to view table",
    type: ApplicationCommandOptionType.String,
    choices: [{
      name: "Svebalkan",
      value: "sb"
    }, {
      name: "FCFA Challenge",
      value: "fcfac"
    }],
    required: true
  }]
};

module.exports.run = async (client, message, args) => {
  const league = args[0];

  if (!league)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You need to enter league name: svebalkan (sb), fcfachallenge (fcfac/fcfa)"
        ),
      ],
    });

  const embed = new EmbedBuilder()
    .setTitle("League Table")
    .setDescription("Table is loading, please wait..")
    .setColor(client.conf.Settings.Embed_Color)

  if(league.toLowerCase() == "svebalkan" || league.toLowerCase() == "sb") {
    await fs.unlinkSync(process.cwd() + "/assets/svebalkan.png");

    await new Pageres({ filename: "svebalkan", selector: ".col-12>.row" })
      .src('https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf0094c41566e3d56d36c3', ['2048x1024'])
      .dest(process.cwd() + "/assets")
      .run();
  
    const image = new AttachmentBuilder(process.cwd() + '/assets/svebalkan.png');
  
    embed.setTitle("Svebalkan League - Table")
      .setImage('attachment://svebalkan.png');
  
    message.channel.send({ embeds: [embed], files: [image] })
  } else if(league.toLowerCase() == "fcfachallenge" || league.toLowerCase() == "fcfa" || league.toLowerCase() == "fcfac" || league.toLowerCase() == "fcfach") {
    await fs.unlinkSync(process.cwd() + "/assets/fcfa-challenge.png");

    await new Pageres({ filename: "fcfa-challenge", selector: ".col-12>.row" })
      .src('https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf006dba35d7e39e7d1a56', ['2048x1024'])
      .dest(process.cwd() + "/assets")
      .run();
  
    const image = new AttachmentBuilder(process.cwd() + '/assets/fcfa-challenge.png');
  
    embed.setTitle("FCFA Challenge League - Table")
      .setImage('attachment://fcfa-challenge.png');
  
    message.channel.send({ embeds: [embed], files: [image] })
  }
};

module.exports.slashRun = async (client, interaction) => {
  const league = interaction.options.getString("league");

  const embed = new EmbedBuilder()
    .setTitle("League Table")
    .setDescription("Table is loading, please wait..")
    .setColor(client.conf.Settings.Embed_Color);

  interaction.reply({ embeds: [embed], fetchReply: true });

  if(league.toLowerCase() == "svebalkan" || league.toLowerCase() == "sb") {
    await fs.unlinkSync(process.cwd() + "/assets/svebalkan.png");

    await new Pageres({ filename: "svebalkan", selector: ".col-12>.row" })
      .src('https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf0094c41566e3d56d36c3', ['2048x1024'])
      .dest(process.cwd() + "/assets")
      .run();
  
    const image = new AttachmentBuilder(process.cwd() + '/assets/svebalkan.png');
  
    embed.setTitle("Svebalkan League - Table")
      .setImage('attachment://svebalkan.png');
  
    interaction.editReply({ embeds: [embed], files: [image] })
  } else if(league.toLowerCase() == "fcfachallenge" || league.toLowerCase() == "fcfa" || league.toLowerCase() == "fcfac" || league.toLowerCase() == "fcfach") {
    await fs.unlinkSync(process.cwd() + "/assets/fcfa-challenge.png");

    await new Pageres({ filename: "fcfa-challenge", selector: ".col-12>.row" })
      .src('https://challenge.place/c/62aa8b995f6adfd26e923544/stage/62cf006dba35d7e39e7d1a56', ['2048x1024'])
      .dest(process.cwd() + "/assets")
      .run();
  
    const image = new AttachmentBuilder(process.cwd() + '/assets/fcfa-challenge.png');
  
    embed.setTitle("FCFA Challenge League - Table")
      .setImage('attachment://fcfa-challenge.png');
  
    interaction.editReply({ embeds: [embed], files: [image] })
  }
};
