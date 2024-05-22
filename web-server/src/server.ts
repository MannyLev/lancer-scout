import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
import { prisma } from "./index";
import { z } from "zod";
import { validate } from "./validate";
import { Prisma } from "@prisma/client";
import { getMatchFields } from "./getMatchFields";
import { getTeamFields } from "./getTeamFields";
import { getTeamPerformanceField } from "./getTeamPerformanceField";
import { getMatch } from "./getMatch"
import { getMatchNumbersForTeam } from "./getMatchNumbersForTeam";
import { getRecordsCount } from "./getRecordsCount";
import { putNewTeamPerformance } from "./putNewTeamPerformance";
import { getNumberOfMatches } from "./getNumberOfMatches";
import { getMatchesWithTeam } from "./getMatchesWithTeam";
import { getTeamNamesMatch } from "./getTeamNamesMatch";
import { getTeamsInMatch } from "./getTeamsInMatch";
import { getTeamPerformance } from "./getTeamPerformance";
import { getMatchNumbers } from "./getMatchNumbers";
import { getSchemaMaximaAcrossMatchScouting } from "./getSchemaMaximaAcrossMatchScouting";
import { getSchemaAverages } from "./getSchemaAverages";
import { getTeamOverviewAcrossMatchScouting } from "./getTeamOverviewAcrossMatchScouting";
import { getNumericMatchFields } from "./getNumericMatchFields";
import getTournaments from "./getTournaments";
import { getOPRs } from "./getOPR"
import createNewTournament from "./createNewTournament";
import { getSchemas } from "./getSchemas";
import { putNewPitScout } from "./putNewPitScout";
import { getTeamNamesPit } from "./getTeamNamesPit";
import { getSchemaMaximaAcrossPitScouting } from "./getSchemaMaximaAcrossPitScouting";
import { getTeamOverviewAcrossPitScouting } from "./getTeamOverviewAcrossPitScouting";
import { getNumericPitFields } from "./getNumericPitFields";

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "*"
}));

// Gets all of the values under the "field" key for a specific team
app.post("/getTeamFields", validate(z.object({
  body: z.object({
    field: z.string({
      required_error: "Field is required",
    }),
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    teamName: z.string({
      required_error: "Team name is required"
    })
  })
})),async (req, res) => {
 try {
  const json = req.body;
  console.log("Nothin' But A Good Time by Poison and getting team fields ", json);
  const data = await getTeamFields(json.field, json.tournamentName, json.teamName);
  res.status(200).json({
    data: data
  }).end(); 
 } catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({ e })
  }
 }
})

