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
  const settings = client.conf.economy,
    shop = [...settings.shopItems],
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

  if (item.type == "role") {
    if (!balance || balance < item.price)
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
      .add([item.roleID, "734759761660084268"])
      .then(() => {
        message.channel.send({
          embeds: [
            client.embedBuilder(
              client,
              message,
              "Role Purchased",
              `You have successfully purchased role <@&${item.roleID}> for $${item.price}.`,
              "#3db39e"
            ),
          ],
        });
        db.subtract(
          `money_${message.guild.id}_${message.author.id}`,
          item.price
        );
      })
      .catch(() => {
        client.utils.errorEmbed(
          client,
          message,
          "Cannot add a role to that member."
        );
      });
  } else if (item.type == "color") {
    let colors =
      db.fetch(`colors_${message.guild.id}_${message.author.id}`) || [];

    if (!balance || balance < item.price)
      return message.channel.send({
        embeds: [
          client.utils.errorEmbed(
            client,
            message,
            "You don't have enough money."
          ),
        ],
      });

    if (colors.includes(item.name.toLowerCase()))
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
      item.name.toLowerCase()
    );

    db.subtract(`money_${message.guild.id}_${message.author.id}`, item.price);
    message.channel.send({
      embeds: [
        client.embedBuilder(
          client,
          message,
          "Color Purchased",
          `You have successfully purchased name color **${item.name}** for $${item.price}.`,
          "#3db39e"
        ),
      ],
    });
  }
};
