const db = require('quick.db')

module.exports = {
    name: 'buy',
    description: 'Buy something from the shop.',
    permissions: [],
    cooldown: 0,
    aliases: [],
    usage: 'buy <item number>'
}

module.exports.run = async(client, message, args) => {
    const settings = client.conf.economy
    let balance = db.fetch(`money_${message.guild.id}_${message.author.id}`);
    const shop = [...settings.shopItems]
    const item = shop.find((s, i) => i + 1 == args[0])

    if (!item) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You have entered invalid shop id.`, "RED")] });
    if (item.type == 'role') {
        if(!balance || balance < item.price) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have enough money.`, "RED")] });
        message.member.roles.add(item.roleID).then(() => {
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Role Purchased", `You have successfully purchased role <@&${item.roleID}> for $${item.price}.`, "YELLOW")] });
            db.subtract(`money_${message.guild.id}_${message.author.id}`, item.price);
        }).catch(() => {
            message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `Cannot add role to that member`, "RED")] });
        })
    } else if(item.type == "color") {
        let colors = db.fetch(`colors_${message.guild.id}_${message.author.id}`) || [];
        if(!balance || balance < item.price) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You don't have enough money.`, "RED")] });
        if(colors.includes(item.name)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You already have that name color.`, "RED")] });

        db.push(`colors_${message.guild.id}_${message.author.id}`, item.name);
        message.channel.send({ embeds: [client.embedBuilder(client, message, "Color Purchased", `You have successfully purchased name color **${item.name}** for $${item.price}.`, "YELLOW")] });
    }
}