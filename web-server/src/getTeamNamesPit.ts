import { prisma } from "./index";

// Gets all of the team names in pit scouting
export async function getTeamNamesPit(tournamentName: string) {
    const pitScouts = await prisma.pitScout.findMany({
        where: {
            tournament: {
                title: tournamentName
            }
        }
    });

    const teamNames = pitScouts.map(pitScout => pitScout.teamName);

    
    return teamNames
}