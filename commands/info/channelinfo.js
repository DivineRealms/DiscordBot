const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "channelinfo",
  category: "info",
  description: "Allows you to view information on a channel.",
  permissions: [],
  cooldown: 0,
  aliases: ["cinfo", "infochannel"],
  usage: "channelinfo <#channel>",
  slash: true,
  options: [{
    name: "channel",
    description: "Channel which info to see",
    type: ApplicationCommandOptionType.Channel,
    required: false
  }]
};

module.exports.run = async (client, message, args) => {
  const channel = message.mentions.channels.first() 
  || message.guild.channels.cache.get(args[0]) || message.channel;
  message.channel.send({
    embeds: [
      client
        .embedBuilder(client, message, "", "", "#60b8ff")
        .setAuthor({
          name: `${channel.name} (${channel.id})`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        })
        .addFields([{
          name: "Information",
          value: `<:ArrowRightGray:813815804768026705>Channel Name: ${channel.name} 
<:ArrowRightGray:813815804768026705>Channel ID: **${channel.id}**
<:ArrowRightGray:813815804768026705>Channel Type: **${channel.type}**
<:ArrowRightGray:813815804768026705>NSFW: **\`${channel.nsfw}\`**`,
          inline: false
        }, {
          name: "More Informations:",
          value: `<:ArrowRightGray:813815804768026705>Position: **${
            channel.position
          }**
<:ArrowRightGray:813815804768026705>Last Message ID: **${
            channel.lastMessageID ||
            (await channel.messages.fetch({ limit: 1 })).first().id
          }**
<:ArrowRightGray:813815804768026705>Topic: **${
            channel.topic || "No Topic Set!"
          }** 
<:ArrowRightGray:813815804768026705>Last Message Pinned: <t:${
            Math.round(channel.lastPinTimestamp / 1000) || "none"
          }:R>`,
          inline: false
        }]),
    ],
  });
};

module.exports.slashRun = async (client, interaction) => {
  const channel = interaction.options.getChannel("channel") || interaction.channel;

  interaction.reply({
    embeds: [
      client
        .embedBuilder(client, interaction, "", "", "#60b8ff")
        .setAuthor({
          name: `${channel.name} (${channel.id})`,
          iconURL: `https://cdn.upload.systems/uploads/6uDK0XAN.png`,
        })
        .addFields([{
          name: "Information",
          value: `<:ArrowRightGray:813815804768026705>Channel Name: ${channel.name} 
<:ArrowRightGray:813815804768026705>Channel ID: **${channel.id}**
<:ArrowRightGray:813815804768026705>Channel Type: **${channel.type}**
<:ArrowRightGray:813815804768026705>NSFW: **\`${channel.nsfw}\`**`,
          inline: false
        }, {
          name: "More Informations:",
          value: `<:ArrowRightGray:813815804768026705>Position: **${
            channel.position
          }**
<:ArrowRightGray:813815804768026705>Last Message ID: **${
            channel.lastMessageID ||
            (await channel.messages.fetch({ limit: 1 })).first().id
          }**
<:ArrowRightGray:813815804768026705>Topic: **${
            channel.topic || "No Topic Set!"
          }** 
<:ArrowRightGray:813815804768026705>Last Message Pinned: <t:${
            Math.round(channel.lastPinTimestamp / 1000) || "none"
          }:R>`,
          inline: false
        }]),
    ],
  });
};
