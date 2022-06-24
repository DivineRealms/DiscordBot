const router = require("express").Router();
const db = require("quick.db");

router.post("/players/add", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  if(!req.body.uuid || !req.body.league) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or League in Body."
  });
  const leagueType = req.body.league;
  const uuid = req.body.uuid;
  const kolo = req.body.kolo;
  const season = req.body.season;

  if(leagueType.toLowerCase() == "svb") {
    let league = db.fetch(`league_${uuid}_svb`);
    if(league) return res.status(500).json({
      code: 500,
      response: "Player is already in this league"
    });
    db.set(`league_${uuid}_svb`, {
      league: "svb",
      kolo: kolo || 0,
      season: season || 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellow: 0,
      red: 0
    })
    res.status(200).json({
      code: 200,
      response: "Player added to SveBalkan League"
    });
  } else if(leagueType.toLowerCase() == "js") {
    let league = db.fetch(`league_${uuid}_js`);
    if(league) return res.status(500).json({
      code: 500,
      response: "Player is already in this league"
    });
    db.set(`league_${uuid}_js`, {
      league: "js",
      kolo: kolo || 0,
      season: season || 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellow: 0,
      red: 0
    })
    res.status(200).json({
      code: 200,
      response: "Player added to Juniors League"
    });
  }
});

router.post("/players/remove", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  if(!req.body.uuid || !req.body.league) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID or League in Body."
  });
  const uuid = req.body.uuid;

  let league = db.all().filter((x) => x.ID.startsWith(`league_${uuid}`)) || [];

  if(league.length == 0) return res.status(500).json({
    code: 500,
    response: "Player is not in any league"
  });

  db.delete(league[0].ID);
  res.status(200).json({
    code: 200,
    response: "Player removed from League"
  });
});

router.get("/players/get", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  if(!req.body.uuid) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID in Body."
  });

  const uuid = req.body.uuid;
  let league = db.all().filter((x) => x.ID.startsWith(`league_${uuid}`));
  if(league.length == 0) return res.status(404).json({
    code: 404,
    response: "Player isn't in any league."
  });

  res.status(200).json({
    code: 200,
    response: JSON.parse(league[0].data)
  })
})

router.put("/players/update", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  if(!req.body.uuid) return res.status(400).json({
    code: 400,
    response: "Invalid Request, you didn't provide UUID in Body."
  });
  const uuid = req.body.uuid;
  const type = req.body.type || "add_remove";
  let league = db.all().filter((x) => x.ID.startsWith(`league_${uuid}`));
  if(league.length == 0) return res.status(404).json({
    code: 404,
    response: "Player isn't in any league."    
  });

  let leagueData = db.fetch(league[0].ID);
  let playerData = db.fetch(`player_${uuid}`);

  if(type?.toLowerCase() == "set") {
    if(req.body.goals) {
      playerData.goals = req.body.goals;
      leagueData.goals = req.body.goals;
    }
    if(req.body.assists) {
      playerData.assists = req.body.assists;
      leagueData.assists = req.body.assists;
    }
    if(req.body.cleanSheets) {
      leagueData.cleanSheets = req.body.cleanSheets;
      playerData.cleanSheets = req.body.cleanSheets;
    }
    if(req.body.yellow) {
      playerData.yellow = req.body.yellow
      leagueData.yellow = req.body.yellow
    };
    if(req.body.red) {
      playerData.red = req.body.red
      leagueData.red = req.body.red
    };
    db.set(`player_${uuid}`, playerData);
    db.set(league[0].ID, leagueData);
    
    res.status(200).json({
      code: 200,
      response: "Player & League Updated Successfully"
    });
  } else {
    if(req.body.goals) {
      playerData.goals += req.body.goals;
      leagueData.goals += req.body.goals;
    }
    if(req.body.assists) {
      playerData.assists += req.body.assists;
      leagueData.assists += req.body.assists;
    }
    if(req.body.cleanSheets) {
      leagueData.cleanSheets += req.body.cleanSheets;
      playerData.cleanSheets += req.body.cleanSheets;
    }
    if(req.body.yellow) {
      playerData.yellow += req.body.yellow
      leagueData.yellow += req.body.yellow
    };
    if(req.body.red) {
      playerData.red += req.body.red
      leagueData.red += req.body.red
    };
    db.set(`player_${uuid}`, playerData);
    db.set(league[0].ID, leagueData);

    res.status(200).json({
      code: 200,
      response: "Player & League Updated Successfully"
    });
  }
});

