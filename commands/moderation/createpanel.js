module.exports = {
  name: "createpanel",
  category: "moderation",
  description: "Creates the ticket panel message!",
  permissions: ["ManageGuild"],
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
      `<:ArrowRightGray:813815804768026705>Please react with the emoji to create a ticket.
<:ArrowRightGray:813815804768026705>A staff member will be with you shortly.`, "#b3e59f"
    )
    .setAuthor({
      name: `Create a Ticket`,
      iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`
    });

  const msg = await message.channel.send({ embeds: [embed] });
  await msg.react("✉️").catch(() => msg.react("✉️"));

  let panels = await client.db.get(`panels_${message.guild.id}`) || [];
  panels.unshift(`${msg.id}`)

  await client.db.set(`panels_${message.guild.id}`, panels);
};
