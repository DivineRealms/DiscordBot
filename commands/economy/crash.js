const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { ActionRowBuilder, ApplicationCommandOptionType, 
  ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
  name: "crash",
  category: "economy",
  description: "Play crash game.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "crash <amount || all>",
  slash: true,
  options: [
    {
      name: "amount",
      description: "Amount you want to bet in crash",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

module.exports.run = async (client, message, args) => {
  const amount = args[0];
  let bal = await db.get(`money_${message.guild.id}_${message.author.id}`);
  let crashRunning = await db.get(`crashRunning_${message.guild.id}_${message.author.id}`);

  if(crashRunning)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Crash is already running, stop it first."),
      ],
    });

  let cooldown = await db.get(
      `crash_${message.guild.id}_${message.author.id}`
    ),
    timeout = 60000 - (Date.now() - cooldown),
    parsed = client.utils.formatTime(timeout);

  if (cooldown != null && timeout > 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, `You're on cooldown, try again in ${parsed}.`),
      ]
    });
  
  if (!amount || (isNaN(amount) && amount != "all"))
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Betting value not given."),
      ],
    });

  let money = amount == "all" ? parseInt(bal) : parseInt(amount);

  if (!bal || bal == 0)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You don't have enough money."),
      ],
    });

  if (amount != "all" && amount > bal)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You don't have that much money."
        ),
      ],
    });

  if (amount != "all" && amount < 200)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "You cannot bet less than $200."),
      ],
    });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('crash_stop')
      .setLabel('Stop Crash')
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🤚"),
    );

  let crashEmbed = client.embedBuilder(client, message, `Crash started with $${money}`, "", "#3db39e")
    .addFields([{ name: "Multiplier", value: "1.1x", inline: true }])
    .addFields([{ name: "Profit", value: "$0", inline: true }]);

  message.channel.send({ embeds: [crashEmbed], components: [row] }).then(async(m) => {
    await db.set(`crashRunning_${message.guild.id}_${message.author.id}`, true);
    await db.set(`crash_${message.guild.id}_${message.author.id}`, Date.now());

    let crashed = false;
    let crashValue = 1.1;
    let multiplier = 1.1;
    
    let crashRange = [(Math.random() * (1.0 - 8.0) + 8.0).toFixed(1),
      (Math.random() * (1.0 - 27.0) + 27.0).toFixed(1),
      (Math.random() * (1.0 - 38.0) + 38.0).toFixed(1)];
    const chanceGenerator = Math.floor(Math.random() * (72 - 1 + 1) + 1);
    const instantCrash = Math.floor(Math.random() * 100) + 1;
    
    if(instantCrash <= 36) crashRange = 1.1;
    else if(chanceGenerator % 2 == 1 && chanceGenerator > 80) crashValue = crashRange[2];
    else if(chanceGenerator % 2 == 0 && chanceGenerator < 15) crashValue = crashRange[1];
    else crashValue = crashRange[0];
    
    editCrash();

    function editCrash() {
      setTimeout(async() => {
        if(crashed) return;
        if(parseFloat((multiplier).toFixed(1)) >= parseFloat(crashValue) || parseFloat((multiplier).toFixed(1)) >= 50.0) {
          crashed = true;
          await db.delete(`crashRunning_${message.guild.id}_${message.author.id}`);
          crashEmbed.data.fields[0].name = "Crashed at";
          crashEmbed.data.fields[1].value = `-$${money}`;
          crashEmbed.setFooter({ text: `You lost $${money} in crash` }).setColor("#e24c4b");

          await db.sub(`money_${message.guild.id}_${message.author.id}`, money);
          return m.edit({ embeds: [crashEmbed], components: [] });
        }
        multiplier = multiplier += 0.1;

        crashEmbed.data.fields[0].value = `${parseFloat((multiplier).toFixed(1))}x`;
        crashEmbed.data.fields[1].value = `$${Math.floor(money * parseFloat((multiplier).toFixed(1))) - money}`;
        m.edit({ embeds: [crashEmbed], components: [row] });
        editCrash();
      }, 2000);
    }

    const filter = (interaction) => interaction.customId == 'crash_stop' && interaction.user.id == message.author.id && crashed == false;
    await message.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1 }).then(async() => {
      let toAdd = Math.floor(money * parseFloat((multiplier).toFixed(1))) - money;

      crashed = true;
      crashEmbed.data.fields[0].name = "Stopped at";
      crashEmbed.data.fields[0].value = `${parseFloat((multiplier).toFixed(1))}x \`(${crashValue}x)\``;
      crashEmbed.setFooter({ text: `Crash stopped and you earned $${toAdd}` }).setColor("#3db39e");
      
      await db.add(`money_${message.guild.id}_${message.author.id}`, toAdd);
      await db.delete(`crashRunning_${message.guild.id}_${message.author.id}`);
      m.edit({ embeds: [crashEmbed], components: []});
    })
  });
};

