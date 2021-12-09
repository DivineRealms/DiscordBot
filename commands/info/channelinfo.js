module.exports = {
  name: "channelinfo",
  category: "info",
  description: "Allows you to view information on a channel.",
  permissions: [],
  cooldown: 0,
  aliases: ["cinfo", "infochannel"],
  usage: "channelinfo <#channel>",
};

module.exports.run = async (client, message, args) => {
  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#60b8ff")
        .setAuthor(
          `${message.channel.name} (${message.channel.id})`,
          `https://cdn.upload.systems/uploads/6uDK0XAN.png`
        )
        .addField(
          "Information",
          `<:ArrowRightGray:813815804768026705>Channel Name: ${message.channel.name} 
<:ArrowRightGray:813815804768026705>Channel ID: **${message.channel.id}**
<:ArrowRightGray:813815804768026705>Channel Type: **${message.channel.type}**
<:ArrowRightGray:813815804768026705>NSFW: \`${message.channel.nsfw}\``,
          false
        )
        .addField(
          "More Informations:",
          `<:ArrowRightGray:813815804768026705>Position: **${
            message.channel.position
          }**
<:ArrowRightGray:813815804768026705>Last Message ID: **${
            message.channel.lastMessageID ||
            (await message.channel.messages.fetch({ limit: 1 })).first().id
          }**
<:ArrowRightGray:813815804768026705>Topic: **${
            message.channel.topic || "No Topic Set!"
          }** 
<:ArrowRightGray:813815804768026705>Last Message Pinned: <t:${
            Math.round(message.channel.lastPinTimestamp / 1000) || "none"
          }:R>`,
          false
        ),
    ],
  });
};
