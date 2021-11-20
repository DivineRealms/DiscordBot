const db = require('quick.db')

module.exports = {
    name: 'fish',
    description: 'Go fishing and get some tasty fish.',
    permissions: [],
    cooldown: 0,
    aliases: [],
    usage: 'fish'
}

module.exports.run = async(client, message, args) => {
    let fish = ['dory', 'coho salmon', 'lanternfish', 'catfish', 'shrimp', 'stargazer', 'clown fish', 'cod', 'tropical fish'];
    let amount = Math.floor(Math.random() * 340) + 1;

    message.channel.send({ embeds: [client.embedBuilder(client, message, "Fish", `You have cought ${fish[Math.floor(Math.random() * fish.length)]} and earned $${amount}.`, "YELLOW")] });
    db.add(`money_${message.guild.id}_${message.author.id}`, amount);
}