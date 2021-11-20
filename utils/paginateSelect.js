const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = async (client, message, home, data) => {
  let optionList = [];
  let options = data.options;
  
  for(let i = 0; i < options.length; i++) {
    let obj = {
      label: options[i].label,
      value: options[i].value, 
      emoji: options[i].emoji
    };
    
    optionList.push(obj);
  }

  let sMenu = new MessageSelectMenu()
    .setCustomId(data.id)
    .setPlaceholder(data.placeholder)
    .addOptions(optionList)

  let row = new MessageActionRow()
    .addComponents(sMenu)
  
  const m = await message.channel.send({ embeds: [home], components: [row] });
  
  const filter = (interaction) => {
    return interaction.user.id == message.author.id;
  };

  const collector = m.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 300000 });
  collector.on('collect', async i => {
    let value = i.values[0];
    for(let j = 0; j < options.length; j++) {
      if(value == options[j].value) {
        await i.deferUpdate();
        m.edit({ embeds: [options[j].embed], components: [row] });
      }
    }
  });
  collector.on("end", async(collected, reason) => {
    let disabledSel = new MessageSelectMenu()
      .setCustomId(data.id)
      .setDisabled(true)
      .setPlaceholder(data.placeholder)
      .addOptions(optionList)
  
    let disabledRow = new MessageActionRow().addComponents(disabledSel);
    
    m.edit({ embeds: [home], components: [disabledRow] });
  })
};