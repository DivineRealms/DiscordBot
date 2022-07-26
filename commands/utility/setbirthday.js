const datetime = require("date-and-time");
const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "setbirthday",
  category: "utility",
  description: "Set a users birthday.",
  permissions: ["ManageRoles"],
  cooldown: 0,
  aliases: [`setbday`],
  usage: "setbirthday <@User> <Date>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User whoes birthday to set",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "date",
      description: "Date of your birthday",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
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

  const embed = client.embedBuilder(client, message, "", "", "#3db39e"),
    user = message.mentions.users.first(),
    birthd =
      args.slice(1).join(" ").toLowerCase().charAt(0).toUpperCase() +
      args.slice(1).join(" ").slice(1).toLowerCase(),
    date = datetime.parse(birthd, "MMM D YYYY");

  if (!user || !date.getDay())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `Invalid usage, check ${message.px}help setbirthday`
        ),
      ],
    });

  const age = getAge(args.slice(1).join(" "));
  if (age <= 12)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You can\'t enter a year greater than ${
            new Date().getFullYear() - 12
          }!`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      embed
        .setAuthor({
          name: "Successfully set your birthday.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        })
        .setDescription(
          `<:ArrowRightGray:813815804768026705>I have set ${user}'s birthday to ${args
            .slice(1)
            .join(" ")}!\n<:ArrowRightGray:813815804768026705>They will be ${
            age + 1
          }.`
        ),
    ],
  });

  await db.set(
    `birthday_${message.guild.id}_${user.id}`,
    args.slice(1).join(" ")
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

  const embed = client.embedBuilder(client, interaction, "", "", "#3db39e"),
    user = interaction.options.getUser("user"),
    birthd = interaction.options.getString("date"),
    date = datetime.parse(birthd, "MMM D YYYY");

  if (!date.getDay())
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `Invalid usage, check ${interaction.px}help setbirthday`
        ),
      ],
      ephemeral: true,
    });

  const age = getAge(args.slice(1).join(" "));
  if (age <= 12)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `You can\'t enter a year greater than ${
            new Date().getFullYear() - 12
          }!`
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      embed
        .setAuthor({
          name: "Successfully set birthday.",
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
        })
        .setDescription(
          `<:ArrowRightGray:813815804768026705>I have set ${user}'s birthday to ${interaction.options.getString(
            "date"
          )}!\n<:ArrowRightGray:813815804768026705>They will be ${age + 1}.`
        ),
    ],
  });

  await db.set(
    `birthday_${interaction.guild.id}_${user.id}`,
    args.slice(1).join(" ")
  );
};

const getAge = (b) => {
  let age = new Date().getFullYear() - new Date(b).getFullYear();
  const m = new Date().getMonth() - new Date(b).getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate())) age--;

  return age;
};
