const paginateContent = require("../../utils/paginateContent.js");

module.exports = {
  name: "shop",
  category: "economy",
  description: "View the shop on the server and buy items.",
  permissions: [],
  cooldown: 0,
  aliases: [],
  usage: "shop",
};

module.exports.run = async (client, message, args) => {
  const settings = client.conf.Economy,
    shop = [...settings.Shop_Items];

  let format = `\`[ID].\` **[NAME]**︲$[PRICE]\n<:ArrowRightGray:813815804768026705>[DESCRIPTION]`,
    shopArray = [
      `<:ArrowRightGray:813815804768026705>Command: **\`${message.px}buy [id]\`**.\n`,
    ];

  if (!settings.Enabled)
    return message.channel.send({
      embeds: [
        client.utils.errorEmbed(client, message, "Economy is not enabled."),
      ],
    });

  for (let i = 0; i < shop.length; i++) {
    let desc = shop[i].description.replace(
      "{role}",
      "<@&" + shop[i].roleID + ">"
    );

    shopArray.push(
      format
        .replace("[ID]", i + 1)
        .replace("[PRICE]", shop[i].price)
        .replace("[DESCRIPTION]", desc)
        .replace("[NAME]", shop[i].name)
    );
  }

  paginateContent(client, shopArray, 7, 1, message, "Shop", "BLURPLE");
};
