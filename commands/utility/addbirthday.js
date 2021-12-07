const datetime = require("date-and-time");
const db = require("quick.db");

module.exports = {
  category: "utility",
  name: "addbirthday",
  description: "Add your birthday to the system.",
  permissions: [],
  cooldown: 0,
  aliases: [`addbday`],
  usage: "addbirthday",
};

module.exports.run = async (client, message, args) => {
  let birthday = db.fetch(`birthday_${message.guild.id}_${message.author.id}`);

  if (birthday)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have already set your birthday."
        ),
      ],
    });

  const birthd =
      args.join(" ").toLowerCase().charAt(0).toUpperCase() +
      args.join(" ").slice(1).toLowerCase(),
    date = datetime.parse(birthd, "MMM D YYYY");

  if (!date.getDay())
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Invalid format, example: Jan 21 2004."
        ),
      ],
    });

  const age = getAge(args.join(" "));
  if (age <= 12)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You can't enter a year greater than ${
            new Date().getFullYear() - 12
          }.`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#3db39e")
        .setAuthor(
          "Successfully set your birthday.",
          `https://cdn.upload.systems/uploads/6KOGFYJM.png`
        ),
    ],
  });

  db.set(`birthday_${message.guild.id}_${message.author.id}`, args.join(" "));
};

const getAge = (b) => {
  let age = new Date().getFullYear() - new Date(b).getFullYear();
  const m = new Date().getMonth() - new Date(b).getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < new Date(b).getDate())) age--;

  return age;
};
