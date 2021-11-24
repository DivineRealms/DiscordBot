//   ____  _       _            ____            _               
// |  _ \(_)_   _(_)_ __   ___|  _ \ ___  __ _| |_ __ ___  ___ 
// | | | | \ \ / / | '_ \ / _ \ |_) / _ \/ _` | | '_ ` _ \/ __|
// | |_| | |\ V /| | | | |  __/  _ <  __/ (_| | | | | | | \__ \
// |____/|_| \_/ |_|_| |_|\___|_| \_\___|\__,_|_|_| |_| |_|___/
//


module.exports.config = {
    settings: {
        token: 'NTA0MDU4MjE5MTAyOTk0NDMz.W85OzA.DHSbV_eP6FfBLsRoJhHW4hWhzlM',
        prefix: '.',
        mentionPrefix: true, //Whether the bot has a mention prefix
        botActivity: {
            status: 'online',
            activity: {
                name: 'on mc.DivineRealms.ga',
                type: 'PLAYING',
            }
        },
        changingActivity: { //An activity that automatically updates
            enabled: true,
            activities: ['.help', 'on mc.DivineRealms.ga'],
            types: ['LISTENING', 'PLAYING']
        },
        embedColor: '#7ec0ff',
        GuildID: '237171768693882890',
        BotOwnerDiscordID: ['823228305167351808', '237171563760320514'],
        Emojis: {
            Yes: '👍',
            No: '👎'
        }
    },
    automod: {
        // - - - BANNED STUFF - - -
        Banned_Words: [],
        Banned_Links: ['discord.gg/'],
        Banned_Emojis: [],
        Banned_Attachments: [],
        Banned_Words_Message: '{member}, Please dont use that language here.',
        Banned_Links_Message: '{member}, Please dont post that link here.',
        Banned_Emojis_Message: '{member}, Please dont post that emoji here.',
        Banned_Attachments_Message: '{member}, Please dont post {attachment} attachments here.',

        // - - - BYPASS PERMISSIONS - - -
        Bypass_Links_Channels: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Attachments_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Words_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Emojis_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Links_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Spam_Channels: ['529065596449456128', '912855458795094057', '536227607805558785'],
        Allowed_Domains: ['youtube'],
        Bypass_Spam_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'],
        Bypass_Cooldown: ['747258761466609714', '734736802384052264'],

	// - - - COMMAND CHANNEL - - - - 
	Command_Channel: ['697830798002225162', '529065596449456128', '912855458795094057'],
	Bypass_Command: ['747258761466609714', '734736802384052264', '536227607805558785'], 

	// - - - SPAM PREVENTION - - - 
        Enable_Spam: true,
        Spam_Message: '{username}, you have been muted for spamming!',

        // - - - CAPS SPAM - - -
        Caps_Limit: '50%', //percentage of caps that users can type (leave blank to disable)
        Caps_Minimum_Characters: '20', //how many characters in a message are needed to check for caps limit
        Max_Caps_Message: '{member}, your message contained too many caps!',
        Bypass_Caps_Roles: ['747258761466609714', '734736802384052264', '536227607805558785'], //has to be a role ik im dumb

        // - - - MENTION SPAM - - -
        Max_Role_Pings: 0, //max amount of times a user can ping a role in a single message
        Max_User_Pings: 0, //set to 0 to disable
        Max_Channel_Pings: 5, //any pings greater than this number will delete the message
        Max_Total_Pings: 10, //max amount of any ping in a message allowed
        Bypass_Pings: ['747258761466609714', '734736802384052264', '536227607805558785']
    },
    moderation: {
        Moderators: ['734736802384052264', '747258761466609714'], //roles that can use any moderation command
        serverLock: true, //whether or not to enable the server lock command
        Mute_Role: '738142767326298183'
    },
    automation: {
        Roles_On_Join: [],
        Member_Count_Channel: '586499141199200256',
        Member_Count_Message: '👥︲Members: {count}',
        Channel_Count_Channel: '',
        Channel_Count_Message: 'Channels: {count}',
        Invite_Link: 'https://discord.gg/UqAm4B5',
        Booster_Channel: '512274978754920463',
        Booster_Title: '{member} just boosted the server!',
        Booster_Message: 'Thank you {member} for boosting the server! We now have {boosters} booster(s)!',
        Booster_Thumbnail: '{member}' //Select either a image url, or {member} for the booster avatar
    },
    counting: {
        Counting_Channel: '', //leave blank for none
        Wrong_Number_Message: 'Wrong number {username}, The current number is {number}!',
        One_At_A_Time: false,
        One_At_A_Time_Message: 'Sorry {username}, but you can only say a number one at a time!',
        Restart_On_Incorrect_Number: false,
        Restart_Message: 'The countdown has been reset back to 1!',
        React_On_Message: true,
        Reaction: '✅'
    },
    leveling: {
        enabled: true,
        remove_XP_on_Leave: false,
        level_Up_Message: '{user} has just reached level {level}!',
        level_Up_Title: 'Level Up!',
        ignore_Xp_Channels: ['912855458795094057'], // ovde
        level_Up_Channel: '', //channel id, or write current for the current channel their in, leave blank for none
        level_Up_Roles: [ //roles to award when members reach a certain level
            { id: 0, level: 10, role: '747821097847619655' },
            { id: 1, level: 25, role: '747821097340108911' },
            { id: 2, level: 50, role: '747821096769683566' },
            { id: 3, level: 75, role: '747821095662518394' },
            { id: 4, level: 100, role: '747821098778755142' }
        ],
        rankCardImage: 'https://i.imgur.com/xCO9CLv.jpg',
        rankCardColor: '#7ec0ff'
    },
    colors: {
        list: [
            { name: 'blurple', role: '734405819193360488' },
            { name: 'white', role: '734405820766355548' },
            { name: 'green', role: '734405820988784751' },
            { name: 'blue', role: '734405821538107393' },
            { name: 'purple', role: '734405821936697426' },
            { name: 'red', role: '734405822762844280' },
	    { name: 'orange', role: '734405823824134227' },
	    { name: 'yellow', role: '734405823274549258' },
	    { name: 'black', role: '734405824314605709' },
	    { name: 'pink', role: '734407215833677864' },
	    { name: 'gold', role: '734407216442114079' },
        ]
    },
    tempvc: {
        enabled: true,
        Join_Channel: '912423456434450463', //Channel in which is join to create
        Create_VCS_Under: '563847927886381089', //THe channel to create temp vcs under
        Channel_Prefix: '🔐︲'
    },
    logging: {
        Report_Channel: '',
        Ban_Channel_Logs: '512277268597309440',
        Unban_Channel_Logs: '512277268597309440',
        Kick_Channel_Logs: '512277268597309440',
        Warn_Channel_Logs: '512277268597309440',
        Mute_Channel_Logs: '512277268597309440',
        Lock_Channel_Logs: '512277268597309440',
        Ticket_Channel_Logs: '512277268597309440',
        Moderation_Channel_Logs: '512277268597309440',
        Suggestion_Channel_Logs: '512277268597309440',
        Report_Channel_Logs: '512277268597309440',
        Server_Updates: '512277268597309440',
        Voice_Updates: '512277268597309440',
        Role_Updates: '512277268597309440',
        Channel_Updates: '512277268597309440',
        Message_Updates: '512277268597309440',
	Bot_Errors: "512277268597309440",
	Bump_Channel: "912855458795094057"
    },
    starBoard: {
        Enabled: false,
        StarBoard_Channel: '911648409839075358',
        Minimum_Reactions: '1', //how many star reactions required to send to star board channel
        StarBoard_Emoji: '⭐'
    },
    ticketSystem: {
        Ticket_Category: '912688387536855060',
        Ticket_Name: '🗒︲{username}-{number}',
        Ticket_Title: 'Ticket Creation',
        Ticket_Message: 'Thank you for creating a ticket {username}, a staff member will be with you shortly.',
        Support_Team_Roles: ['747258761466609714', '734736802384052264'],
        Panel_Emoji: '✉️',
        Panel_Title: 'Create a Ticket',
        Panel_Message: 'Please react with the emoji to create a ticket\nA staff member will be with you shortly.',
        Max_Tickets_For_Moderators: '5',
        Max_Tickets_For_Users: '3'
    },
    applicationSystem: {
        applications: [{
                enabled: false, //whether to enable or disable this application
                Application_Log: '887791852554682458', //Where to send completed apps
                Application_Name: '', //application name (must be unique)
                Application_Channel: '', //The channel where people can apply in (leave blank for any)
                questions: ['Question', 'Question', 'Question'] //questions this application will ask
            },
        ],
    },
    welcomeSystem: {
        enabled: true,
        welcomeChannel: '512274978754920463',
        welcomeType: 'embed', //select from these 4 options -> message, embed, dm or card!
        welcomeCardBackGroundURL: 'https://minecraft-mp.com/images/banners/banner-295045-1636327342.png',
        welcomeMessage: 'Welcome {member} to the server.\nTotal members: {joinPosition}.',
        welcomeDM: 'Welcome {member} to the server! You are our {joinPosition} member!',
        welcomeEmbed: {
            title: '{username} has just joined the server',
            description: 'Total members: `{joinPosition}`\nServer address: `mc.divinerealms.ga`',
            color: '#7ec0ff'
        }
    },
    birthdaySystem: {
        enabled: true,
        birthdayChannel: '512274978754920463',
        birthdayMessage: 'Happy birthday to the following member(s)! Make sure to wish them a happy birthday in general!'
    },
    economy: {
        enabled: true,
        shopItems: [{
            type: 'color',
            name: 'blurple',
            description: 'Get the blurple color',
            price: '10000'
        },{
            type: 'color',
            name: 'white',
            description: 'Get the white name color',
            price: '10000'
        },{
            type: 'color',
            name: 'green',
            description: 'Get the green name color',
            price: '10000'
        },{
            type: 'color',
            name: 'blue',
            description: 'Get the blue name color',
            price: '10000'
        },{
            type: 'color',
            name: 'purple',
            description: 'Get the purple name color',
            price: '10000'
        },{
	    type: 'color',
	    name: 'red',
	    description: 'Get the red name color',
	    price: '10000'
	},{
	    type: 'color',
	    name: 'orange',
	    description: 'Get the orange name color',
	    price: '10000'
	},{
	    type: 'color',
	    name: 'yellow',
	    description: 'Get the yellow name color',
	    price: '10000'
	},{
	    type: 'color',
	    name: 'black',
	    description: 'Get the black name color',
	    price: '10000'
	},{
	    type: 'color',
	    name: 'pink',
	    description: 'Get the pink name color',
	    price: '10000'
	},{
	    type: 'color',
	    name: 'gold',
	    description: 'Get the gold name color',
	    price: '10000'
	}]
    },
    goodbyeSystem: {
        enabled: true,
        goodbyeChannel: '512277268597309440',
        goodbyeType: 'embed', //select from these 4 options -> message, embed, card!
        goodbyeCardBackGroundURL: 'BACKGROUNDURL',
        goodbyeMessage: '{member} just left the server, hope you enjoyed your stay!',
        goodbyeDM: '{member} were sad to see you go! We hope to see you soon.',
        goodbyeEmbed: {
            title: '{username} left',
            description: '',
            color: '#ee6e84'
        }
    }
}

/** ! Do Not Touch ! 
 *  This area is NOT to be edited,
 *  doing so may end up breaking the bot
 *  so dont touch! ty :) ~ Nut
 **/
module.exports.guildSettings = {
    prefix: this.config.settings.prefix,
    panels: [],
    counting: { current: 1, last: null },
    dms: {},
    vc: {},
    commands: {},
    suggestions: {},
    lockdown: false,
    processing: {},
    completed: []
}

/** ! Do Not Touch ! 
 *  This area is NOT to be edited,
 *  doing so may end up breaking the bot
 *  so dont touch! ty :) ~ Nut
 **/
