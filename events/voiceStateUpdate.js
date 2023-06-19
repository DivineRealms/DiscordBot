const { ChannelType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = async (client, oldState, newState) => {
  if (client.conf.Temp_Voice_Channel.Enabled) {
    let mkChannel = client.channels.cache.get(client.conf.Temp_Voice_Channel.Join_Channel);
    if(!mkChannel) return;
    let tempChannel = await db.get(`tempChannel_${oldState.channelId}`);

    if (!oldState.channelId && newState.channelId) {
      if(newState.channelId != mkChannel.id) return;
      await createTemporaryVC(client, newState);
    }
    if (oldState.channelId && !newState.channelId) {
      if (tempChannel) {
        let vc = oldState.guild.channels.cache.get(tempChannel);
        if (vc.members.size < 1) {
          await db.delete(`tempChannel_${oldState.channelId}`);
          return vc.delete(); 
        }
      }
    }
    if (oldState.channelId && newState.channelId) {
      if (oldState.channelId !== newState.channelId) {
        if(newState.channelId == mkChannel.id) 
          await createTemporaryVC(client, oldState);
        if (tempChannel) {
          let vc = oldState.guild.channels.cache.get(tempChannel);
          if (vc.members.size < 1) {
            await db.delete(`tempChannel_${oldState.channelId}`);
            return vc.delete(); 
          }
        }
      }
    }
  }
};

async function createTemporaryVC(client, user) {
  let createCategory = client.conf.Temp_Voice_Channel.Create_Under;
  if (!user.guild.channels.cache.get(createCategory) || !createCategory) return;
  await user.guild.channels.create({
    name: `${client.conf.Temp_Voice_Channel.Channel_Prefix}${user.member.user.username}`,
    type: ChannelType.GuildVoice,
    parent: createCategory,
    userLimit: 5,
  }).then(async(vc) => {
    user.setChannel(vc);
    await db.set(`tempChannel_${vc.id}`, vc.id);
    await vc.permissionOverwrites.set([
      {
        id: user.id,
        allow: ["ManageChannels", "ManageRoles"],
      },
      {
        id: user.guild.id,
        allow: ["Speak", "Connect"],
      },
    ]);
  })
}