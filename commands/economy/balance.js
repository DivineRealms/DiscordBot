const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "balance",
  category: "economy",
  description: "Check your balance on the server.",
  permissions: [],
  cooldown: 0,
  aliases: ["bal", "b"],
  usage: "balance [@User]",
  slash: true,
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "User whose balance to see",
      required: false,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author,
    bank = (await db.get(`bank_${message.guild.id}_${user.id}`)) || 0,
    balance = (await db.get(`money_${message.guild.id}_${user.id}`)) || 0;

  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          "",
          `<:ArrowRightGray:813815804768026705> Bank: **$${bank}**
<:ArrowRightGray:813815804768026705> Balance: **$${balance}**
<:ArrowRightGray:813815804768026705> Total: **$${balance + bank}**`,
          "#47a047"
        )
        .setAuthor({
          name: user.username + "'s Balance",
          iconURL: `https://cdn.upload.systems/uploads/LrdB6F1N.png`,
        }),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const user = interaction.options.getUser("user") || interaction.user,
    bank = (await db.get(`bank_${interaction.guild.id}_${user.id}`)) || 0,
    balance = (await db.get(`money_${interaction.guild.id}_${user.id}`)) || 0;

  interaction.reply({
    embeds: [
      client
        .embedBuilder(
          client,
          interaction,
          "",
          `<:ArrowRightGray:813815804768026705> Bank: **$${bank}**
<:ArrowRightGray:813815804768026705> Balance: **$${balance}**
<:ArrowRightGray:813815804768026705> Total: **$${balance + bank}**`,
          "#47a047"
        )
        .setAuthor({
          name: user.username + "'s Balance",
          iconURL: `https://cdn.upload.systems/uploads/LrdB6F1N.png`,
        }),
    ],
  });
};
