import {prisma} from "./index";

// Finds the Pythagorean expectation of an alliance
export async function getPythagoreanExpectation(tournamentName: string, firstTeamName: string, secondTeamName: string, thirdTeamName: string) {
    
    // Finds the matches of the first team
    const firstTeamMatches = await prisma.teamPerformance.findMany({
        where: {
            teamName: firstTeamName,
            match: {
                tournament: {
                    title: tournamentName
                }
            }
        }
    });

    // Finds the sum of the first team's alliance scores
    let firstTeamPointsSum: number = 0;
    for (let i = 0; i < firstTeamMatches.length; i++) {
        firstTeamPointsSum += firstTeamMatches.score[i]; // TODO: Make points required in the schema
    }

    // Finds the sum of the first team's opposing alliance scores
    let firstTeamOpposingSum: number = 0;
    for (let i = 0; i < firstTeamMatches.length; i++) {
        firstTeamOpposingSum += firstTeamMatches.opposingScore[i];
    }

    // Finds the matches of the second team
    const secondTeamMatches = await prisma.teamPerformance.findMany({
        where: {
            teamName: secondTeamName,
            match: {
                tournament: {
                    title: tournamentName
                }
            }
        }
    });
      // Finds the sum of the first team's scores
    let secondTeamPointsSum: number = 0;
    for(let i = 0; i < secondTeamMatches.length; i++) {
        secondTeamPointsSum += secondTeamMatches.score[i];
    }  
    // Finds the sum of the second team's opposing alliance scores
    let secondTeamOpposingSum: number = 0;
    for(let i = 0; i < secondTeamMatches.length; i++) {
        secondTeamOpposingSum += secondTeamMatches.opposingScore[i];
    }

    // Finds the matches of the third team
    const thirdTeamMatches = await prisma.teamPerformance.findMany({
        where: {
            teamName: thirdTeamName,
            match: {
                tournament: {
                    title: tournamentName
                }
            }
        }
    });

    let thirdTeamPointSum: number = 0;
    for (let  i = 0; i < thirdTeamMatches.length; i++) {
        thirdTeamPointSum += thirdTeamMatches.score[i];
    }

    let thirdTeamOpposingPointSum: number = 0;
    for (let i = 0; i < thirdTeamMatches.length; i++) {
        thirdTeamOpposingPointSum += thirdTeamMatches.opposingScore[i]; 
    }

    // Adds up the whole alliance's sums and opposing alliance's sum
    let allianceSum: number = firstTeamPointsSum + secondTeamPointsSum + thirdTeamPointSum;
    let opposingSum: number = firstTeamOpposingSum + secondTeamOpposingSum + thirdTeamOpposingPointSum;

    // Calculates Pythagorean expectation
    let finalValue: number = 1 / (1 + Math.pow(opposingSum / allianceSum, 2));
    return finalValue;
}