module.exports.slashRun = async (client, interaction) => {
  const amount = interaction.options.getString("amount");
  let bal = await db.get(`money_${interaction.guild.id}_${interaction.user.id}`);
  let crashRunning = await db.get(`crashRunning_${interaction.guild.id}_${interaction.user.id}`);

  if(crashRunning)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Crash is already running, stop it first."),
      ],
    });

  let cooldown = await db.get(
      `crash_${interaction.guild.id}_${interaction.user.id}`
    ),
    timeout = 60000 - (Date.now() - cooldown),
    parsed = client.utils.formatTime(timeout);

  if (cooldown != null && timeout > 0)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, `You're on cooldown, try again in ${parsed}.`),
      ]
    });
  
  if (!amount || (isNaN(amount) && amount != "all"))
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "Betting value not given."),
      ],
    });

  let money = amount == "all" ? parseInt(bal) : parseInt(amount);

  if (!bal || bal == 0)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You don't have enough money."),
      ],
    });

  if (amount != "all" && amount > bal)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You don't have that much money."),
      ],
    });

  if (amount != "all" && amount < 200)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(client, interaction, "You cannot bet less than $200."),
      ],
    });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('crash_stop')
      .setLabel('Stop Crash')
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🤚"),
    );

  let crashEmbed = client.embedBuilder(client, interaction, "", "", "#3db39e")
    .setFooter({ text: `Crash started with $${money}` })
    .addFields([{ name: "Multiplier", value: "1.1x", inline: true }])
    .addFields([{ name: "Profit", value: "$0", inline: true }]);

  interaction.reply({ embeds: [crashEmbed], components: [row], fetchReply: true }).then(async(m) => {
    await db.set(`crashRunning_${interaction.guild.id}_${interaction.user.id}`, true);
    await db.set(`crash_${interaction.guild.id}_${interaction.user.id}`, Date.now());

    let crashed = false;
    let crashValue = 1.1;
    let multiplier = 1.1;
    
    let crashRange = [(Math.random() * (1.0 - 8.0) + 8.0).toFixed(1),
      (Math.random() * (1.0 - 27.0) + 27.0).toFixed(1),
      (Math.random() * (1.0 - 38.0) + 38.0).toFixed(1)];
    const chanceGenerator = Math.floor(Math.random() * (72 - 1 + 1) + 1);
    const instantCrash = Math.floor(Math.random() * 100) + 1;
    
    if(instantCrash <= 36) crashRange = 1.1;
    else if(chanceGenerator % 2 == 1 && chanceGenerator > 80) crashValue = crashRange[2];
    else if(chanceGenerator % 2 == 0 && chanceGenerator < 15) crashValue = crashRange[1];
    else crashValue = crashRange[0];
    
    editCrash();

    function editCrash() {
      setTimeout(async() => {
        if(crashed) return;
        if(parseFloat((multiplier).toFixed(1)) >= parseFloat(crashValue) || parseFloat((multiplier).toFixed(1)) >= 50.0) {
          crashed = true;
          await db.delete(`crashRunning_${interaction.guild.id}_${interaction.user.id}`);
          crashEmbed.data.fields[0].name = "Crashed at";
          crashEmbed.data.fields[1].value = `-$${money}`;
          crashEmbed.setFooter({ text: `You lost $${money} in crash` }).setColor("#e24c4b");

          await db.sub(`money_${interaction.guild.id}_${interaction.user.id}`, money);
          return m.edit({ embeds: [crashEmbed], components: [] });
        }
        multiplier = multiplier += 0.1;

        crashEmbed.data.fields[0].value = `${parseFloat((multiplier).toFixed(1))}x`;
        crashEmbed.data.fields[1].value = `$${Math.floor(money * parseFloat((multiplier).toFixed(1))) - money}`;
        m.edit({ embeds: [crashEmbed], components: [row] });
        editCrash();
      }, 2000);
    }

    const filter = (interaction) => interaction.customId == 'crash_stop' && interaction.user.id == interaction.user.id && crashed == false;
    await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1 }).then(async() => {
      let toAdd = Math.floor(money * parseFloat((multiplier).toFixed(1))) - money;

      crashed = true;
      crashEmbed.data.fields[0].name = "Stopped at";
      crashEmbed.data.fields[0].value = `${parseFloat((multiplier).toFixed(1))}x \`(${crashValue}x)\``;
      crashEmbed.setFooter({ text: `Crash stopped and you earned $${toAdd}` }).setColor("#3db39e");
      
      await db.add(`money_${interaction.guild.id}_${interaction.user.id}`, toAdd);
      await db.delete(`crashRunning_${interaction.guild.id}_${interaction.user.id}`);
      m.edit({ embeds: [crashEmbed], components: []});
    });
  });
};