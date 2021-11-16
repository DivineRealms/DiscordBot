const { Message } = require("discord.js")

module.exports = async client => {
        console.log(`\x1b[34m` + "[INFO] All Commands and Events Loaded!")
        console.log(`\x1b[35m` + "[INFO] Guilds Prefix: " + client.conf.settings.prefix)
        console.log(`\x1b[34m` + "[Thank You] We thank you for purchasing the new bot, we hope you enjoy it!")
        console.log(`\x1b[35m` + "[Creator] Made By Fuel Development")
        console.log(`\x1b[34m` + "[Support] If you require support you can go to fueldevelopment.net/discord or use discord.gg/VstQPFP\x1b[0m")

        if (!client.conf.settings.changingActivity.enabled) client.user.setPresence(client.conf.settings.botActivity)
        else {
            const settings = client.conf.settings.changingActivity
            let i = -1;
            let interval = setInterval(() => {
                if (!settings.enabled) return clearInterval(interval)
                if (!settings.activities[++i]) i = -1
                client.user.setActivity(settings.activities[++i], { type: settings.types[i] })
            }, 10000);
        }

        const guild = client.guilds.cache.get(client.conf.settings.GuildID)
		client.members.ensure(guild.id, {})
        const members = Object.entries(client.members.get(guild.id))
        client.settings.ensure(guild.id, client.defaultSettings)
        for (var [a, b] of members)
            if (b.muted.muted && b.muted.mutedAt) timeout(client, guild, a, b)

        function counter() {
            const memberCount = client.channels.cache.get(client.conf.automation.Member_Count_Channel)
            const channelCount = client.channels.cache.get(client.conf.automation.Channel_Count_Channel)

            if (memberCount) memberCount.setName(client.conf.automation.Member_Count_Message.replace('{count}', guild.memberCount))
            if (channelCount) channelCount.setName(client.conf.automation.Channel_Count_Message.replace('{count}', guild.channels.cache.size))
        }

        function birthday() {
            const isToday = d => d ? new Date().getDate() === new Date(d).getDate() && new Date().getMonth() === new Date(d).getMonth() : false
            const settings = client.conf.birthdaySystem
            const channel = client.channels.cache.get(settings.birthdayChannel)
            const today = new Date().getMonth() + ' ' + new Date().getDate()
            if (!settings.enabled || client.settings.get(guild.id, 'birthday') === today) return

            const birthdays = Object.entries(client.members.get(guild.id)).filter((a) => isToday(a[1].birthday))
            if (!birthdays.length || client.settings.get(guild.id, 'birthday')) return

            const embed = new client.embed()
                .setTitle('Todays Birthdays!')
                .setDescription(`${settings.birthdayMessage}\n${birthdays.map(s => `<@${s[0]}>`).join(' ')}`)

            if (!channel) return 
            channel.send(embed)
            client.settings.set(guild.id, today, 'birthday') 
        }

        while (guild) {
            birthday()
            counter()
            await new Promise(r => setTimeout(r, 310000))
        }
}

const timeout = (client, guild, a, b) => setTimeout(() => guild.members.fetch(a).then(m => m.roles.remove(client.conf.moderation.Mute_Role).catch(console.log)).catch(console.log), b.muted.mutedAt < Date.now() ? 1 : b.muted.mutedAt - Date.now());