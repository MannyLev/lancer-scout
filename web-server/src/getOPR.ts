import { match } from "assert";
import { prisma } from "./index";
import { JsonObject } from "@prisma/client/runtime/library";
import math, { matrix } from "mathjs";

export async function getOPRs(tournamentName: string) {
    const matches = await prisma.match.findMany({
        where: {
            tournament: {title: tournamentName}
        }
    })

    // TODO: Fix this to create an array of all team names
    const numberOfTeams = await prisma.teamPerformance.findUnique({

    })

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
    let teamPresentMatrix = math.zeros(matches.length, numberOfTeams.length);

    // TODO: Create an array to add ones to the array if present in the match

    // TODO: Create a matrix to add the red alliance and blue alliance scores to the match

}