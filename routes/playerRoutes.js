const router = require("express").Router();
const db = require("quick.db");

router.post("/firstJoin", async(req, res) => {
  let newUser = db.set(`player_${req.body.uuid}`, {
    username: req.body.username,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellow: 0,
    red: 0,
  });

  res.status(201).json({
    code: 201,
    response: newUser
  });
});

router.post("/goals/add", async(req, res) => {
  if(!req.body.uuid || !req.body.goals) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Goals in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  player.goals = parseInt(player.goals + 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/goals/remove", async(req, res) => {
  if(!req.body.uuid || !req.body.goals) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Goals in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(player.goals - 1 < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 goals"
  });
  
  player.goals = parseInt(player.goals - 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/goals/set", async(req, res) => {
  if(!req.body.uuid || !req.body.goals) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Goals in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(`${req.body.goals}`.includes("-") && player.goals - parseInt(req.body.goals) < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 goals"
  });

  player.goals = parseInt(req.body.goals)
  
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/assists/add", async(req, res) => {
  if(!req.body.uuid || !req.body.assists) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Assists in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  player.assists = parseInt(player.assists + 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/assists/remove", async(req, res) => {
  if(!req.body.uuid || !req.body.assists) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Assists in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(player.assists - 1 < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 assists"
  });

  player.assists = parseInt(player.assists - 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/assists/set", async(req, res) => {
  if(!req.body.uuid || !req.body.assists) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Assists in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(`${req.body.assists}`.includes("-") && player.assists - parseInt(req.body.assists) < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 assists"
  });

  player.assists = parseInt(req.body.assists)
  
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cleanSheets/add", async(req, res) => {
  if(!req.body.uuid || !req.body.cleanSheets) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Clean Sheets in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  player.cleanSheets = parseInt(player.cleanSheets + 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cleanSheets/remove", async(req, res) => {
  if(!req.body.uuid || !req.body.cleanSheets) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Clean Sheets in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(player.cleanSheets - 1 < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 cleanSheets"
  });

  player.cleanSheets = parseInt(player.cleanSheets - 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cleanSheets/set", async(req, res) => {
  if(!req.body.uuid || !req.body.cleanSheets) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Clean Sheets in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(`${req.body.cleanSheets}`.includes("-") && player.cleanSheets - parseInt(req.body.cleanSheets) < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 Clean Sheets"
  });

  player.cleanSheets = parseInt(req.body.cleanSheets)
  
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cards/yellow/add", async(req, res) => {
  if(!req.body.uuid || !req.body.yellow) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Yellow in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  player.yellow = parseInt(player.yellow + 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cards/yellow/remove", async(req, res) => {
  if(!req.body.uuid || !req.body.yellow) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Yellow in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(player.yellow - 1 < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 yellow cards"
  });

  player.yellow = parseInt(player.yellow - 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cards/yellow/set", async(req, res) => {
  if(!req.body.uuid || !req.body.yellow) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Yellow in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(`${req.body.yellow}`.includes("-") && player.yellow - parseInt(req.body.yellow) < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 Clean Sheets"
  });

  player.yellow = parseInt(req.body.yellow)
  
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cards/red/add", async(req, res) => {
  if(!req.body.uuid || !req.body.red) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Red in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  player.red = parseInt(player.red + 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

router.post("/cards/red/remove", async(req, res) => {
  if(!req.body.uuid || !req.body.red) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Red in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(player.red - 1 < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 red cards"
  });

  player.red = parseInt(player.red - 1);
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});


router.post("/cards/red/set", async(req, res) => {
  if(!req.body.uuid || !req.body.red) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or Red in Body."
  });
  let player = db.fetch(`player_${req.body.uuid}`);
  if(`${req.body.red}`.includes("-") && player.red - parseInt(req.body.red) < 1) return res.status(500).json({
    code: 500,
    response: "Player can't have less than 0 Clean Sheets"
  });

  player.red = parseInt(req.body.red);
  
  db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player
  });
});

module.exports = router;