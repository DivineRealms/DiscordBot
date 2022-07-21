const datetime = require("date-and-time");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "setbirthday",
  category: "utility",
  description: "Set a users birthday.",
  permissions: ["ManageRolesROLES"],
  cooldown: 0,
  aliases: [`setbday`],
  usage: "setbirthday @user Sep 4 2004",
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
          iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`
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

  await db.set(`birthday_${message.guild.id}_${user.id}`, args.slice(1).join(" "));
};

const getAge = (b) => {
  let age = new Date().getFullYear() - new Date(b).getFullYear();
  const m = new Date().getMonth() - new Date(b).getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate())) age--;

  return age;
};
