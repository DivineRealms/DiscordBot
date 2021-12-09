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
          value: "val_mainmenu",
          emoji: "🏠",
          embed: client
            .embedBuilder(
              client,
              message,
              "",
              `<:ArrowRightGray:813815804768026705>Total Commands: **${
                [...client.commands.values()].length
              }**`
            )
            .setAuthor("Main Menu", `https://i.imgur.com/pJqB3Wm.png`),
        },
        {
          label: "Economy",
          emoji: "💵",
          avatar: `https://i.imgur.com/iaQBPKj.png`,
        },
        {
          label: "Info",
          emoji: "✨",
          avatar: `https://i.imgur.com/Wgad4Kn.png`,
        },
        {
          label: "Fun",
          emoji: "☁️",
          avatar: `https://i.imgur.com/3ZSMPLg.png`,
        },
        {
          label: "Moderation",
          emoji: "🎫",
          avatar: `https://i.imgur.com/PvrgMlm.png`,
        },
        {
          label: "Tickets",
          emoji: "📦",
          avatar: `https://i.imgur.com/A6ou6sG.png`,
        },
        {
          label: "Utility",
          emoji: "📏",
          avatar: `https://i.imgur.com/uml7Ar0.png`,
        },
      ],
      data = [];

    for (let i = 1; i < menus.length; i++) {
      data.push({
        label: menus[i].label,
        value: "val_" + menus[i].label.toLowerCase(),
        emoji: menus[i].emoji,
        embed: client
          .embedBuilder(
            client,
            message,
            "",
            client.utils.commandsList(
              client,
              message,
              menus[i].label.toLowerCase()
            )
          )
          .setAuthor(menus[i].label + " Commands", menus[i].avatar),
      });
    }

    client.paginateSelect(
      client,
      message,
      menus[0].embed,
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
