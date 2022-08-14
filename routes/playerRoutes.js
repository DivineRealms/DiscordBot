const router = require("express").Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();

router.get("/", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID in Body.",
    });
  let playerData = await db.get(`player_${req.body.uuid}`);

  res.status(200).json({
    code: 200,
    response: playerData,
  });
});

router.patch("/update", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID in Body.",
    });
  const uuid = req.body.uuid;
  const type = req.body.type || "add_remove";

  let playerData = await db.get(`player_${uuid}`);
  let clubData = await db.get(`club_${player.currentClub}`);

  if (type?.toLowerCase() == "set") {
    if (req.body.goals) {
      playerData.goals = req.body.goals;
      clubData.goals = req.body.goals;
    }
    if (req.body.assists) {
      playerData.assists = req.body.assists;
      clubData.assists = req.body.assists;
    }
    if (req.body.cleanSheets) {
      clubData.cleanSheets = req.body.cleanSheets;
      playerData.cleanSheets = req.body.cleanSheets;
    }
    if (req.body.yellow) {
      playerData.yellow = req.body.yellow;
      clubData.yellow = req.body.yellow;
    }
    if (req.body.red) {
      playerData.red = req.body.red;
      clubData.red = req.body.red;
    }
    await db.set(`player_${uuid}`, playerData);
    await db.set(`club_${player.currentClub}`, clubData);

    res.status(200).json({
      code: 200,
      response: "Player & Club Updated Successfully",
    });
  } else {
    if (req.body.goals) {
      playerData.goals += req.body.goals;
      clubData.goals += req.body.goals;
    }
    if (req.body.assists) {
      playerData.assists += req.body.assists;
      clubData.assists += req.body.assists;
    }
    if (req.body.cleanSheets) {
      clubData.cleanSheets += req.body.cleanSheets;
      playerData.cleanSheets += req.body.cleanSheets;
    }
    if (req.body.yellow) {
      playerData.yellow += req.body.yellow;
      clubData.yellow += req.body.yellow;
    }
    if (req.body.red) {
      playerData.red += req.body.red;
      clubData.red += req.body.red;
    }
    await db.set(`player_${uuid}`, playerData);
    await db.set(`club_${player.currentClub}`, clubData);

    res.status(200).json({
      code: 200,
      response: "Player & Club Updated Successfully",
    });
  }
});

router.post("/firstJoin", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID in Body.",
    });
  let newUser = await db.set(`player_${req.body.uuid}`, {
    username: req.body.username,
    uuid: req.body.uuid,
    league: "",
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellow: 0,
    red: 0,
    clubs: [],
    positions: [],
    played: 0,
    currentClub: -1
  });

  res.status(201).json({
    code: 201,
    response: newUser,
  });
});

router.post("/goals/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.goals)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Goals in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  player.goals = parseInt(player.goals + 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).goals += req.body.goals;
    await db.set(`club_${player.currentClub}`, currentClub);
  }

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/goals/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.goals)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Goals in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (player.goals - 1 < 1)
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 goals",
    });

  player.goals = parseInt(player.goals - 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).goals -= req.body.goals;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/goals/set", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.goals)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Goals in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (
    `${req.body.goals}`.includes("-") &&
    player.goals - parseInt(req.body.goals) < 1
  )
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 goals",
    });

  player.goals = parseInt(req.body.goals);

  await db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/assists/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.assists)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Assists in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  player.assists = parseInt(player.assists + 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).assists += req.body.assists;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/assists/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.assists)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Assists in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (player.assists - 1 < 1)
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 assists",
    });

  player.assists = parseInt(player.assists - 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).assists -= req.body.assists;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/assists/set", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.assists)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Assists in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (
    `${req.body.assists}`.includes("-") &&
    player.assists - parseInt(req.body.assists) < 1
  )
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 assists",
    });

  player.assists = parseInt(req.body.assists);

  await db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cleanSheets/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.cleanSheets)
    return res.status(400).json({
      code: 400,
      response:
        "Invalid Request, you didn't provide UUID or Clean Sheets in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  player.cleanSheets = parseInt(player.cleanSheets + 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).cleanSheets += req.body.cleanSheets;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cleanSheets/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.cleanSheets)
    return res.status(400).json({
      code: 400,
      response:
        "Invalid Request, you didn't provide UUID or Clean Sheets in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (player.cleanSheets - 1 < 1)
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 cleanSheets",
    });

  player.cleanSheets = parseInt(player.cleanSheets - 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).goals -= req.body.cleanSheets;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cleanSheets/set", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.cleanSheets)
    return res.status(400).json({
      code: 400,
      response:
        "Invalid Request, you didn't provide UUID or Clean Sheets in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (
    `${req.body.cleanSheets}`.includes("-") &&
    player.cleanSheets - parseInt(req.body.cleanSheets) < 1
  )
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 Clean Sheets",
    });

  player.cleanSheets = parseInt(req.body.cleanSheets);

  await db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/yellow/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.yellow)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Yellow in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  player.yellow = parseInt(player.yellow + 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).yellow += req.body.yellow;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/yellow/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.yellow)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Yellow in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (player.yellow - 1 < 1)
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 yellow cards",
    });

  player.yellow = parseInt(player.yellow - 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).yellow -= req.body.yellow;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/yellow/set", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.yellow)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Yellow in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (
    `${req.body.yellow}`.includes("-") &&
    player.yellow - parseInt(req.body.yellow) < 1
  )
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 Clean Sheets",
    });

  player.yellow = parseInt(req.body.yellow);

  await db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/red/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.red)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Red in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  player.red = parseInt(player.red + 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).red += req.body.red;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/red/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.red)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Red in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (player.red - 1 < 1)
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 red cards",
    });

  player.red = parseInt(player.red - 1);
  await db.set(`player_${req.body.uuid}`, player);

  let currentClub = await db.get(`club_${player.currentClub}`);
  if(currentClub) {
    currentClub.find((p) => p.id == req.body.uuid).red -= req.body.red;
    await db.set(`club_${player.currentClub}`, currentClub);
  }
  
  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/cards/red/set", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.red)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or Red in Body.",
    });
  let player = await db.get(`player_${req.body.uuid}`);
  if (
    `${req.body.red}`.includes("-") &&
    player.red - parseInt(req.body.red) < 1
  )
    return res.status(500).json({
      code: 500,
      response: "Player can't have less than 0 Clean Sheets",
    });

  player.red = parseInt(req.body.red);

  await db.set(`player_${req.body.uuid}`, player);

  res.status(200).json({
    code: 200,
    response: player,
  });
});

router.post("/club/set", async(req, res) => {
  const { uuid, clubId } = req.query;

  let player = await db.get(`player_${uuid}`);
  player.currentClub = clubId;
  await db.set(`player_${uuid}`, player);

  await db.push(`club_${clubId}`, {
    player: uuid,
    played: player.played,
    goals: player.goals,
    assists: player.assists,
    cleanSheets: player.cleanSheets
  });

  res.status(200).json({
    code: 200,
    response: "Changed player's Club successfully"
  });
});

module.exports = router;