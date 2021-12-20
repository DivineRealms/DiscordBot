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
  const settings = client.conf.Ticket_System;

  if (!settings.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Economy is not enabled."),
      ],
    });

  const embed = client
    .embedBuilder(
      client,
      message,
      "",
      `<:ArrowRightGray:813815804768026705>A staff member will be with you shortly.`,
      "#b3e59f"
    )
    .setAuthor(
      `Thank you for creating a ticket`,
      `https://cdn.upload.systems/uploads/4mFVRE7f.png`
    );

  const msg = await message.channel.send({ embeds: [embed] });
  await msg.react(settings.Panel_Emoji).catch(() => msg.react("✉️"));

  client.settings.push(message.guild.id, msg.id, "panels");
};
