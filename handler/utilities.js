const sticky = new(require('enmap'))()
const { readdirSync } = require('fs')
const spam = new(require('enmap'))()
const ms = require('ms')

module.exports.dj = (client, message, cmd) => {
    const cmdd = client.commands.find((c, n) => n === cmd || c.aliases && c.aliases.includes(cmd))
    if (cmdd.category !== 'music') return
    if (!client.conf.music.Enable_DJ) return
    if (!message.dj && !client.conf.music.Allowed_User_Commands.includes(cmd)) return message.channel.send(new client.embed().setDescription('This command has been restricted to DJ\'s only!'))
    if (message.dj && client.conf.music.Disabled_DJ_Commands.includes(cmd)) return message.channel.send(new client.embed().setDescription('This music command isnt enabled!'))
    return
}

module.exports.dms = async(client, message) => {
    if (client.conf.user_dms.enabled && !client.processes.get(message.author.id)) {
        const guild = client.guilds.cache.get(client.conf.settings.GuildID)
        client.settings.ensure(guild.id, client.defaultSettings)

        const data = client.settings.get(guild.id, `dms.${message.author.id}`) || {}
        const dmChannel = client.channels.cache.get(data.channel)
        const embed = new client.embed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dyanmic: true }))
            .setDescription(`**Dm from:**\n${message.author.tag} (${message.author.id})\n\n**Message:**\n${message.content}`)
            .setThumbnail(message.author.displayAvatarURL({ dyanmic: true }))
            .setFooter(`${guild.name} | Made By Fuel#2649`, guild.iconURL({ dynamic: true }))

        if (!dmChannel) {
            const channel = await guild.channels.create(client.conf.user_dms.Dm_Channel_Name.replace('{username}', message.author.username), {
                parent: client.conf.user_dms.DMCategory,
                permissionOverwrites: [
                    { id: guild.id, deny: 'VIEW_CHANNEL' },
                    ...client.conf.user_dms.View_DmChannel_roles.map(s => ({ id: s, allow: 'VIEW_CHANNEL' }))
                ]
            })
            await channel.send(embed)
            channel.send(new client.embed().setDescription(`Any messages sent here will be delivered to ${message.author}`))
            client.settings.set(guild.id, { channel: channel.id, user: message.author.id }, `dms.${message.author.id}`)
        } else {
            dmChannel.send(embed)
        }
    }
}

