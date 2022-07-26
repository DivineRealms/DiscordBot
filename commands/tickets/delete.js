const { AttachmentBuilder, Collection } = require("discord.js");
const fs = require("fs").promises;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "delete",
  category: "tickets",
  usage: "delete",
  description: "Deletes the ticket.",
  permissions: ["ManageChannels"],
  cooldown: 0,
  aliases: [`close`],
  slash: true,
};

module.exports.run = async (client, message, args) => {
  const ticket = await db.get(
    `tickets_${message.guild.id}_${message.channel.id}`
  );
  const log = client.channels.cache.get(client.conf.Logging.Tickets);

  if (!client.conf.Ticket_System.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "Ticket System is not enabled."
        ),
      ],
    });

  const channelMessages = await message.channel.messages
    .fetch({ limit: 100, before: message.id })
    .catch((err) => console.log(err));

  let messageCollection = new Collection();
  messageCollection = messageCollection.concat(channelMessages);

  let msgs = [...messageCollection.values()].reverse();
  let data = await fs.readFile("./data/template.html", "utf8");

  msgs.forEach(async (msg) => {
    let parentContainer = document.createElement("div");
    parentContainer.className = "parent-container";

    let avatarDiv = document.createElement("div");
    avatarDiv.className = "avatar-container";
    let img = document.createElement("img");
    img.setAttribute("src", msg.author.displayAvatarURL());
    img.className = "avatar";
    avatarDiv.appendChild(img);

    parentContainer.appendChild(avatarDiv);

    let messageContainer = document.createElement("div");
    messageContainer.className = "message-container";

    let nameElement = document.createElement("span");
    let name = document.createTextNode(
      msg.author.tag +
        " " +
        msg.createdAt.toDateString() +
        " " +
        msg.createdAt.toLocaleTimeString() +
        " EST"
    );
    nameElement.appendChild(name);
    messageContainer.append(nameElement);

    if (msg.content.startsWith("```")) {
      let m; // code block ovde
      let codeNode = document.createElement("code");
      let textNode = document.createTextNode(m);
      codeNode.appendChild(textNode);
      messageContainer.appendChild(codeNode);
    } else {
      let msgNode = document.createElement("span");
      let textNode = document.createTextNode(msg.content);
      msgNode.append(textNode);
      messageContainer.appendChild(msgNode);
    }
    parentContainer.appendChild(messageContainer);
    data += parentContainer.outerHTML;
  });

  const loggingembed = client
      .embedBuilder(client, message, "Ticket Logging System", "", "#b3e59f")
      .addFields({
        name: `Ticket Name:`,
        value: `${message.channel.name}`,
        inline: false,
      })
      .setAuthor({
        name: "Ticket Logging System",
        value: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
      }),
    attachment = new AttachmentBuilder()
      .setFile(Buffer.from(data))
      .setName(`ticket-${message.channel.name.split("-")[1]}.html`);

  if (log) log.send({ embeds: [loggingembed], files: [attachment] });

  if (!ticket)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "This command can only be used inside of tickets."
        ),
      ],
    });

  message.channel.send({
    embeds: [
      client.embedBuilder(client, message, "", "", "#3db39e").setAuthor({
        name: "This channel will be deleted in 10 seconds.",
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  await new Promise((r) => setTimeout(r, 10000));
  message.channel.delete();
  await db.delete(`tickets_${message.guild.id}_${message.channel.id}`);
};

module.exports.slashRun = async (client, interaction) => {
  const ticket = await db.get(
    `tickets_${interaction.guild.id}_${interaction.channel.id}`
  );
  const log = client.channels.cache.get(client.conf.Logging.Tickets);

  if (!client.conf.Ticket_System.Enabled)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "Ticket System is not enabled."
        ),
      ],
      ephemeral: true,
    });

  const channelMessages = await interaction.channel.messages
    .fetch({ limit: 100, before: interaction.id })
    .catch((err) => console.log(err));

  let messageCollection = new Collection();
  messageCollection = messageCollection.concat(channelMessages);

  let msgs = [...messageCollection.values()].reverse();
  let data = await fs.readFile("./data/template.html", "utf8");

  msgs.forEach(async (msg) => {
    let parentContainer = document.createElement("div");
    parentContainer.className = "parent-container";

    let avatarDiv = document.createElement("div");
    avatarDiv.className = "avatar-container";
    let img = document.createElement("img");
    img.setAttribute("src", msg.author.displayAvatarURL());
    img.className = "avatar";
    avatarDiv.appendChild(img);

    parentContainer.appendChild(avatarDiv);

    let messageContainer = document.createElement("div");
    messageContainer.className = "message-container";

    let nameElement = document.createElement("span");
    let name = document.createTextNode(
      msg.author.tag +
        " " +
        msg.createdAt.toDateString() +
        " " +
        msg.createdAt.toLocaleTimeString() +
        " EST"
    );
    nameElement.appendChild(name);
    messageContainer.append(nameElement);

    if (msg.content.startsWith("```")) {
      let m;
      let codeNode = document.createElement("code");
      let textNode = document.createTextNode(m);
      codeNode.appendChild(textNode);
      messageContainer.appendChild(codeNode);
    } else {
      let msgNode = document.createElement("span");
      let textNode = document.createTextNode(msg.content);
      msgNode.append(textNode);
      messageContainer.appendChild(msgNode);
    }
    parentContainer.appendChild(messageContainer);
    data += parentContainer.outerHTML;
  });

  const loggingembed = client
      .embedBuilder(client, interaction, "Ticket Logging System", "", "#b3e59f")
      .addFields({
        name: `Ticket Name:`,
        value: `${interaction.channel.name}`,
        inline: false,
      })
      .setAuthor({
        name: "Ticket Logging System",
        value: `https://cdn.upload.systems/uploads/4mFVRE7f.png`,
      }),
    attachment = new AttachmentBuilder()
      .setFile(Buffer.from(data))
      .setName(`ticket-${message.channel.name.split("-")[1]}.html`);

  if (log) log.send({ embeds: [loggingembed], files: [attachment] });

  if (!ticket)
    return interaction.reply({
      embeds: [
        client.utils.errorEmbed(
          client,
          interaction,
          "This command can only be used inside of tickets."
        ),
      ],
      ephemeral: true,
    });

  interaction.reply({
    embeds: [
      client.embedBuilder(client, interaction, "", "", "#3db39e").setAuthor({
        name: "This channel will be deleted in 10 seconds.",
        iconURL: `https://cdn.upload.systems/uploads/6KOGFYJM.png`,
      }),
    ],
  });

  await new Promise((r) => setTimeout(r, 10000));
  interaction.channel.delete();
  await db.delete(`tickets_${interaction.guild.id}_${interaction.channel.id}`);
};
