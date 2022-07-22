const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

module.exports = async (client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  const message = reaction.message;
  if (user.bot || !reaction.message.guild) return;
  const starboard = client.conf.Starboard;
  const schannel = client.channels.cache.get(starboard.Channel);
  const suggestion = await db.get(`suggestion_${reaction.message.id}`);

  if (["✅", "❌"].includes(reaction.emoji.name) && suggestion) {
    const user2 = await client.users.fetch(suggestion.user);
    const embed = client
      .embedBuilder(
        client,
        message,
        "Suggestion",
        `**Suggestion by ${user2}**\n\n Suggestion: \`${
          suggestion.suggestion
        }\`\n\n**Status:**\n${
          reaction.emoji.name === "✅" ? "Approved" : "Denied"
        } by ${user}`,
        reaction.emoji.name === "✅" ? "GREEN" : "RED"
      )
      .setThumbnail(user2.displayAvatarURL({ dynamic: true }));

    user2.send({ embeds: [embed] }).catch(console.error);
    reaction.message.channel.send({ embeds: [embed] });
    await db.delete(`suggestion_${reaction.message.id}`);
  }

  if (starboard.Enabled && reaction.message) {
    const r = await reaction.message.reactions.resolve("⭐");
    if (
      schannel &&
      starboard.Enabled &&
      reaction.emoji.name == starboard.Emoji
    ) {
      const stars = await db.get(
        `stars_${reaction.message.guild.id}_${reaction.message.id}`
      );

      if (stars) {
        const board = await schannel.messages.fetch(stars).catch(() => {});
        if (!board)
          return await db.delete(
            `stars_${reaction.message.guild.id}_${reaction.message.id}`
          );
        board.content = `\`${starboard.Emoji}\` ${r.count}︲<#${reaction.message.channel.id}>`;
        board.edit({ content: `${board}` });
      } else if (reaction.count >= starboard.Minimum_Reactions) {
        const embed = new Discord.EmbedBuilder()
          .setAuthor({
            name: reaction.message.author.tag,
            iconURL: reaction.message.author.displayAvatarURL({
              size: 1024,
              dynamic: true,
            })
          })
          .setColor("#ffac33");

        if (reaction.message.content)
          embed.setDescription(
            `<:ArrowRightGray:813815804768026705>${reaction.message.content}\n\n[**Click here to view the message**](${reaction.message.url})`
          );
        if (
          ["png", "jpg", "jpeg", "gif", "webp"].some((e) =>
            (reaction.message.attachments.first() || { url: "" }).url.endsWith(
              e
            )
          )
        )
          embed
            .setImage(reaction.message.attachments.first().url)
            .setDescription(
              reaction.message.content
                ? `${reaction.message.content}\n\n[**Click here to view the message**](${reaction.message.url})`
                : `\n\n[**Click here to view the message**](${reaction.message.url})`
            );
        let msg = await schannel.send({
          embeds: [embed],
          content: `\`${starboard.Emoji}\` ${r.count}︲<#${reaction.message.channel.id}>`,
        });
        await db.set(
          `stars_${reaction.message.guild.id}_${reaction.message.id}`,
          msg.id
        );
      }
    }
  }

  const panelList = await db.get(`panels_${reaction.message.guild.id}`) || [];
  const panel = panelList.includes(reaction.message.id);
  const settings = client.conf.Ticket_System;
  if (!panel || reaction.emoji.name != "✉️") return;

  const tickets =
    (await db.all())
      .filter((i) =>
        i.id.startsWith(`tickets_${reaction.message.guild.id}_`)
      ) || [];
  if (tickets.find((u) => u.value.includes(user.id)))
    return reaction.users.remove(user.id);

  reaction.users.remove(user.id);

  const num = Object.entries(tickets).length || 1;
  const ticketNumber = "0".repeat(4 - num.toString().length) + num;
  const permissions = settings.Support_Roles.map((r) => ({
    id: r,
    allow: ["ViewChannel"],
  }));

  const channel = await reaction.message.guild.channels.create(
    settings.Name.replace("{number}", ticketNumber).replace(
      "{username}",
      user.username
    ),
    {
      parent: settings.Category,
      permissionOverwrites: [
        {
          id: reaction.message.guild.id,
          deny: "ViewChannel",
        },
        { id: user.id, allow: "ViewChannel" },
        ...permissions,
      ],
    }
  );

  channel.send({
    content: user.toString(),
    embeds: [
      client
        .embedBuilder(
          client,
          "",
          "",
          "<:ArrowRightGray:813815804768026705>A staff member will be with you shortly.",
          "#b3e59f"
        )
        .setAuthor({
          name: "Thank you for creating a ticket",
          iconURL: `https://cdn.upload.systems/uploads/4mFVRE7f.png`
        }),
    ],
  });

  await db.set(`tickets_${reaction.message.guild.id}_${channel.id}`, user.id);
};
