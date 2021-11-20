const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: 'eval',
    category: 'owner',
    description: 'Lets you run some javascript via discord. (DANGEROUS | ONLY USE IF YOU KNOW WHAT YOU\'RE DOING!)',
    permissions: [],
    cooldown: 0,
    aliases: [],
    usage: 'eval <code>'
}

module.exports.run = async(client, message, args) => {
    if (!client.conf.settings.BotOwnerDiscordID.includes(message.author.id)) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You're not Owner`, "RED")] });

    const code = args.join(" ");
    if (!code) return message.channel.send({ embeds: [client.embedBuilder(client, message, "Error", `You need to enter code to evaulate`, "RED")] });
    try {        
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        let embed = new Discord.MessageEmbed()
            .setTitle("Eval")
            .addField("Input", `\`\`\`${code}\`\`\``)
            .setColor("GREEN");

        if(evaled.length >= 1024) {
            const { key } = await fetch("https://www.toptal.com/developers/hastebin/documents", {
            method: "POST",
            body: evaled
          }).then((res) => res.json());
            embed.addField("Output", `\`\`\`xl\nhttps://www.toptal.com/developers/hastebin/raw/${key}\`\`\``)
        } else {
            embed.addField("Output", `\`\`\`xl\n${evaled}\`\`\``)
        }

        message.channel.send({ embeds: [embed] })
      } catch (err) {
        let embed = new Discord.MessageEmbed()
            .setAuthor("Error")
            .addField("Input", `\`\`\`xl\n${code}\`\`\``)
            .addField("Output", `\`\`\`xl\n${err}\`\`\``)
            .setColor("RED");

        message.channel.send({ embeds: [embed] })
    }
}