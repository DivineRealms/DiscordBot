module.exports = {
    description: 'Check your balance on the server.',
    aliases: ['bal'],
    usage: 'balance [@User]'
}

module.exports.run = async(client, message, args) => {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    
    let bank = db.fetch(`bank_${message.guild.id}_${user.id}`);
    let balance = db.fetch(`money_${message.guild.id}_${user.id}`);

    let embed = client.embedBuilder(client, message, "Balance", `User: ${user}
Bank: ${bank}
Balance: ${balance}
Total: ${balance + bank}`, "YELLOW");

  message.channel.send({ embeds: [embed] })
}