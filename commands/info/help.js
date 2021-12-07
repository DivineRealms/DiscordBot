module.exports = {
  name: "help",
  category: "info",
  description: "Get this bots help menu.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "help",
};

module.exports.run = async (client, message, args) => {
  let cmd = args[0];

  if (!cmd) {
    const menus = [
        {
          label: "Main Menu",
          value: "val_mainMenu",
          emoji: "🏠",
          embed: client.embedBuilder(client, message, "🏠︲Main Menu", ""),
        },
        {
          label: "Economy",
          emoji: "💵",
        },
        {
          label: "Informations",
          emoji: "✨",
        },
        {
          label: "Fun",
          emoji: "☁️",
        },
        {
          label: "Moderation",
          emoji: "🎫",
        },
        {
          label: "Tickets",
          emoji: "📦",
        },
        {
          label: "Utility",
          emoji: "📏",
        },
      ],
      data = [];

    for (let i = 1; i < menus.length; i++) {
      data.push({
        label: menus[i].label,
        value: "val_" + menus[i].label.toLowerCase(),
        emoji: menus[i].emoji,
        embed: client.embedBuilder(
          client,
          message,
          menus[i].emoji + "︲" + menus[i].label + " Commands",
          client.utils.commandsList(
            client,
            message,
            menus[i].label.toLowerCase()
          )
        ),
      });
    }

    client.paginateSelect(
      client,
      message,
      menus[0],
      {
        id: "help",
        placeholder: "Choose the command category",
        options: data,
      },
      true
    );
  } else {
    const command = client.commands.find(
      (c, n) =>
        n === args[0].toLowerCase() ||
        (c.aliases && c.aliases.includes(args[0].toLowerCase()))
    );

    if (!command)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            `I couldnt find a command named ${args[0]}.`
          ),
        ],
      });

    message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Command Help",
          `<:ArrowRightGray:813815804768026705>Name: **${args[0].toLowerCase()}**
<:ArrowRightGray:813815804768026705>Aliases: **${
            command.aliases.map((s) => `\`${s}\``).join(", ") || "none"
          }**
<:ArrowRightGray:813815804768026705>Usage: \`${message.px}${command.usage}\``
        ),
      ],
    });
  }
};
