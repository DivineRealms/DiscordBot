const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "rob",
  category: "economy",
  description: "Try to rob that one dood you want.",
  permissions: [],
  cooldown: 120,
  aliases: ["r0b"],
  usage: "rob <@User>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User you want to rob",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!member)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide a user."),
      ],
    });

  if (member.id === message.author.id)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot rob yourself."),
      ],
    });

  const memberbal = await db.get(`money_${message.guild.id}_${member.id}`);
  let rob = ~~(Math.random() * 3);
  let amount = ~~(memberbal / 10);

  if (!memberbal || memberbal < 200)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "That Member doesn't have money."),
      ],
    });

  if (rob) {
    message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You attempted to rob ${member.user.username} but got caught! The fine is $${amount}.`
        ),
      ],
    });

    await db.sub(`money_${message.guild.id}_${message.author.id}`, amount);
    await db.add(`money_${message.guild.id}_${member.id}`, amount);
  } else {
    message.channel.send({
      embeds: [
        client.embedBuilder(client, message, `You successfully robbed ${member.user.username} gaining yourself $${amount}.`, "", "#47a047"),
      ],
    });

    await db.sub(`money_${message.guild.id}_${member.id}`, amount);
    await db.add(`money_${message.guild.id}_${message.author.id}`, amount);
  }
};

module.exports.slashRun = async (client, interaction) => {
  const member = interaction.options.getUser("user");

  if (member.id === interaction.user.id)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot rob yourself."),
      ],
      ephemeral: true,
    });

  const memberbal = await db.get(`money_${interaction.guild.id}_${member.id}`);
  let rob = ~~(Math.random() * 3);
  let amount = ~~(memberbal / 10);

  if (!memberbal || memberbal < 200)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "That Member doesn't have money."),
      ],
      ephemeral: true,
    });

  if (rob) {
    interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, `You attempted to rob ${member.username} but got caught! The fine is $${amount}.`),
      ],
      ephemeral: true,
    });

    await db.sub(
      `money_${interaction.guild.id}_${interaction.user.id}`,
      amount
    );
    await db.add(`money_${interaction.guild.id}_${member.id}`, amount);
  } else {
    interaction.reply({
      embeds: [
        client.embedBuilder(client, interaction, `You successfully robbed ${member.username} gaining yourself $${amount}.`, "", "#47a047"),
      ],
    });

    await db.sub(`money_${interaction.guild.id}_${member.id}`, amount);
    await db.add(
      `money_${interaction.guild.id}_${interaction.user.id}`,
      amount
    );
  }
};
