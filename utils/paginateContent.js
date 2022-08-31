const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  InteractionType,
} = require("discord.js");

async function sliceContent(content, currentPage, perPage) {
  var page = content.slice(perPage * (currentPage - 1), perPage * currentPage);

  return page.map((q) => `${q}`).join("\n");
}

async function updatePage(
  interaction,
  embed,
  array,
  perPage,
  currentPage,
  maxPage,
  row
) {
  embed.setDescription(await sliceContent(array, currentPage, perPage));

  await interaction.message.edit({ embeds: [embed], components: [row] });
}

module.exports = async function paginate(
  client,
  array,
  perPage,
  firstPage,
  message,
  title,
  color
) {
  const filter = (interaction) => {
    return interaction.user.id == message.author.id;
  };

  let maxPage = Math.ceil(array.length / perPage);
  let page = await sliceContent(array, firstPage, perPage);

  let embed = client.embedBuilder(client, "", title, page);

  const nextBttn = new ButtonBuilder()
    .setEmoji("➡️")
    .setLabel("Next")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("nextPage");
  const prevBttn = new ButtonBuilder()
    .setEmoji("⬅️")
    .setLabel("Previous")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("prevPage");

  let row = new ActionRowBuilder().addComponents([prevBttn, nextBttn]);

  currentPage = firstPage;
  // let m = await message.channel.send({ embeds: [embed], components: [row] });
  let m;

  if (message.type == InteractionType.ApplicationCommand) {
    await message.deferReply();
    m = await message.followUp({ embeds: [embed], components: [row] });
  } else {
    m = await message.channel.send({ embeds: [embed], components: [row] });
  }

  const collector = m.createMessageComponentCollector({
    filter,
    componentType: ComponentType.Button,
    time: 300000,
  });

  collector.on("collect", async (interaction) => {
    switch (interaction.customId) {
      case "nextPage":
        currentPage >= maxPage ? (currentPage = 1) : currentPage++;

        updatePage(
          interaction,
          embed,
          array,
          perPage,
          currentPage,
          maxPage,
          row
        );
        interaction.deferUpdate();
        break;
      case "prevPage":
        currentPage <= 1 ? (currentPage = maxPage) : currentPage--;

        updatePage(
          interaction,
          embed,
          array,
          perPage,
          currentPage,
          maxPage,
          row
        );
        interaction.deferUpdate();
        break;
    }
  });

  collector.on("end", async (collected, reason) => {
    prevBttn.setDisabled(true).setStyle(ButtonStyle.Secondary);
    nextBttn.setDisabled(true).setStyle(ButtonStyle.Secondary);
    let disabledRow = new ActionRowBuilder().addComponents([
      prevBttn,
      nextBttn,
    ]);
    await m.edit({ embeds: [embed], components: [disabledRow] });
  });
};
