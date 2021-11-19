const db = require('quick.db')

module.exports = {
    description: 'Go hunting and get some food.',
    permissions: [],
    aliases: [],
    usage: 'hunt'
}

module.exports.run = async(client, message, args) => {
    let hunt = ['deer', 'lamb', 'bear', 'cow', 'sheep', 'pig', 'elephant', 'ostrich', 'wolf'];
    let caught = random(0, 2);

    if (caught) {
      let amount = Math.floor(Math.random() * 260) + 1;
      message.channel.send({ embeds: [client.embedBuilder(client, message, "Hunt", `After hunting for few hours you got ${hunt[Math.floor(Math.random() * hunt.length)]} and earned ${amount}.`, "YELLOW")] });

      db.add(`money_${message.guild.id}_${message.author.id}`, amount);
    } else {
      message.channel.send({ embeds: [client.embedBuilder(client, message, "Hunt", `After few hours you cought nothing.`, "YELLOW")] });
    }
}