router.get("/stats/allTime", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  
  let allTime = db.fetch(`league_allTime`);
  if(allTime) {
    res.status(200).json({
      code: 200,
      response: {
        goals: allTime.goals, 
        assists: allTime.assists,
        cleanSheets: allTime.cleanSheets,
        yellow: allTime.yellow,
        red: allTime.red
      }
    });
    return;
  }

  let goals = 0, assists = 0, cleanSheets = 0, yellow = 0, red = 0;
  js.forEach((x) => {
    goals += parseInt(JSON.parse(x.data).goals);
    assists += parseInt(JSON.parse(x.data).assists);
    cleanSheets += parseInt(JSON.parse(x.data).cleanSheets);
    yellow += parseInt(JSON.parse(x.data).yellow);
    red += parseInt(JSON.parse(x.data).red);
  });

  svb.forEach((x) => {
    goals += parseInt(JSON.parse(x.data).goals);
    assists += parseInt(JSON.parse(x.data).assists);
    cleanSheets += parseInt(JSON.parse(x.data).cleanSheets);
    yellow += parseInt(JSON.parse(x.data).yellow);
    red += parseInt(JSON.parse(x.data).red);
  });

  res.status(200).json({
    code: 200,
    response: {
      goals, 
      assists,
      cleanSheets,
      yellow,
      red
    }
  });
})

router.post("/season/reset", async(req, res) => {
  if(req.body.key != process.env.ACCESS_KEY) return res.status(401).json({
    code: 401,
    response: "You're not autorized"
  });
  let js = db.all().filter((x) => x.ID.endsWith("_js"));
  let svb = db.all().filter((x) => x.ID.endsWith("_svb"));
  let goals = 0, assists = 0, cleanSheets = 0, yellow = 0, red = 0, kolo = 0, season = 0;
  
  js.forEach((x) => {
    goals += parseInt(JSON.parse(x.data).goals);
    assists += parseInt(JSON.parse(x.data).assists);
    cleanSheets += parseInt(JSON.parse(x.data).cleanSheets);
    yellow += parseInt(JSON.parse(x.data).yellow);
    red += parseInt(JSON.parse(x.data).red);
    season = parseInt(JSON.parse(x.data).season);
    kolo = parseInt(JSON.parse(x.data).kolo);

    let newData = JSON.parse(x.data);
    newData.goals = 0;
    newData.assists = 0;
    newData.cleanSheets = 0;
    newData.yellow = 0;
    newData.red = 0;

    db.set(x.ID, newData);
  });

  svb.forEach((x) => {
    goals += parseInt(JSON.parse(x.data).goals);
    assists += parseInt(JSON.parse(x.data).assists);
    cleanSheets += parseInt(JSON.parse(x.data).cleanSheets);
    yellow += parseInt(JSON.parse(x.data).yellow);
    red += parseInt(JSON.parse(x.data).red);

    let newData = JSON.parse(x.data);
    newData.goals = 0;
    newData.assists = 0;
    newData.cleanSheets = 0;
    newData.yellow = 0;
    newData.red = 0;
    
    db.set(x.ID, newData);
  });

  db.set(`league_allTime`, {
    goals, 
    assists,
    cleanSheets,
    yellow,
    red
  })

  res.status(200).json({
    code: 200,
    response: "Season have been reseted."
  });
})

module.exports = router;