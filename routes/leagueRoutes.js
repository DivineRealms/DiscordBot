const router = require("express").Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();

router.post("/players/add", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.league)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or League in Body.",
    });
  const leagueType = req.body.league;
  const uuid = req.body.uuid;
  const kolo = req.body.kolo;
  const season = req.body.season;

  if (leagueType.toLowerCase() == "svb") {
    let league = await db.get(`league_${uuid}_svb`);
    if (league)
      return res.status(500).json({
        code: 500,
        response: "Player is already in this league",
      });
    await db.set(`league_${uuid}_svb`, {
      league: "svb",
      kolo: kolo || 0,
      season: season || 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellow: 0,
      red: 0,
    });
    res.status(200).json({
      code: 200,
      response: "Player added to SveBalkan League",
    });
  } else if (leagueType.toLowerCase() == "js") {
    let league = await db.get(`league_${uuid}_js`);
    if (league)
      return res.status(500).json({
        code: 500,
        response: "Player is already in this league",
      });
    await db.set(`league_${uuid}_js`, {
      league: "js",
      kolo: kolo || 0,
      season: season || 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellow: 0,
      red: 0,
    });
    res.status(200).json({
      code: 200,
      response: "Player added to Juniors League",
    });
  }
});

router.post("/players/remove", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  if (!req.body.uuid || !req.body.league)
    return res.status(400).json({
      code: 400,
      response: "Invalid Request, you didn't provide UUID or League in Body.",
    });
  const uuid = req.body.uuid;

  let league =
    (await db.all()).filter((x) => x.id.startsWith(`league_${uuid}`)) || [];

  if (league.length == 0)
    return res.status(500).json({
      code: 500,
      response: "Player is not in any league",
    });

  await db.delete(league[0].id);
  res.status(200).json({
    code: 200,
    response: "Player removed from League",
  });
});

router.get("/players/get", async (req, res) => {
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
  let league = (await db.all()).filter((x) =>
    x.id.startsWith(`league_${uuid}`)
  );
  if (league.length == 0)
    return res.status(404).json({
      code: 404,
      response: "Player isn't in any league.",
    });

  res.status(200).json({
    code: 200,
    response: JSON.parse(league[0].value),
  });
});

router.patch("/players/update", async (req, res) => {
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
  let league = (await db.all()).filter((x) =>
    x.id.startsWith(`league_${uuid}`)
  );
  if (league.length == 0)
    return res.status(404).json({
      code: 404,
      response: "Player isn't in any league.",
    });

  let leagueData = await db.get(league[0].id);
  let playerData = await db.get(`player_${uuid}`);

  if (type?.toLowerCase() == "set") {
    if (req.body.goals) {
      playerData.goals = req.body.goals;
      leagueData.goals = req.body.goals;
    }
    if (req.body.assists) {
      playerData.assists = req.body.assists;
      leagueData.assists = req.body.assists;
    }
    if (req.body.cleanSheets) {
      leagueData.cleanSheets = req.body.cleanSheets;
      playerData.cleanSheets = req.body.cleanSheets;
    }
    if (req.body.yellow) {
      playerData.yellow = req.body.yellow;
      leagueData.yellow = req.body.yellow;
    }
    if (req.body.red) {
      playerData.red = req.body.red;
      leagueData.red = req.body.red;
    }
    await db.set(`player_${uuid}`, playerData);
    await db.set(league[0].id, leagueData);

    res.status(200).json({
      code: 200,
      response: "Player & League Updated Successfully",
    });
  } else {
    if (req.body.goals) {
      playerData.goals += req.body.goals;
      leagueData.goals += req.body.goals;
    }
    if (req.body.assists) {
      playerData.assists += req.body.assists;
      leagueData.assists += req.body.assists;
    }
    if (req.body.cleanSheets) {
      leagueData.cleanSheets += req.body.cleanSheets;
      playerData.cleanSheets += req.body.cleanSheets;
    }
    if (req.body.yellow) {
      playerData.yellow += req.body.yellow;
      leagueData.yellow += req.body.yellow;
    }
    if (req.body.red) {
      playerData.red += req.body.red;
      leagueData.red += req.body.red;
    }
    await db.set(`player_${uuid}`, playerData);
    await db.set(league[0].id, leagueData);

    res.status(200).json({
      code: 200,
      response: "Player & League Updated Successfully",
    });
  }
});

router.get("/stats/allTime", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });

  let allTime = await db.get(`league_allTime`);
  if (allTime) {
    res.status(200).json({
      code: 200,
      response: {
        goals: allTime.goals,
        assists: allTime.assists,
        cleanSheets: allTime.cleanSheets,
        yellow: allTime.yellow,
        red: allTime.red,
      },
    });
    return;
  }

  let goals = 0,
    assists = 0,
    cleanSheets = 0,
    yellow = 0,
    red = 0;
  js.forEach((x) => {
    goals += parseInt(JSON.parse(x.value).goals);
    assists += parseInt(JSON.parse(x.value).assists);
    cleanSheets += parseInt(JSON.parse(x.value).cleanSheets);
    yellow += parseInt(JSON.parse(x.value).yellow);
    red += parseInt(JSON.parse(x.value).red);
  });

  svb.forEach((x) => {
    goals += parseInt(JSON.parse(x.value).goals);
    assists += parseInt(JSON.parse(x.value).assists);
    cleanSheets += parseInt(JSON.parse(x.value).cleanSheets);
    yellow += parseInt(JSON.parse(x.value).yellow);
    red += parseInt(JSON.parse(x.value).red);
  });

  res.status(200).json({
    code: 200,
    response: {
      goals,
      assists,
      cleanSheets,
      yellow,
      red,
    },
  });
});