// Gets all of the values under the "field" key for a specific match
app.post("/getMatchFields", validate(z.object({
  body: z.object({
    field: z.string({
      required_error: "Field is required",
    }),
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
  console.log("Army of the Night by Powerwolf and items requested ", json);
  const data = await getMatchFields(json.field, json.tournamentName, json.matchNumber);
  res.status(200).json({
    data: data
  }).end();
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Gets the value under the "field" key for a specific team performance
app.post("/getTeamPerformanceField", validate(z.object({
  body: z.object({
    field: z.string({
      required_error: "Field is required",
    }),
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    }),
    teamName: z.string({
      required_error: "Team name is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Heartwork by Carcass and items requested ", json);
    const data = await getTeamPerformanceField(json.field, json.tournamentName, json.teamName, json.matchNumber);
    res.status(200).json({
      data: data
    }).end(); 
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Gets all of the team performances for a specific match
app.post("/getMatch", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Don't Look Back in Anger by Oasis and getting match", json)
    const data = await getMatch(json.tournamentName, json.matchNumber);
    res.status(200).json({
      data: data
    }).end(); 
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Gets a specific team performance
app.post("/getTeamPerformance", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    }),
    teamName: z.string({
      required_error: "Team Number is required"
    }),
    recordNumber: z.number({
      required_error: "Record Number is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Dark Necessities by Red Hot Chili Peppers and getting team performance", json)
    const data = await getTeamPerformance(json.tournamentName, json.matchNumber, json.teamName, json.recordNumber);
    res.status(200).json({
      data: data
    }).end();
  }
  catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Gets the match numbers for a specific team
app.post("/getMatchNumbersForTeam", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    teamName: z.string({
      required_error: "Team name is required"
    }),
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Santeria by Sublime and getting match numbers", json)
    const data = await getMatchNumbersForTeam(json.tournamentName, json.teamName);
    res.status(200).json({
      data: data
    }).end(); 
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Gets the names of teams involved in a specific match
app.post("/getTeamsInMatch", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Island in the Sun by Weezer and getting teams in match", json)
    const data = await getTeamsInMatch(json.tournamentName, json.matchNumber);
    res.status(200).json({
      data: data
    }).end(); 
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Returns the number of team performances for a specific team in a specific match for a specific tournament
app.post("/getRecordsCount", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    matchNumber: z.number({
      required_error: "Match number is required"
    }),
    teamName: z.string({
      required_error: "Team name is required"
    })
  })
})), async (req, res) => {
  try {
    const json = req.body;
    console.log("Song 2 by Blur and getting records count", json)
    const data = await getRecordsCount(json.tournamentName, json.matchNumber, json.teamName);
    res.status(200).json({
      data: data
    }).end(); 
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ e })
    }
  }
})

// Returns all the team performances for a specific team
app.post("/getMatchesWithTeam", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    teamName: z.string({
        required_error: "Team name is required"
    })
  })
  })), async (req, res) => {
    try {
      const json = req.body;
      console.log("Pardon Me by Incubus and getting matches with team", json)
      const data = await getMatchesWithTeam(json.tournamentName, json.teamName);
      res.status(200).json({
        data: data
      }).end(); 
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ e })
      }
    }
})

app.post("/getMatchNumbers", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
    try {
      const json = req.body;
      console.log("Alive by Pearl Jam and getting match numbers", json)
      const data = await getMatchNumbers(json.tournamentName);
      res.status(200).json({
        data: data
      }).end(); 
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ e })
      }
    }
  })

// Returns all of the team names in a given tournament
app.post("/getTeamNamesMatch", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
    try {
      const json = req.body;
      console.log("Trouble by Cage the Elephant and getting team names across matches", json)
      const data = await getTeamNamesMatch(json.tournamentName);
      res.status(200).json({
        data: data
      }).end(); 
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ e })
      }
    }
  })

// TODO: zod
// Returns all of the team names in a given tournament
app.post("/getTeamNamesPit", async (req, res) => {
  const json = req.body;
  console.log("Aberdeen by Cage the Elephant and getting team names across pit scouts", json)
  const data = await getTeamNamesPit(json.tournamentName);
  res.status(200).json({
    data: data
  })
})

// Returns the number of matches in a tournament
app.post("/getNumberOfMatches", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
    try {
      const json = req.body;
      console.log("Gone Away by The Offspring and getting number of matches", json)
      const data = await getNumberOfMatches(json.tournamentName);
      res.status(200).json({
        data: data
      }).end(); 
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ e })
      }
    }
})

