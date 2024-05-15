import { match } from "assert";
import { prisma } from "./index";
import { JsonObject } from "@prisma/client/runtime/library";
import math, { Matrix, matrix } from "mathjs";

export async function getOPRs(tournamentName: string) {
    const matches = await prisma.match.findMany({
        where: {
            tournament: {title: tournamentName}
        }
    })

    const numberOfTeams = await prisma.teamPerformance.findMany({
        where: {
            match: {tournament: {title: tournamentName}}
        },
        distinct: ['teamName'] // TODO: Does this work?
    })

    const teamNames = numberOfTeams.map(teamPerformance => teamPerformance.teamName);

    // TODO: Require the alliance color as part of the schema

    // TODO: Discard data if it has two teams

    // Creates an array where each index is assigned to the number of points scored in that match for red alliance
    let redMatchScores: Array<number> = [];
    for (let j = 0; j < matches.length; j++) {
        const matchTeamPerformances = await prisma.teamPerformance.findMany({
            where: {
                match: {
                    matchNumber: matches[j].matchNumber
                },
                jsonScoutInput: {
                    path: ['Alliance'],
                    equals: 'Red',
                },
            }
        
        });
        redMatchScores[j] = (matchTeamPerformances[0].jsonScoutInput as JsonObject)["Score"] as number;
    }

    // Creates an array where each index is assigned to the number of points scored in that match for blue alliance

    let blueMatchScores: Array<number> = [];
    for (let j = 0; j < matches.length; j++) {
        const matchTeamPerformances = await prisma.teamPerformance.findMany({
            where: {
                match: {
                    matchNumber: matches[j].matchNumber
                },
                jsonScoutInput: {
                    path: ['Alliance'],
                    equals: 'Blue',
                },
            }
        
        });
        blueMatchScores[j] = (matchTeamPerformances[0].jsonScoutInput as JsonObject)["Score"] as number;
    }

    // Creates a binary array the length of the 2 * matches and width of the number of teams,
    let teamPresentMatrix = math.zeros(2 * matches.length, numberOfTeams.length) as Matrix;
    let scoresMatrix = math.zeros(2* matches.length, 1) as Matrix; // TODO: make sure the array is oriented correctly

    // Red is even numbers, blue is odd
    for (let i = 0; i < matches.length; i++) {
        const teamPerformances = await prisma.teamPerformance.findMany({
            where: {
                match: {
                    matchNumber: matches[i].matchNumber
                }
            }
        });
        for (let j = 0; j < teamPerformances.length; j++) {
            for (let k = 0; k < teamNames.length; k++) {
                if (teamNames[k] === teamPerformances[j].teamName) {
                    // Find something to get team name from index
                    let color = (teamPerformances[j].jsonScoutInput as JsonObject)["allianceColor"];
                    if (color == "RED") {
                        teamPresentMatrix.set([2 * i, k], 1);
                        scoresMatrix.set([2 * i], (teamPerformances[j].jsonScoutInput as JsonObject)["score"]);
                    }
                    else if (color == "BLUE") {
                        teamPresentMatrix.set([2 * i + 1, k], 1);
                        scoresMatrix.set([2 * i + 1], (teamPerformances[j].jsonScoutInput as JsonObject)["score"]);
                    }
                }
            }
        }
    }

    let result = math.dotMultiply(math.inv(math.dotMultiply(math.transpose(scoresMatrix), teamPresentMatrix)), teamPresentMatrix);
}