router.post("/season/reset", async (req, res) => {
  if (req.body.key != process.env.ACCESS_KEY)
    return res.status(401).json({
      code: 401,
      response: "You're not autorized",
    });
  let js = (await db.all()).filter((x) => x.id.endsWith("_js"));
  let svb = (await db.all()).filter((x) => x.id.endsWith("_svb"));
  let goals = 0,
    assists = 0,
    cleanSheets = 0,
    yellow = 0,
    red = 0,
    kolo = 0,
    season = 0;

  for (const x of js) {
    goals += parseInt(JSON.parse(x.value).goals);
    assists += parseInt(JSON.parse(x.value).assists);
    cleanSheets += parseInt(JSON.parse(x.value).cleanSheets);
    yellow += parseInt(JSON.parse(x.value).yellow);
    red += parseInt(JSON.parse(x.value).red);
    season = parseInt(JSON.parse(x.value).season);
    kolo = parseInt(JSON.parse(x.value).kolo);

    let newData = JSON.parse(x.value);
    newData.goals = 0;
    newData.assists = 0;
    newData.cleanSheets = 0;
    newData.yellow = 0;
    newData.red = 0;

    await db.set(x.id, newData);
  }

  for (const x of svb) {
    goals += parseInt(JSON.parse(x.value).goals);
    assists += parseInt(JSON.parse(x.value).assists);
    cleanSheets += parseInt(JSON.parse(x.value).cleanSheets);
    yellow += parseInt(JSON.parse(x.value).yellow);
    red += parseInt(JSON.parse(x.value).red);

    let newData = JSON.parse(x.value);
    newData.goals = 0;
    newData.assists = 0;
    newData.cleanSheets = 0;
    newData.yellow = 0;
    newData.red = 0;

    await db.set(x.id, newData);
  }

  await db.set(`league_allTime`, {
    goals,
    assists,
    cleanSheets,
    yellow,
    red,
  });

  res.status(200).json({
    code: 200,
    response: "Season have been reseted.",
  });
});

router.post("/club/create", async(req, res) => {
  let listOfClubs = (await db.all).filter((x) => x.id.startsWith("club_")) || [];
  const clubData = await db.set(`club_${listOfClubs.length}`);

  res.status(201).json({
    code: 201,
    message: "Club have been created successfully",
    response: clubData
  })
});

router.post("/matchday", async(req, res) => {
  const { league, kolo, home, away } = req.body;

  const matchdayId = (Math.random() + 1).toString(36).substring(7);

  const matchData = await db.set(`match_${matchdayId}`, {
    home,
    away,
    kolo,
    league,
    customId: matchdayId,
    rezultat: "0-0",
    ref: null,
    timestamp: new Date().getTime(),
    scorers: [],
    assists: [],
    cleanSheets: [],
    yellow: [],
    red: [],
    fansMotm: '',
    fcfaMotm: ''
  });

  res.status(201).json({
    code: 201,
    message: "Match have been created successfully",
    response: matchData
  })
});

router.put("/matchday/update/:type", async(req, res) => {
  const { customId, uuid1, uuid2, motm } = req.body;
  const { type } = req.params;

  let match = await db.get(`match_${customId}`);
  if(!match) return res.status(404).json({
    code: 404,
    response: "No Match with such ID could be found."
  });

  if(type == "goal") {
    const whoScored = await db.get(`player_${uuid1}`);
    whoScored.currentClub == home ? match.rezultat = `${parseInt(match.rezultat.split("-")[0]) + 1}-${match.rezultat.split("-")[1]}` 
      : `${match.rezultat.split("-")[0]}-${parseInt(match.rezultat.split("-")[1]) + 1}`;
    
    match.scorers.push(uuid1);
    match.assists.push(uuid2);
  } else if(type == "red") {
    match.red.push(uuid1);
  } else if(type == "yellow") {
    match.yellow.push(uuid1);
  } else if(type == "cs") {
    match.cleanSheets.push(uuid1);
  } else if(type == "fans") {
    match.fansMotm = motm;
  } else if(type == "fcfa") {
    match.fcfaMotm = motm;
  }

  const updatedData = await db.set(`match_${customId}`, match);

  res.status(200).json({
    code: 200,
    message: "Matchday have been updated",
    response: updatedData
  });

  // Check which option were sent in request
  // and update it here.
  //
  // Player stats need to be updated separately
  // by calling separate endpoint.

});

module.exports = router;
