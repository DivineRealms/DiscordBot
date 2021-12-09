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

  const embed = client
    .embedBuilder(client, message, "", settings.Panel_Message)
    .setAuthor(settings.Panel_Title, `https://i.imgur.com/A6ou6sG.png`);

  const msg = await message.channel.send({ embeds: [embed] });
  await msg.react(settings.Panel_Emoji).catch(() => msg.react("✉️"));

  client.settings.push(message.guild.id, msg.id, "panels");
};
