const db = require("quick.db");
const ms = require("parse-ms");
const Timeout = require("smart-timeout");

const checkMute = async (client, guild) => {
  let roleSet = client.config.roles.mute;
  if(!roleSet || !client.utils.findRole(guild, roleSet)) return;
  let mute = await db
    .all()
    .filter(data => data.ID.startsWith(`muteInfo_${guild.id}`));
  for (let i = 0; i < mute.length; i++) {
    let e = 0;
    let userid = mute[i].ID.split("_")[2];
    let member = await guild.members.fetch(userid).catch(() => e++);
    if (e != 0) db.delete(mute[i].ID);
    else {
      let muteInfo = await db.fetch(`muteInfo_${guild.id}_${userid}`);
      let time = muteInfo.time - (Date.now() - muteInfo.date);
      if (time > 0) {
        Timeout.set(`mute_${guild.id}_${userid}`,
          async () => {
            try {
              let muteRole = client.config.roles.mute;
              let muted = client.utils.findRole(guild, muteRole);
              if (!muted) return;
              member.roles.remove(muted).then(async () => {
                let user = client.users.cache.get(userid);
                let muteInfo = db.fetch(`muteInfo_${guild.id}_${userid}`);
                let data = {
                  reason: muteInfo.reason,
                  staff: muteInfo.staff,
                  duration: muteInfo.duration
                }
                db.delete(`muteInfo_${guild.id}_${userid}`);

                client.utils.logs(client, guild, "Mute Expired", [{
                  name: "User",
                  desc: user
                },{
                  name: "Staff",
                  desc: data.staff
                },{
                  name: "Reason",
                  desc: data.reason
                },{
                  name: client.language.titles.logs.fields.duration,
                  desc: client.utils.formatTime(data.duration)
                }], user);
              });
            } catch (err) {
              console.log(err);
            }
          },
          time
        );
      } else {
        let muteRole = db.fetch(`server_${guild.id}_mutedRole`);
        let muted = guild.roles.cache.get(muteRole);
        if (!muted) return; // ovde role
        member.roles.remove(muted)
          .then(() => db.delete(`muteInfo_${guild.id}_${userid}`));
      }
    }
  }
}

const checkMuteOnJoin = async (client, member, guild) => {
  let mute = db.fetch(`muteInfo_${member.guild.id}_${member.id}`);
  let muteRole = client.config.roles.mute;
  let muted = client.utils.findRole(guild, muteRole);
  if(!muted) return;
  if (mute != null) {
    let time = ms(mute.time - (Date.now() - mute.date));
    if (time.seconds < 0) {
      member.roles.remove(muted);
      if (Timeout.exists(`mute_${member.guild.id}_${member.id}`))
        Timeout.clear(`mute_${member.guild.id}_${member.id}`);
      db.delete(`muteInfo_${member.guild.id}_${member.id}`);
    }
  }
  if (mute !== null) {
    let time = ms(mute.time - (Date.now() - mute.date));
    if (time.seconds > 0) {
      member.roles.add(muted);
    }
  }
}

module.exports = {
  checkMute,
  checkMuteOnJoin,
}