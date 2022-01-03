module.exports = {
  name: "botinfo",
  category: "info",
  description: "Allows you to view information on the bot.",
  permissions: [],
  cooldown: 0,
  aliases: ["binfo", "infobot", "bottinfo"],
  usage: "botinfo",
};

module.exports.run = async (client, message, args) => {
  message.channel.send({
    embeds: [
      client
        .embedBuilder(
          client,
          message,
          `🔹 Bot Info`,
          `<:ArrowRightGray:813815804768026705>Prefix: **\`${message.px}\`**
\<:ArrowRightGray:813815804768026705>Commands: **${
            [...client.commands.values()].length
          }**
\<:ArrowRightGray:813815804768026705>Developers: <@237171563760320514> & <@823228305167351808>`,
          "#60b8ff"
        )
        .setAuthor(
          "Bot Info",
          `https://cdn.upload.systems/uploads/6uDK0XAN.png`
        )
        .setThumbnail(
          client.user.displayAvatarURL({ size: 1024, dynamic: true })
        ),
    ],
  });
};
