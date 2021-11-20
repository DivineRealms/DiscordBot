const ms = require('ms');

module.exports = {
    name: 'giveaway',
    description: 'Creates a giveaway.',
    permissions: ["MANAGE_GUILD"],
    cooldown: 0,
    aliases: ['gway'],
    usage: 'giveaway'
}


module.exports.run = async(client, message, args) => {
    const channel = message.mentions.channels.first();
    const [, time, wins, ...prize] = args

    if (!channel || args[0] !== channel.toString()) return message.channel.send(`> Sorry you need to do ${message.px}giveaway <#channel> <time> <total winners> <prize>\nExample: ${message.px}giveaway #giveaways 1d 5 prize`);
    if (!time || isNaN(ms(time))) return message.channel.send('> Please provide a valid duration');
    if (isNaN(wins) || wins <= 0 || wins >= 50) return message.channel.send('> Please provide a valid number of winners from 1-50!');
    if (!prize[0]) return message.channel.send('> You need to enter what you\'re giving away!');

    client.giveaways.start(channel, {
        time: ms(time),
        prize: prize.join(' '),
        winnerCount: wins,

        messages: {
            timeRemaining: "Time remaining: **{duration}**",
            inviteToParticipate: "React with 🎉 to enter",
            winMessage: "Congrats {winners}, you won **{prize}**",
            embedFooter: "Giveaway time!",
            noWinner: "Couldn't determine a winner!",
            embedColor: "BLUE",
            winners: "winner(s)",
            endedAt: "Ends at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    })

    message.author.send(`I have started your giveaway in ${channel}`);
}