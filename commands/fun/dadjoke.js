const giveMeAJoke = require('discord-jokes');

module.exports = {
    description: 'A classic dad joke that will throw a good chuckle.',
    aliases: ['djoke'],
    usage: 'dadjoke'
}

module.exports.run = async(client, message) => {

    giveMeAJoke.getRandomDadJoke(function(joke) {
        let dadjoke = new client.embed()
            .setTitle(`The good ol\' dad joke... Makes you feel like your dads back from the store.`)
            .setDescription(joke)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
        message.channel.send(dadjoke);
    });
}