// Returns each numeric field
app.post("/getNumericMatchFields", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Morning Glory by Oasis and getting numeric fields", json)
    const data = await getNumericMatchFields(json.tournamentName)
    res.status(200).json({ data })
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

app.post("/getNumericPitFields", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Morning Glory by Oasis and getting numeric fields", json)
    const data = await getNumericPitFields(json.tournamentName)
    res.status(200).json({ data })
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

// Returns the maximum value present across all performances for each numeric field
app.post("/getSchemaMaximaAcrossMatchScouting", validate(z.object({
  body: z.object({
    tournamentName: z.string({
        required_error: "Tournament name is required"
      }),
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Comedown by Bush and getting match schema maxima", json)
    const data = await getSchemaMaximaAcrossMatchScouting(json.tournamentName)
    res.status(200).json({ data })
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

// TODO: zod
// Returns the maximum value present across all pit scouts for each numeric field
app.post("/getSchemaMaximaAcrossPitScouting", async (req, res) => {
  const json = req.body
  console.log("Oceans by Pearl Jam and getting pit schema maxaima", json)
  const data = await getSchemaMaximaAcrossPitScouting(json.tournamentName)

  res.status(200).json({ data })
})

// // Returns the maximum value present across all performances for each numeric field
// app.post("/getSchemaAverages", validate(z.object({
//   body: z.object({
//     tournamentName: z.string({
//       required_error: "Tournament name is required"
//     }),
//   })
// })), async (req, res) => {
//   try {
//     const json = req.body
//     console.log("Californication by Red Hot Chili Peppers and getting schema maxima", json)
//     const data = await getSchemaMaxima(json.tournamentName)
    
//     res.status(200).json({ data })
//   } catch(e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
//   }
// })

app.post("/getTeamOverviewAcrossMatchScouting", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    teamName: z.string({
        required_error: "Team name is required"
      })
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Like a Stone by Audioslave and getting team overview", json)
    const data = await getTeamOverviewAcrossMatchScouting(json.tournamentName, json.teamName)

    res.status(200).json({ data })
  } catch(e){
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

// Gets all of the OPRs
app.post("/getOPRs", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    })
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Like a Stone by Audioslave and getting OPR", json)
    const data = await getOPRs(json.tournamentName)

    res.status(200).json({ data })
  } catch(e){
    console.log(e)
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

app.post("/getTeamOverviewAcrossPitScouting", validate(z.object({
  body: z.object({
    tournamentName: z.string({
      required_error: "Tournament name is required"
    }),
    teamName: z.string({
        required_error: "Team name is required"
      })
    })
  })), async (req, res) => {
  try {
    const json = req.body
    console.log("Dig by Incubus and getting team overview", json)
    const data = await getTeamOverviewAcrossPitScouting(json.tournamentName, json.teamName)

    res.status(200).json({ data })
  } catch(e){
    if (e instanceof Prisma.PrismaClientKnownRequestError) res.status(400).json({ e })
  }
})

// TODO: zod
app.post("/getSchemas", async (req, res) => {
  const json = req.body
  console.log("Bullet With Butterfly Wings by The Smashing Pumpkins and getting schemas", json)
  const data = await getSchemas(json.tournamentName)
  res.status(200).json({ data })
})

// technically this actually can be a GET method but for consistency its a post for now
app.post("/getTournaments", async (req, res) => {
  const data = await getTournaments()

  console.log("What I'm Becoming by Cage the Elephant and getting tournaments")

  res.status(200).json({ data })
})

// TODO: zod
app.post("/createNewTournament", async (req, res) => {
  const json = req.body
  console.log("Fly Away by Lenny Kravitz and creating new tournament", json)
  const data = await createNewTournament(json.tournamentName, json.pitSchema, json.matchSchema)

  res.status(200).json({ data })
})

// TODO: zod
// Creates a new team performance
app.post("/uploadMatchScoutForm", async (req, res) => {
  const json = req.body;
  console.log("The Bard's Song in the Forest by Blind Guardian and team performance added", req.body);
  const data = await putNewTeamPerformance(json);

  res.status(200).json({ data });
})

// TODO: zod
// Creates a new pit scout
app.post("/uploadPitScoutForm", async (req, res) => {
  const json = req.body;
  console.log("The Bard's Song in the Forest by Blind Guardian and team performance added", req.body);
  const data = await putNewPitScout(json);

  res.status(200).json({ data });
})

app.get("/", async (req, res) => {
  res.send("Welcome to the scouting app backend")
})

app.listen(3000, () => {
  console.log("Hearts on Fire by Hammerfall and Server Started!"); 
}); 

module.exports = app;

/* 
TODO List:
  Handle errors for posting
  wrap with try catch and return json, add error variable to every response, maybe status code

  address todo at top of put new team performance
*/