module.exports.automod = async(client, message) => {
    client.members.ensure(message.guild.id, {})
    client.members.ensure(message.guild.id, client.memberSettings, message.author.id)

    message.dj = message.member.roles.cache.has(client.conf.music.DJrole) || client.conf.music.user_DJs.includes(message.author.id)
    message.px = client.settings.ensure(message.guild.id, client.defaultSettings).prefix
    message.coin = client.conf.economy.currencySymbol

    const settings = client.conf.automod
    const upper = message.content.match(/[A-Z]/g) || []
    const percent = ~~(upper.length / message.content.length * 100)
    const attch = settings.Banned_Attachments.find(a => (message.attachments.first() || { url: '' }).url.endsWith(a))
    const msgs = spam.ensure(message.author.id, 1)
    const stick = client.settings.get(message.guild.id, `sticky.${message.channel.id}`)
    const totalPings = message.mentions.users.size + message.mentions.roles.size + message.mentions.channels.size
    const replies = client.settings.get(message.guild.id, 'replies')
    const reacts = client.settings.get(message.guild.id, 'reacts')
    spam.inc(message.author.id)

    if (message.mentions.users.first() && client.afk.has(message.mentions.users.first().id)) {
        const user = message.mentions.users.first()

        const embed5 = new client.embed()
            .setTitle(`${user.username} is currently afk`)
            .setDescription(`**Reason:** ${client.afk.get(user.id).message}\n**Time they went afk:** ${ms(Date.now() - client.afk.get(user.id).time, { long: true })} ago`)
            .setFooter(`${message.channel.guild.name} | Made By Fuel#2649`, message.channel.guild.iconURL({ dynamic: true }))

        message.channel.send(embed5)
    }

    if (settings.Max_User_Pings && message.mentions.users.size > settings.Max_User_Pings) {
        await message.delete()
        return message.channel.send(new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_User_Pings} users at once!`))
    } else if (settings.Max_Role_Pings && message.mentions.roles.size > settings.Max_Role_Pings) {
        await message.delete()
        return message.channel.send(new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Role_Pings} roles at once!`))
    } else if (settings.Max_Channel_Pings && message.mentions.channels.size > settings.Max_Channel_Pings) {
        await message.delete()
        return message.channel.send(new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Channel_Pings} channels at once!`))
    } else if (settings.Max_Total_Pings && totalPings > settings.Max_Total_Pings) {
        await message.delete()
        return message.channel.send(new client.embed().setDescription(`Sorry but you cant ping more than ${settings.Max_Total_Pings} times in 1 message!`))
    }

    const trigger = Object.keys(replies).find(r => message.content.toLowerCase().includes(r))
    if (trigger && !message.content.startsWith(message.px)) message.channel.send(replies[trigger].response)

    const trigger2 = Object.keys(reacts).find(r => message.content.toLowerCase().includes(r))
    if (trigger2 && !message.content.startsWith(message.px))
        for (var i of reacts[trigger2].emojis) await message.react(i)

    if (message.content !== `${message.px}closedm`) {
        const dmChannel = Object.entries(client.settings.get(message.guild.id, 'dms')).find(([, obj]) => obj.channel === message.channel.id)

        if (dmChannel) {
            const user = await client.users.fetch(dmChannel[1].user).catch(() => {})
            if (user) {
                await message.react('✅')
                const react = await message.channel.send(new client.embed().setDescription('React with \`✅\` to send the message.'))
                const choice = await message.awaitReactions((_, u) => u.id === message.author.id, { max: 1, time: 10000 })
                if (!choice.first() || choice.first().emoji.name !== '✅') return react.delete()
                react.delete()
                user.send(new client.embed().setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription(`**Message from staff member:**\n${message.author.tag}\n\n**Message:**\n${message.content}`)).then(() =>
                    message.channel.send(new client.embed().setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setTitle('Successfully sent your message!').addField('Message:', message.content).addField('Sent to', `${user.tag}!`).setFooter(`Staff Member: ${message.author.username} | Made By Fuel#2649`))
                ).catch(() =>
                    message.channel.send(new client.embed().setDescription(`Failed to send this user a dm! This user has their dms off or the user isnt in this server.\n\nYou can close the channel with \`${message.px}closedm\``))
                )
            } else client.settings.delete(message.guild.id, `dms.${dmChannel[0]}`)
        }
    }

    if (client.conf.leveling.enabled) {
        const levelSettings = client.conf.leveling
        const gen = [10, 15],
            max = 15;

        if (message.attachments.first()) gen[1] += 10
        gen[1] += ~~(message.content.length / 100)

        const { xp, level, totalXP } = client.members.get(message.guild.id, `${message.author.id}.xp`)
        const amount = ~~(Math.random() * (gen[1] - gen[0])) + gen[0]

        client.members.set(message.guild.id, totalXP + amount, `${message.author.id}.xp.totalXP`)
        client.members.set(message.guild.id, xp + amount, `${message.author.id}.xp.xp`)

        if ((level || 1) * 500 < xp) {
            client.members.set(message.guild.id, { level: level + 1, xp: 0, totalXP }, `${message.author.id}.xp`)
            const xpChannel = levelSettings.level_Up_Channel === 'current' ? message.channel : message.guild.channels.cache.get(levelSettings.level_Up_Channel)
            const reward = levelSettings.level_Up_Roles.find(({ level: l }) => l === level + 1)
            if (reward) message.member.roles.add(reward.role).catch(() => {})

            const embed = new client.embed()
                .setAuthor(levelSettings.level_Up_Title)
                .setDescription(levelSettings.level_Up_Message.replace('{user}', message.author.toString()).replace('{level}', level + 1))
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setTimestamp()

            if (xpChannel) xpChannel.send(embed)
        }
    }

    if (message.channel.id === client.conf.counting.Counting_Channel) {
        const { current, last } = client.settings.get(message.guild.id, 'counting')

        if (message.content != current) {
            message.delete()
            if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number) client.settings.set(message.guild.id, 1, 'counting.current')
            return message.channel.send(new client.embed().setDescription(
                client.conf.counting.Wrong_Number_Message.replace('{username}', message.author.username).replace('{number}', current) + '\n' + (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number ? client.conf.counting.Restart_Message : '')
            )).then(msg => msg.delete({ timeout: 7000 }))
        }

        if (client.conf.counting.One_At_A_Time && last === message.author.id && current !== 1) {
            message.delete()
            if (current !== 1 && client.conf.counting.Restart_On_Incorrect_Number) client.settings.set(message.guild.id, 1, 'counting.current')
            return message.channel.send(new client.embed().setDescription(client.conf.counting.One_At_A_Time_Message.replace('{username}', message.author.username) + '\n' +
                (client.conf.counting.Restart_On_Incorrect_Number && current !== 1 ? client.conf.counting.Restart_Message : ''))).then(msg => msg.delete({ timeout: 7000 }))
        }

        if (client.conf.counting.React_On_Message) message.react(client.conf.counting.Reaction)
        client.settings.inc(message.guild.id, 'counting.current')
        client.settings.set(message.guild.id, message.author.id, 'counting.last')
    }

    if (msgs >= 5 && settings.Enable_Spam) {
        if (settings.Bypass_Spam_Channels.includes(message.channel.id)) return
        if (settings.Bypass_Spam_Roles.some(r => message.member.roles.cache.has(r))) return
        message.member.roles.add(client.conf.moderation.Mute_Role).then(() => {
            message.channel.send(new client.embed().setDescription(client.resolveMember(settings.Spam_Message, message.author)))
            spam.delete(message.author.id)
        }).catch(() => {})
    } else if (msgs === 1) setTimeout(() => spam.delete(message.author.id), 7000);

    if (stick) {
        const stick2 = sticky.ensure(message.channel.id, 0)
        sticky.inc(message.channel.id)

        if (stick2 === 0 || stick2 === 1 || stick2 >= 5) {
            const msg2 = await message.channel.messages.fetch(stick.id).catch(() => {})
            if (!msg2) return client.settings.delete(message.guild.id, `sticky.${message.channel.id}`)
            console.log(stick)
            msg2.delete()
            let msg3 = await message.channel.send(new client.embed().setTitle(stick.content[0]).setDescription(stick.content[1]))
            client.settings.set(message.guild.id, msg3.id, `sticky.${message.channel.id}.id`)
        }

        setTimeout(async() => {
            if (sticky.get(message.channel.id) === stick2 + 1 || sticky.get(message.channel.id) >= 4)
                sticky.delete(message.channel.id)
        }, 2000)
    }

    if (settings.Caps_Limit.match(/\d/g) && percent > settings.Caps_Limit.match(/\d+/g)[0] && message.content.length >= settings.Caps_Minimum_Characters) {
        if (settings.Bypass_Caps_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send(new client.embed().setDescription(settings.Max_Caps_Message.replace('{member}', message.author.toString())))
        }).catch(() => {})
    }

    if (attch && !settings.Bypass_Attachments_Roles.some(r => message.member.roles.cache.has(r))) {
        message.delete().then(() => {
            message.channel.send(new client.embed().setDescription(settings.Banned_Attachments_Message.replace('{member}', message.author.toString()).replace('{attachment}', attch)))
        }).catch(() => {})
    }

    if (settings.Banned_Words.some(a => message.content.toLowerCase().includes(a))) {
        if (settings.Bypass_Words_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send(new client.embed().setDescription(settings.Banned_Words_Message.replace('{member}', message.author.toString())))
        }).catch(() => {})
    }

    if (settings.Banned_Emojis.some(a => message.content.toLowerCase().includes(a))) {
        if (settings.Bypass_Emojis_Roles.some(r => message.member.roles.cache.has(r))) return
        message.delete().then(() => {
            message.channel.send(new client.embed().setDescription(settings.Banned_Emojis_Message.replace('{member}', message.author.toString())))
        }).catch(() => {})
    }

    if (settings.Banned_Links.some((a, i) => message.content.toLowerCase().includes(a) && !message.content.includes(settings.Allowed_Domains[i]))) {
        if (settings.Bypass_Links_Roles.some(r => message.member.roles.cache.has(r))) return
        if (settings.Bypass_Links_Channels.includes(message.channel.id)) return
        message.delete().then(() => {
            message.channel.send(new client.embed().setDescription(settings.Banned_Links_Message.replace('{member}', message.author.toString())))
        }).catch(() => {})
    }
}