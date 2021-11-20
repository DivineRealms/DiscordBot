const { chunk } = require('lodash')
const paginateContent = require('../../utils/paginateContent.js')

module.exports = {
    name: 'shop',
    category: 'economy',
    description: 'View the shop on the server and buy items.',
    permissions: [],
    cooldown: 0,
    aliases: [],
    usage: 'shop'
}

module.exports.run = async(client, message, args) => {
    const settings = client.conf.economy
    const shop = [...settings.shopItems]

    let format = `**#[ID]** [NAME] - $[PRICE]\n> ⁃ [DESCRIPTION]`
    let shopArray = [`To purchase item from shop use \`${message.px}buy [id]\`\n`];
    for(let i = 0; i < shop.length; i++) {
        let desc = shop[i].description.replace('{role}', '<@&' + shop[i].roleID + '>');
        shopArray.push(format.replace("[ID]", i + 1).replace("[PRICE]", shop[i].price).replace("[DESCRIPTION]", desc).replace("[NAME]", shop[i].name))
    }

    paginateContent(client, shopArray, 7, 1, message, "Shop", "BLURPLE")
}