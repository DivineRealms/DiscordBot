module.exports = async (client, debug) => {
  let channel = client.channels.cache.get("512277268597309440");
  await channel.send({ content: debug })
;};
