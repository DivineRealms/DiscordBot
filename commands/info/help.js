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
              }**`,
              "#e4f5fd"
            )
            .setAuthor(
              "Main Menu",
              `https://cdn.upload.systems/uploads/NItdPjzt.png`
            ),
        },
        {
          label: "Economy",
          emoji: "💵",
          avatar: `https://cdn.upload.systems/uploads/LrdB6F1N.png`,
          color: "#47a047",
        },
        {
          label: "Info",
          emoji: "✨",
          avatar: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
          color: "#60b8ff",
        },
        {
          label: "Fun",
          emoji: "☁️",
          avatar: `https://cdn.upload.systems/uploads/ZdKDK7Tx.png`,
          color: "#ec3d93",
        },
        {
          label: "Moderation",
          emoji: "🎫",
          avatar: `https://cdn.upload.systems/uploads/6Xdg16Gh.png`,
          color: "#f44336",
        },
        {
          label: "Tickets",
          emoji: "📦",
          avatar: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
          color: "#b3e59f",
        },
        {
          label: "Utility",
          emoji: "📏",
          avatar: `https://cdn.upload.systems/uploads/Za4oLQsR.png`,
          color: "#7bc2cc",
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
            ),
            menus[i].color
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
        client
          .embedBuilder(
            client,
            message,
            "",
            `<:ArrowRightGray:813815804768026705>Name: **${args[0].toLowerCase()}**
<:ArrowRightGray:813815804768026705>Aliases: **${
              command.aliases.map((s) => `\`${s}\``).join(", ") || "none"
            }**
<:ArrowRightGray:813815804768026705>Usage: \`${message.px}${command.usage}\``,
            "#7bc2cc"
          )
          .setAuthor(
            "Command Help",
            `https://cdn.upload.systems/uploads/Za4oLQsR.png`
          ),
      ],
    });
  }
};
