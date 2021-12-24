const db = require("quick.db");

module.exports = {
  name: "buy",
  category: "economy",
  description: "Buy something from the shop.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "buy <item number>",
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.Economy,
    shop = [...settings.Shop_Items],
    item = shop.find((s, i) => i + 1 == args[0]),
    balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);

  if (!item)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(
          client,
          message,
          "You have entered an invalid shop id."
        ),
      ],
    });

  if (item.Type == "role") {
    if (!balance || balance < item.Price)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money."
          ),
        ],
      });

    message.member.roles
      .add([item.Role_ID, "734759761660084268"])
      .then(() => {
        message.channel.send({
          embeds: [
            client
              .embedBuilder(
                client,
                message,
                "",
                `You have successfully purchased role ${item.Name} for $${item.Price}.`,
                "#3db39e"
              )
              .setAuthor(
                "Role Purchased",
                `https://cdn.upload.systems/uploads/6KOGFYJM.png`
              ),
          ],
        });
        db.subtract(
          `money_${message.guild.id}_${message.author.id}`,
          item.Price
        );
      })
      .catch(() => {
        client.utils.errorEmbed(
          client,
          message,
          "Cannot add a role to that member."
        );
      });
  } else if (item.Type == "color") {
    let colors =
      db.fetch(`colors_${message.guild.id}_${message.author.id}`) || [];

    if (!balance || balance < item.Price)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money."
          ),
        ],
      });

    if (colors.includes(item.Name.toLowerCase()))
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You already have that name color."
          ),
        ],
      });

    db.push(
      `colors_${message.guild.id}_${message.author.id}`,
      item.Name.toLowerCase()
    );

    db.subtract(`money_${message.guild.id}_${message.author.id}`, item.Price);
    message.channel.send({
      embeds: [
        client
          .embedBuilder(
            client,
            message,
            "",
            `You have successfully purchased name color ${item.Name} for $${item.Price}.`,
            "#3db39e"
          )
          .setAuthor(
            "Color Purchased",
            `https://cdn.upload.systems/uploads/6KOGFYJM.png`
          ),
      ],
    });
  }
};
