const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "daily",
  category: "economy",
  description: "Claim that daily reward of yours.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "daily",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let cooldown = await db.get(`daily_${message.guild.id}_${message.author.id}`),
    timeout = 86400000 - (Date.now() - cooldown),
    parsed = client.utils.formatTime(timeout);

  if (cooldown != null && timeout > 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You're on cooldown, try again in ${parsed}.`
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: "You have claimed your Daily Reward of $500.",
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  await db.add(`money_${message.guild.id}_${message.author.id}`, 500);
  await db.set(`daily_${message.guild.id}_${message.author.id}`, Date.now());
};

module.exports.slashRun = async (client, interaction) => {
  let cooldown = await db.get(
      `daily_${interaction.guild.id}_${interaction.user.id}`
    ),
    timeout = 86400000 - (Date.now() - cooldown),
    parsed = client.utils.formatTime(timeout);

  if (cooldown != null && timeout > 0)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `You're on cooldown, try again in ${parsed}.`
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: "You have claimed your Daily Reward of $500.",
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, 500);
  await db.set(
    `daily_${interaction.guild.id}_${interaction.user.id}`,
    Date.now()
  );
};
