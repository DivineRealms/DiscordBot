const { ApplicationCommandOptionType, ActionRowBuilder, 
  ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "marry",
  category: "economy",
  description: "Marry someone and form a family!",
  permissions: [],
  cooldown: 600,
  aliases: [],
  usage: "marry <@User>",
  slash: true,
  options: [
    {
      name: "user",
      description: "User to marry",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  if(!user || user.id == message.author.id) 
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You need to provide a user."),
      ],
    });

  let marriageAuthor = await db.get(`marriage_${message.guild.id}_${message.author.id}`);
  let marriageUser = await db.get(`marriage_${message.guild.id}_${user.id}`);
  let balAuthor = await db.get(`money_${message.guild.id}_${message.author.id}`);
  let balUser = await db.get(`money_${message.guild.id}_${user.id}`);

  if(balAuthor < 10000 || balUser < 10000)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You or the other user doesn't have $10.000"),
      ],
    });

   if(marriageAuthor != null || marriageUser != null) 
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You or the other User are already married."),
      ],
    });

  const marriageEmbed = client.embedBuilder(client, message,
    `${user.username}, ${message.author.username} proposed to you.\nUse buttons to accept or decline proposal, you have 3 minutes.`, "",
      "#60b8ff");
    
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('accept_marriage')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Primary)
        .setEmoji("💍"),
      new ButtonBuilder()
        .setCustomId('decline_marriage')
        .setLabel('Decline')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌")
    );

  let m = await message.channel.send({ embeds: [marriageEmbed], components: [row] });

  const filter = (i) => i.user.id == user.id;
  const collector = m.createMessageComponentCollector({ filter,
    componentType: ComponentType.Button, 
    time: 180_000,
    limit: 1
  });

  collector.on('collect', async(i) => {
    await i.deferUpdate();
    if(i.customId == "accept_marriage") {
      await db.set(`marriage_${message.guild.id}_${message.author.id}`, {
        user: user,
        date: new Date().getTime(),
      });
      await db.set(`marriage_${message.guild.id}_${user.id}`, {
        user: message.author,
        date: new Date().getTime(),
      });

      await db.sub(`money_${message.guild.id}_${message.author.id}`, 10000);
      await db.sub(`money_${message.guild.id}_${user.id}`, 10000);
      
      message.channel.send({ embeds: [client.embedBuilder(client, message, 
        `${user.username} and ${message.author.username} official got married! Congratulations!`, "",
        "#60b8ff")] }).then(async(m) => {
          await m.react("🎊");
        });
      
      collector.stop("stopped");
    } else if(i.customId == "decline_marriage") {
      await db.set(`marriage_${message.guild.id}_${message.author.id}`, {
        user: user,
        date: new Date().getTime(),
      });
      await db.set(`marriage_${message.guild.id}_${user.id}`, {
        user: message.author,
        date: new Date().getTime(),
      });
      
      message.channel.send({ embeds: [client.embedBuilder(client, message, 
        `Sadly ${user.username} declined the proposal.. Better luck next time!`, "",
        "#e24c4b")] });
      
      collector.stop("stopped");
    }
  });
  collector.on('end', async(collected, reason) => {
    row.components[0].setStyle(ButtonStyle.Secondary).setDisabled(true);
    row.components[1].setStyle(ButtonStyle.Secondary).setDisabled(true);

    if(reason != "stopped")
      marriageEmbed.setDescription(`Time for the decision has passed. Sadly, we won't have a new couple for now..`);
    
    await m.edit({ embeds: [marriageEmbed], components: [row] });
  });
};

module.exports.slashRun = async (client, interaction) => {
  let user = interaction.options.getUser("user");
  if(!user || user.id == interaction.user.id) 
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You need to provide a user."),
      ],
    });

  let marriageAuthor = await db.get(`marriage_${interaction.guild.id}_${interaction.user.id}`);
  let marriageUser = await db.get(`marriage_${interaction.guild.id}_${user.id}`);
  let balAuthor = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);
  let balUser = await db.get(`money_${interaction.guild.id}_${user.id}`);

  if(balAuthor < 10000 || balUser < 10000)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You or the other user doesn't have $10.000"),
      ],
    });

  if(marriageAuthor != null || marriageUser != null) 
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You or the other User are already married."),
      ],
    });

  const marriageEmbed = client.embedBuilder(client, interaction,
    `${user.username}, ${interaction.user.username} proposed to you.\nUse buttons to accept or decline proposal, you have 3 minutes.`, "",
      "#60b8ff");
    
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('accept_marriage')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Primary)
        .setEmoji("💍"),
      new ButtonBuilder()
        .setCustomId('decline_marriage')
        .setLabel('Decline')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌")
    );

  let m = await interaction.reply({ embeds: [marriageEmbed], components: [row], fetchReply: true });

  const filter = (i) => i.user.id == user.id;
  const collector = m.createMessageComponentCollector({ filter,
    componentType: ComponentType.Button, 
    time: 180_000,
    limit: 1
  });

  collector.on('collect', async(i) => {
    await i.deferUpdate();
    if(i.customId == "accept_marriage") {
      await db.set(`marriage_${interaction.guild.id}_${interaction.user.id}`, {
        user: user,
        date: new Date().getTime(),
      });
      await db.set(`marriage_${interaction.guild.id}_${user.id}`, {
        user: interaction.user,
        date: new Date().getTime(),
      });

      await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, 10000);
      await db.sub(`money_${interaction.guild.id}_${user.id}`, 10000);
      
      interaction.channel.send({ embeds: [client.embedBuilder(client, interaction, 
        `${user.username} and ${interaction.user.username} official got married! Congratulations!`, "",
        "#60b8ff")] }).then(async(m) => {
          await m.react("🎊");
        });
      
      collector.stop("stopped");
    } else if(i.customId == "decline_marriage") {
      await db.set(`marriage_${interaction.guild.id}_${interaction.user.id}`, {
        user: user,
        date: new Date().getTime(),
      });
      await db.set(`marriage_${interaction.guild.id}_${user.id}`, {
        user: interaction.user,
        date: new Date().getTime(),
      });
      
      interaction.channel.send({ embeds: [client.embedBuilder(client, interaction, 
        `Sadly ${user.username} declined the proposal.. Better luck next time!`, "",
        "#e24c4b")] });
      
      collector.stop("stopped");
    }
  });
  collector.on('end', async(collected, reason) => {
    row.components[0].setStyle(ButtonStyle.Secondary).setDisabled(true);
    row.components[1].setStyle(ButtonStyle.Secondary).setDisabled(true);

    if(reason != "stopped")
      marriageEmbed.setDescription(`Time for the decision has passed. Sadly, we won't have a new couple for now..`);
    
    await m.edit({ embeds: [marriageEmbed], components: [row] });
  });
}