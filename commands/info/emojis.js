module.exports = {
    name: 'emojis',
    category: 'info',
    description: 'Lets you view all the emojis in the guild.',
    permissions: [],
    cooldown: 0,
    aliases: ['emoji', 'whatstheemojis'],
    usage: 'emojis'
}

module.exports.run = async(client, message, args) => {

    let TEHEMOJIS = "";
    let AnimeOnesLolDisplaying = "";
    let RegularEmojis = 0;
    let AnimeOnesLol = 0;
    let totalemojislol = 0;

    function Emoji(id) {
        return client.emojis.cache.get(id).toString();
    }
    message.guild.emojis.cache.forEach((emoji) => {
        totalemojislol++;
        if (emoji.animated) {
            AnimeOnesLol++;
            AnimeOnesLolDisplaying += Emoji(emoji.id);
        } else {
            RegularEmojis++;
            TEHEMOJIS += Emoji(emoji.id);
        }
    });
    let emojiss = new client.embed()
        .setTitle(`Emojis in ${message.guild.name}`, false)
        .addField(`Regular Emojis`, `${RegularEmojis}`, false)
        .addField(`Animated Emojis`, `${AnimeOnesLol}`, false)
        .addField(`Emojis Displaying`, `${AnimeOnesLolDisplaying} ${TEHEMOJIS}`, false)
        .addField(`Total Count Of Emojis`, `${totalemojislol}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }));
    message.channel.send({ embeds: [emojiss] })
}