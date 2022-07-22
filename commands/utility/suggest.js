const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "suggest",
  category: "utility",
  description: "Lets you submit a suggestion.",
  permissions: [],
  cooldown: 0,
  aliases: [`sug`],
  usage: "suggest <Suggestion>",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let channel = client.channels.cache.get(client.conf.Logging.Suggestions);

  if (!channel)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "The suggestions channel hasn't been setup for this server."
        ),
      ],
    });

  if (!args[0])
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Please provide a suggestion."
        ),
      ],
    });

  setTimeout(() => message.delete(), 3000);
  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor({
          name: "Your suggestion has been submitted successfully.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        }),
    ],
  });

  const msg = await channel.send({
    embeds: [
      client.embedBuilder(client, message, "Suggestion", `${args.join(" ")}`),
    ],
  });

  await msg.react("👍");
  await msg.react("👎");

  await db.set(`suggestion_${msg.id}`, {
    user: message.author,
    suggestion: args.join(" "),
  });
};

module.exports.slashRun = async (client, interaction) => {
  let channel = client.channels.cache.get(client.conf.Logging.Suggestions);

  if (!channel)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "The suggestions channel hasn't been setup for this server."
        ),
      ],
    });

    let suggInput = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
        .setCustomId("sugg_text")
        .setLabel("Your Suggestion")
        .setPlaceholder("Enter your suggestion here")
        .setMinLength(3)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
    );
  
  let suggModal = new ModalBuilder()
    .setTitle("Send Suggestion")
    .setCustomId("sugg_modal")
    .addComponents(suggInput);
    
  interaction.showModal(suggModal);
  
  const filter = (i) => i.customId == 'sugg_modal';
  interaction.awaitModalSubmit({ filter, time: 120_000 })
    .then(async(md) => {
    let suggValue = md.fields.getTextInputValue("sugg_text");

    md.reply({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "#3db39e")
          .setAuthor({
            name: "Your suggestion has been submitted successfully.",
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ],
    });
  
    const msg = await channel.send({
      embeds: [
        client.embedBuilder(client, interaction, "Suggestion", `${suggValue}`),
      ],
    });
  
    await msg.react("👍");
    await msg.react("👎");
  
    await db.set(`suggestion_${msg.id}`, {
      user: interaction.user,
      suggestion: suggValue,
    });
  }).catch((err) => {
    interaction.followUp({
      embeds: [
        client
          .embedBuilder(client, interaction, "", "", "Red")
          .setAuthor({
            name: "Time for entering suggestion has passed without answer.",
            iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          }),
      ], ephemeral: true,
    });
  })
};
