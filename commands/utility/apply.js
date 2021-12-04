module.exports = {
  name: "apply",
  category: "utility",
  description: "Run this command to apply for an application on the server.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "apply",
};

module.exports.run = async (client, message, args) => {
  const applications = client.conf.applicationSystem.applications.filter(
    (s) =>
      !s.Application_Channel || s.Application_Channel === message.channel.id
  );
  const app = applications.find(
    (a) => a.Application_Name.toLowerCase() == args.join(" ").toLowerCase()
  );

  if (!applications.length)
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "There are no applications available in this channel.",
          "error"
        ),
      ],
    });
  if (!app)
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "I can't find Application with that name.",
          "error"
        ),
      ],
    });

  const chan = client.channels.cache.get(app.Application_Log);
  if (!chan)
    return message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Error",
          "Cannot find application log channel.",
          "error"
        ),
      ],
    });
  const msg = await message.author
    .send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Application Process",
          `Please confirm that you would like to start the application by reacting below.\nYou can send \`cancel\` at any time to cancel the application.`
        ),
      ],
    })
    .catch(() => {
      message.channel.send({ content: "> Your DMs are closed" });
    });

  if (!msg) return;
  await msg.react("✅");
  await msg.react("❎");
  const filter = (react, user) => user.id != client.user.id;
  const resp = await msg.awaitReactions({ filter, max: 1, time: 20000 });
  if (!resp.first())
    return msg.channel.send("Time limit exceeded, application cancelled.");
  else if (resp.first().emoji.name !== "✅")
    return msg.channel.send("Application cancelled.");
  const questions = app.questions;
  const answers = [];
  client.processes.set(message.author.id, true);

  for (var i in questions) {
    await msg.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          `Question ${Number(i) + 1}`,
          questions[i]
        ),
      ],
    });
    const resp = await msg.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
    });
    if (!resp.first())
      return msg.channel.send({
        embeds: [
          client.embedBuilder(
            client,
            message,
            "Error",
            "Time limit exceeded, application cancelled.",
            "error"
          ),
        ],
      });
    if (resp.first().content === "cancel")
      return message.channel.send({
        embeds: [
          client.embedBuilder(
            client,
            message,
            "Application",
            "The application has been cancelled."
          ),
        ],
      });
    answers.push(resp.first().content);
  }

  const msg2 = await msg.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        "Application",
        "The application has been completed! Are you sure you wish to apply?"
      ),
    ],
  });
  await msg2.react("✅");
  await msg2.react("❎");

  const resp2 = await msg2.awaitReactions({ filter, max: 1, time: 20000 });
  if (!resp2.first())
    return msg.channel.send("Time limit exceeded, application cancelled.");
  else if (resp2.first().emoji.name !== "✅")
    return msg.channel.send("Application cancelled.");

  const embed2 = client.embedBuilder(
    client,
    message,
    `New application from ${message.author.tag}`,
    ""
  );

  for (let i = 0; i < questions.length; i++) {
    embed2.addField(`${questions[i]}`, `${answers[i]}`);
  }

  msg.channel.send({
    embeds: [
      client.embedBuilder(
        client,
        message,
        "Application Complete",
        "✅ Your application has been successfully submitted."
      ),
    ],
  });
  client.processes.delete(message.author.id);

  await chan.send({ embeds: [embed2] });
};
