module.exports = {
  name: "botinfo",
  category: "info",
  description: "Allows you to view information on the bot.",
  permissions: [],
  cooldown: 0,
  aliases: ["binfo", "infobot", "bottinfo"],
  usage: "botinfo",
  slash: true,
};

module.exports.run = async (client, message, args) => {
  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, `🔹 Bot Info`,
        `<:ArrowRightGray:813815804768026705>Prefix: **\`${client.conf.Settings.Prefix}\`**
\<:ArrowRightGray:813815804768026705>Commands: **${
            [...client.commands.values()].length
          }**
\<:ArrowRightGray:813815804768026705>Developers: <@237171563760320514> & <@823228305167351808>`,
          "#60b8ff"
        ).setThumbnail(
          client.user.displayAvatarURL({ size: 1024, dynamic: true })
        ),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, `🔹 Bot Info`,
          `<:ArrowRightGray:813815804768026705>Prefix: **\`${interaction.px}\`**
\<:ArrowRightGray:813815804768026705>Commands: **${
            [...client.commands.values()].length
          }**
\<:ArrowRightGray:813815804768026705>Developers: <@237171563760320514> & <@823228305167351808>`,
          "#60b8ff"
        ).setThumbnail(
          client.user.displayAvatarURL({ size: 1024, dynamic: true })
        ),
    ],
  });
};
