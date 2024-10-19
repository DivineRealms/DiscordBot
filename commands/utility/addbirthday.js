const { ApplicationCommandOptionType } = require("discord.js");
const datetime = require("date-and-time");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  category: "utility",
  name: "addbirthday",
  description: "Add your birthday to the system.",
  permissions: [],
  cooldown: 0,
  aliases: [`addbday`],
  usage: "addbirthday",
  slash: true,
  options: [
    {
      name: "date",
      description: "Date of your birthday",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let birthday = await db.get(
    `birthday_${message.guild.id}_${message.author.id}`
  );

  if (!client.conf.Birthday_System.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Birthday System is not enabled."),
      ],
    });

  if (birthday)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed( client, message, "You have already set your birthday."),
      ],
    });

  const birthd =
      args.join(" ").toLowerCase().charAt(0).toUpperCase() +
      args.join(" ").slice(1).toLowerCase(),
    date = datetime.parse(birthd, "MMM D YYYY");

  if (isNaN(date))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed( client, message, "Invalid format, example: Jan 21 2004"),
      ],
    });

  const age = getAge(args.join(" "));
  if (age <= 12)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, `You can't enter a year greater than ${
            new Date().getFullYear() - 12
          }.`),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "Successfully set your birthday.", "", "#3db39e"),
    ],
  });

  await db.set(
    `birthday_${message.guild.id}_${message.author.id}`,
    args.join(" ")
  );
};

module.exports.slashRun = async (client, interaction) => {
  let birthday = await db.get(
    `birthday_${interaction.guild.id}_${interaction.user.id}`
  );

  if (!client.conf.Birthday_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Birthday System is not enabled."),
      ],
      ephemeral: true,
    });

  if (birthday)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You have already set your birthday."),
      ],
      ephemeral: true,
    });

  const birthd = interaction.options.getString("date");
  date = datetime.parse(birthd, "MMM D YYYY");

  if (isNaN(date))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Invalid format, example: Jan 21 2004"),
      ],
      ephemeral: true,
    });

  const age = getAge(birthd);
  if (age <= 12)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction,
          `You can't enter a year greater than ${
            new Date().getFullYear() - 12
          }.`
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "Successfully set your birthday.", "", "#3db39e"),
    ],
  });

  await db.set(
    `birthday_${interaction.guild.id}_${interaction.user.id}`,
    birthd
  );
};

const getAge = (b) => {
  let age = new Date().getFullYear() - new Date(b).getFullYear();
  const m = new Date().getMonth() - new Date(b).getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate())) age--;

  return age;
};
