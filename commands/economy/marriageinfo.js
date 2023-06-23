const { ApplicationCommandOptionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "marriageinfo",
  category: "economy",
  description: "Information about user's marriage.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "marriageinfo <@User>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User whose marriage info to view",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ]
};

module.exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

  let marriageData = await db.get(`marriage_${message.guild.id}_${user.id}`);
  if(marriageData == null) 
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          `That user is not married.`
        ),
      ]
    });

  let moneyUser = await db.get(`money_${message.guild.id}_${user.id}`);
  let bankUser = await db.get(`bank_${message.guild.id}_${user.id}`);
  let moneyOther = await db.get(`money_${message.guild.id}_${marriageData.user.id}`);
  let bankOther = await db.get(`bank_${message.guild.id}_${marriageData.user.id}`);

  const wealth = Math.floor(moneyUser + bankUser + moneyOther + bankOther);

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", 
        `User **${user.username}** is married to **${marriageData.user.username}** and their wealth is __$${wealth}__. They have been married since <t:${Math.floor(marriageData.date / 1000)}:F>.`, "#3db39e")
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  let user = interaction.options.getUser("user");

  let marriageData = await db.get(`marriage_${interaction.guild.id}_${user.id}`);
  if(marriageData == null) 
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          `That user is not married.`
        ),
      ]
    });

  let moneyUser = await db.get(`money_${interaction.guild.id}_${user.id}`);
  let bankUser = await db.get(`bank_${interaction.guild.id}_${user.id}`);
  let moneyOther = await db.get(`money_${interaction.guild.id}_${marriageData.user.id}`);
  let bankOther = await db.get(`bank_${interaction.guild.id}_${marriageData.user.id}`);

  const wealth = Math.floor(moneyUser + bankUser + moneyOther + bankOther);

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", 
        `User **${user.username}** is married to **${marriageData.user.username}** and their wealth is __$${wealth}__. They have been married since <t:${Math.floor(marriageData.date / 1000)}:F>.`, "#3db39e")
    ],
  });
};
