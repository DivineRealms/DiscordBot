module.exports = {
  name: "createpanel",
  category: "moderation",
  description: "Creates the ticket panel message!",
  permissions: ["MANAGE_GUILD"],
  cooldown: 0,
  aliases: [`cpcreate`, `panelcreate`],
  usage: "createpanel",
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.ticketSystem;

  message.channel
    .send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          settings.Panel_Title,
          settings.Panel_Message
        ),
      ],
    })
    .react(settings.Panel_Emoji)
    .catch(() => msg.react("✉️"));

  client.settings.push(message.guild.id, msg.id, "panels");
};
