const {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "announce",
  category: "moderation",
  description: "Allows you to send an announcement on your behalf.",
  permissions: [],
  cooldown: 0,
  aliases: ["an", "announcement"],
  usage:
    "announce <Type> | <Mention> | <Title> | <Description> | <Field Title> | <Field Description> | ...",
  slash: true,
  options: [
    {
      name: "title",
      description: "Title for Announcement",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "type",
      description: "Type of Announcement",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Default",
          value: "default",
        },
        {
          name: "Update",
          value: "update",
        },
        {
          name: "Maintenance",
          value: "maintenance",
        },
        {
          name: "Survey",
          value: "survey",
        },
      ],
      required: true,
    },
    {
      name: "image",
      description: "Image displayed on embed",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "thumbnail",
      description: "Thumbnail displayed on embed",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "mention",
      description: "Role which to mention",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],
};

module.exports.slashRun = async (client, interaction) => {
  const type = interaction.options.getString("type");
  const title = interaction.options.getString("title");
  const mention = interaction.options.getRole("mention");

  const image = interaction.options.getString("image");
  const thumbnail = interaction.options.getString("thumbnail");

  const announcementChannel = interaction.guild.channels.cache.get(
    client.conf.Settings.Announcement_Channel
  );

  let descInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("ann_desc")
      .setLabel("Announcement Description")
      .setPlaceholder("Description for Announcement Embed")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
  )

  let fieldsInput = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId("ann_data")
      .setLabel("Announcement Fields")
      .setPlaceholder(
        "Fields for your Announcements, separate using |\nExample: <Field Title> | <Field Description> | ..."
      )
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph)
  );

  let annModal = new ModalBuilder()
    .setTitle("Create Announcement")
    .setCustomId("ann_modal")
    .addComponents([descInput, fieldsInput]);

  let embed = client
    .embedBuilder(client, interaction, "", "")
    .setFooter({
      text: `Announcement by ${interaction.user.tag}`,
      iconURL: interaction.user.displayAvatarURL({
        size: 1024,
        dynamic: true,
      }),
    })
    .setTimestamp();

  if (type == "update")
    embed.setColor("#7edd8a").setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
    });
  else if (type == "maintenance")
    embed.setColor("#ffae63").setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
    });
  else if (type == "survey")
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
    });
  else
    embed.setAuthor({
      name: title,
      iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
    });

  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);

  interaction.showModal(annModal);

  const filter = (i) =>
    i.customId == "ann_modal" && i.user.id == interaction.user.id;
  interaction
    .awaitModalSubmit({ filter, time: 300_300 })
    .then(async (md) => {
      let descValue = md.fields.getTextInputValue("ann_desc");
      let fieldsValue = md.fields.getTextInputValue("ann_data");
      fieldsValue = fieldsValue.split(/\s*\|\s*/);

      embed.setDescription(descValue);

      if(fieldsValue.length > 1) {
        if (fieldsValue.length % 2 !== 0)
          return md.reply({
            embeds: [
              client.utils.errorEmbed(
                client,
                interaction,
                "You are missing a title or a description."
              ),
            ],
            ephemeral: true,
          });

        const fields = [];
        for (let i = 0; i < fieldsValue.length; i += 2)
          fields.push({ title: fieldsValue[i], description: fieldsValue[i + 1] });

        for (let i = 0; i < fields.length && fields.length <= 25; i++) {
          embed.addFields({
            name: fields[i].title,
            value: fields[i].description,
          });
          if (!fields[i].title || !fields[i].description)
            return md.followUp({
              embeds: [
                client.utils.errorEmbed(
                  client,
                  interaction,
                  "You need to provide both a title and a description."
                ),
              ],
              ephemeral: true,
            });
        }

        md.reply({
          embeds: [
            client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
              name: `Announcement has been sent!`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
          ],
          ephemeral: true,
        });

        if (mention) announcementChannel.send({ content: `🏓 ${mention}` });

        announcementChannel.send({ embeds: [embed] });
      } else {
        md.reply({
          embeds: [
            client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
              name: `Announcement has been sent!`,
              iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
            }),
          ],
          ephemeral: true,
        });

        if (mention) announcementChannel.send({ content: `🏓 ${mention}` });

        announcementChannel.send({ embeds: [embed] });
      }

      /* if (type == "update")
        embed.setColor("#7edd8a").setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/aKT2mjr0.png`,
        });
      else if (type == "maintenance")
        embed.setColor("#ffae63").setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/vRfWnVT5.png`,
        });
      else if (type == "survey")
        embed.setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/KSTCcy4V.png`,
        });
      else
        embed.setAuthor({
          name: title,
          iconURL: `https://cdn.upload.systems/uploads/sYDS6yZI.png`,
        });

      if (image) embed.setImage(image);
      if (thumbnail) embed.setThumbnail(thumbnail);

      announcementChannel.send({ embeds: [embed] });

      if (mention) {
        announcementChannel
          .send({ content: `${mention}` })
          .then((msg) => setTimeout(() => msg.delete(), 3000));
      } */
    })
    .catch((err) => {
      console.log(err);
      interaction.followUp({
        embeds: [
          client.utils.errorEmbed(
            client,
            interaction,
            "Time for entering announcement fields has passed without answer."
          ),
        ],
        ephemeral: true,
      });
    });
};
