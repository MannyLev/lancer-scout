import { match } from "assert";
import { prisma } from "./index";
import { JsonObject } from "@prisma/client/runtime/library";
import * as math from "mathjs";

export async function getOPRs(tournamentName: string) {
    console.log(math);
    console.log("a")

    const matches = await prisma.match.findMany({
        where: {
            tournament: {title: tournamentName}
        }
    })

    console.log("b", {matches})

    const teamNames = (await prisma.teamPerformance.findMany({
        where: {
            match: {tournament: {title: tournamentName}}
        },
        distinct: ['teamName'] // TODO: Does this work?
    })).map(teamPerformance => teamPerformance.teamName)

    console.log("c", {teamNames})

    // TODO: Require the alliance color as part of the schema

    // TODO: Discard data if it has two teams

    // Creates an array where each index is assigned to the number of points scored in that match for red alliance
    // let redMatchScores: Array<number> = [];

    // TODO: resolve async stuff inside of Promise.all() like the following, perchance, balls, cock and stuff
    // https://stackoverflow.com/questions/65167410/wait-for-array-map-iterations-in-promise-all

    // for (let j = 0; j < matches.length; j++) {

    //     console.log(j)
    //     const matchTeamPerformances = await prisma.teamPerformance.findMany({
    //         where: {
    //             match: {
    //                 matchNumber: matches[j].matchNumber
    //             },
    //             jsonScoutInput: {
    //                 path: ['Alliance Color'],
    //                 equals: 'RED',
    //             },
    //         }
        
    //     });
    //     console.log(matchTeamPerformances);
    //     // TODO: make sure matchTeamPerformance[0] exists (check length > 0)
    //     if (redMatchScores.length !== 0) {
    //         redMatchScores.push((matchTeamPerformances[0].jsonScoutInput as JsonObject)["Score"] as number)
    //     };
    // }

    // console.log(redMatchScores);

    // Creates an array where each index is assigned to the number of points scored in that match for blue alliance

    // let blueMatchScores: Array<number> = [];
    // for (let j = 0; j < matches.length; j++) {
    //     console.log("we are at ", j)
    //     const matchTeamPerformances = await prisma.teamPerformance.findMany({
    //         where: {
    //             match: {
    //                 matchNumber: matches[j].matchNumber
    //             },
    //             jsonScoutInput: {
    //                 path: ['Alliance Color'],
    //                 equals: 'BLUE',
    //             },
    //         }
        
    //     });
    //     if (blueMatchScores.length !== 0) {
    //         blueMatchScores.push((matchTeamPerformances[0].jsonScoutInput as JsonObject)["Score"] as number)
    //     };
    // }

    // console.log("penis", { redMatchScores, blueMatchScores })

    // Creates a binary array the length of the 2 * matches and width of the number of teams,
    let teamPresentMatrix = math.zeros(2 * matches.length, teamNames.length) as math.Matrix;
    let scoresMatrix = math.zeros(2* matches.length, 1) as math.Matrix; // TODO: make sure the array is oriented correctly

    console.log("balls", { teamPresentMatrix, scoresMatrix })

    // Red is even numbers, blue is odd
    console.log(teamNames);
    for (let i = 0; i < matches.length; i++) {
        const teamPerformancesInMatchI = await prisma.teamPerformance.findMany({
            where: {
                match: {
                    matchNumber: matches[i].matchNumber,
                    tournament: {title: tournamentName}
                },
            }, 
            include: {match: true}
        });
        console.log(i, ", ", matches[i].matchNumber, ", ", teamPerformancesInMatchI)
        for (let j = 0; j < teamPerformancesInMatchI.length; j++) {
            console.log(teamPerformancesInMatchI[j].match?.tournamentId);
            for (let k = 0; k < teamNames.length; k++) {
                if (teamNames[k] === teamPerformancesInMatchI[j].teamName) {
                    // Find something to get team name from index
                    let color = (teamPerformancesInMatchI[j].jsonScoutInput as JsonObject)["Alliance Color"];
                    if (color == "RED") {
                        teamPresentMatrix.set([2 * i, k], 1);
                        scoresMatrix.set([2 * i, 0], (teamPerformancesInMatchI[j].jsonScoutInput as JsonObject)["Score"]);
                    }
                    else if (color == "BLUE") {
                        teamPresentMatrix.set([2 * i + 1, k], 1);
                        scoresMatrix.set([2 * i + 1, 0], (teamPerformancesInMatchI[j].jsonScoutInput as JsonObject)["Score"]);
                    }
                }
            }
        }
    }
    // https://github.com/KaiPereira/FTC-OPR-Calculator/blob/main/app/pages/api/rankings.js I hope this is right
    let pseudoInverse;
    try { 
        pseudoInverse = math.multiply(math.multiply(math.transpose(teamPresentMatrix), math.inv(math.multiply(teamPresentMatrix, math.transpose(teamPresentMatrix)))), scoresMatrix) 
    } catch {
        pseudoInverse = math.multiply(math.matrix(math.pinv(teamPresentMatrix)), scoresMatrix);
    }

    return { pseudoInverse, teamNames };

}