const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "divorce",
  category: "economy",
  description: "Divorce from your partner.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "divorce",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  let marriageAuthor = await db.get(`marriage_${message.guild.id}_${message.author.id}`);

  if(marriageAuthor == null) 
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `You're not married.`
        ),
      ]
    });

  let balAuthor = await db.get(`money_${message.guild.id}_${message.author.id}`);
  let balUser = await db.get(`money_${message.guild.id}_${marriageAuthor.user.id}`);

  if(balAuthor < 15000 || balUser < 15000)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You or the other user doesn't have $15.000"),
      ],
    });

  await db.delete(`marriage_${message.guild.id}_${marriageAuthor.user.id}`);
  await db.delete(`marriage_${message.guild.id}_${message.author.id}`);
  await db.sub(`money_${message.guild.id}_${marriageAuthor.user.id}`, 15000);
  await db.sub(`money_${message.guild.id}_${message.author.id}`, 15000);

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message,
        `You are now officialy divorced from ${marriageAuthor.user.username}.`, "",
          "#60b8ff")
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let marriageAuthor = await db.get(`marriage_${interaction.guild.id}_${interaction.user.id}`);

  if(marriageAuthor == null) 
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `You're not married.`
        ),
      ]
    });

  let balAuthor = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);
  let balUser = await db.get(`money_${interaction.guild.id}_${marriageAuthor.user.id}`);

  if(balAuthor < 15000 || balUser < 15000)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You or the other user doesn't have $15.000"),
      ],
    });

  await db.delete(`marriage_${interaction.guild.id}_${marriageAuthor.user.id}`);
  await db.delete(`marriage_${interaction.guild.id}_${interaction.user.id}`);
  await db.sub(`money_${interaction.guild.id}_${marriageAuthor.user.id}`, 15000);
  await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, 15000);

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction,
        `You are now officialy divorced from ${marriageAuthor.user.username}.`, "",
          "#60b8ff")
    ],
  });
};
