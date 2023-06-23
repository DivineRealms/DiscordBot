module.exports = {
  name: "pickforme",
  category: "fun",
  description: "Cant decide? Ill pick for you.",
  permissions: [],
  cooldown: 0,
  aliases: ["choose", "pick"],
  usage: "pickforme <option,option ETC>",
};

module.exports.run = async (client, message, args) => {
  const choices = args
      .join(" ")
      .split(/\s*\|\s*/)
      .filter((s) => s.length),
    choice = choices[~~(Math.random() * choices.length)];

  if (!choice)
    return message.channel.send({
      embeds: [
        client
          .errorEmbed(
            client,
            message,
            `You must seperate choices with a \`|\`.`
          )
          .setDescription(
            `<:ArrowRightGray:813815804768026705>Example: **\`${client.conf.Settings.Prefix}pickforme apple | banana | peach\`**.`
          ),
      ],
    });

  message.channel.send(
    `You gave me the options of **\`${choices.join(
      " "
    )}\`**.\nI chose: ${choice}.`
  );
};
