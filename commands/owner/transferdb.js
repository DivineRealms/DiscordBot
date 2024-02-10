const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "transferdb",
  category: "owner",
  description: "Transfer Database data from one ID to other.",
  permissions: [],
  cooldown: 0,
  aliases: ["transferdata"],
  usage: "transferdb <Old User ID> <New User ID>",
  slash: true,
  options: [
    {
      name: "oldid",
      description: "Old ID of User.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "newid",
      description: "New ID of User.",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],
};

module.exports.run = async (client, message, args) => {};

module.exports.slashRun = async (client, interaction, args) => {
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

  const oldId = interaction.options.getString("oldid");
  const newId = interaction.options.getString("newid");

  (await db.all()).filter((fd) => fd.id.includes(oldId)).forEach(async(data) => {
    let changedId = data.id.replace(oldId, newId);
    await db.set(changedId, data.value);
    await db.delete(data.id);
  });

  await interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: `Database Data of User ID ${oldId} has been transferred to ${newId}.`,
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ], ephemeral: true
  });
  
};
