module.exports = (client, player) => {
    const status = (queue) => `Volume: ${queue.volume}% | Filter: ${queue.filter || 'Off'} | Loop: ${queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off'} | Autoplay: ${queue.autoplay ? 'On' : 'Off'}`;

    player
        .on('playSong', (message, queue, song) =>
            message.channel.send(
                new client.embed().setDescription(`Now Playing [${song.name}](${song.url})`)
                .addField('Duration', song.formattedDuration, true)
                .addField('Requested by:', song.user, true)
                .addField('Video Settings', status(queue))
                .setThumbnail(song.thumbnail)
                .setFooter('Fuel Development')
            ))
        .on('addSong', (message, queue, song) =>
            message.channel.send(new client.embed().setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${message.author}`)))
        .on('playList', (message, queue, playlist, song) => message.channel.send(
            new client.embed().setDescription(`Playing playlist \`${playlist.title}\` (${playlist.total_items} songs).\nRequested by: ${message.author}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`)))
        .on('addList', (message, queue, playlist) => message.channel.send(new client.embed().setDescription(`Added playlist \`${playlist.title}\` (${playlist.total_items} songs) to queue\n${status(queue)}`)))
        .on('error', () => {})
}