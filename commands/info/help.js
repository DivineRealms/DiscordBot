module.exports = {
  name: 'help',
  category: 'info',
  description: 'Get this bots help menu.',
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: 'help'
}

module.exports.run = async(client, message, args) => {
  let cmd = args[0];

  if(!cmd) {
    const mainMenu = client.embedBuilder(client, message, "Help Menu", `To view Commands use Drop Down to Select Command Category.\n> Total Commands: ${[...client.commands.values()].length}`)
    const economy = client.utils.commandsList(client, message, "economy");
    const ecoEmbed = client.embedBuilder(client, message, "Economy Commands", economy);
    const info = client.utils.commandsList(client, message, "info");
    const infoEmbed = client.embedBuilder(client, message, "Info Commands", info);
    const fun = client.utils.commandsList(client, message, "fun");
    const funEmbed = client.embedBuilder(client, message, "Fun Commands", fun);
    const moderation = client.utils.commandsList(client, message, "moderation");
    const modEmbed = client.embedBuilder(client, message, "Moderation Commands", moderation);
    const tickets = client.utils.commandsList(client, message, "tickets");
    const ticketsEmbed = client.embedBuilder(client, message, "Tickets Commands", tickets);
    const utility = client.utils.commandsList(client, message, "utility");
    const utilEmbed = client.embedBuilder(client, message, "Utility Commands", utility);

    let embeds = [mainMenu, ecoEmbed, infoEmbed, funEmbed, modEmbed, ticketsEmbed, utilEmbed];
    let labelArr = ["Main Menu", "Economy", "Info", "Fun", "Moderation", "Tickets", "Utility"];
    let emojiArr = ["🏠", "💵", "✨", "☁️", "🎫", "📦", "📏"];
    let data = [];

    for(let i = 0; i < embeds.length; i++) {
      data.push({
        label: labelArr[i], 
        value: "val_" + labelArr[i].toLowerCase(), 
        emoji: emojiArr[i],
        embed: embeds[i], 
      })
    }
    
    client.paginateSelect(client, message, mainMenu, {
      id: "help", 
      placeholder: "Choose Command Category.", 
      options: data
    });
  } else {
    const command = client.commands.find((c, n) => n === args[0].toLowerCase() || (c.aliases && c.aliases.includes(args[0].toLowerCase())))
    if (!command) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `I couldnt find a command named \`${args[0]}\``)]})

    const embed = client.embedBuilder(client, message, "Command Help")
        .addField('Command Name', args[0].toLowerCase())
        .addField('Aliases', command.aliases.map(s => `\`${s}\``).join(', ') || 'none')
        .addField('Usage', `\`${message.px}${command.usage}\``)

    message.channel.send({ embeds: [embed] })
  }
}
