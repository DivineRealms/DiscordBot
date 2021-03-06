const { QuickDB } = require("quick.db");
const db = new QuickDB();
const paginateContent = require("../../utils/paginateContent.js");

module.exports = {
  name: "birthdayscoming",
  category: "utility",
  description: "Views all the birthdays coming up in the week.",
  permissions: [],
  cooldown: 0,
  aliases: [`bdaylist`],
  usage: "birthdayscoming",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  if (!client.conf.Birthday_System.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Birthday System is not enabled."
        ),
      ],
    });

  const dates = [
    "January",
    "Februrary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isToday = (d) =>
    d
      ? new Date().getMonth() === new Date(d).getMonth() &&
        new Date().getDate() <= new Date(d).getDate()
      : false;

  let birthdays = (await db.all())
    .filter((i) => i.id.startsWith(`birthday_${message.guild.id}_`))
    .sort((a, b) => b.value - a.value);

  birthdays = birthdays
    .filter((b) => isToday(b.value))
    .map((s) => {
      let bUser = client.users.cache.get(s.id.split("_")[2]) || "N/A";
      return `> **${s.value.slice(1, -1).trim()}** - ${bUser}\n`;
    });

  if (!birthdays.length)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "There aren't any upcoming birthdays."
        ),
      ],
    });

  paginateContent(
    client,
    birthdays,
    10,
    1,
    message,
    `Birthdays Coming Up for ${dates[new Date().getMonth()]}!`
  );
};

module.exports.slashRun = async (client, interaction) => {
  if (!client.conf.Birthday_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Birthday System is not enabled."
        ),
      ],
      ephemeral: true,
    });

  const dates = [
    "January",
    "Februrary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isToday = (d) =>
    d
      ? new Date().getMonth() === new Date(d).getMonth() &&
        new Date().getDate() <= new Date(d).getDate()
      : false;

  let birthdays = (await db.all())
    .filter((i) => i.id.startsWith(`birthday_${interaction.guild.id}_`))
    .sort((a, b) => b.value - a.value);

  birthdays = birthdays
    .filter((b) => isToday(b.value))
    .map((s) => {
      let bUser = client.users.cache.get(s.id.split("_")[2]) || "N/A";
      return `> **${s.value.slice(1, -1).trim()}** - ${bUser}\n`;
    });

  if (!birthdays.length)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "There aren't any upcoming birthdays."
        ),
      ],
      ephemeral: true,
    });

  paginateContent(
    client,
    birthdays,
    10,
    1,
    interaction,
    `Birthdays Coming Up for ${dates[new Date().getMonth()]}!`
  );
};
