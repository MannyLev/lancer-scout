import React, { useState, useEffect } from "react"

import axios from "axios"
import to from "await-to-js"

import validateSchema from "../scripts/validateSchema"
import { createNewTournament, getTournaments } from "../scripts/api"

const TournamentPage = () => {
    const [currentTournamentName, setCurrentTournamentName] = useState("")

    const [existingTournaments, setExistingTournaments] = useState([])
    const [selectedExistingTournament, setSelectedExistingTournmanet] = useState("")

    const [tournamentNameInput, setTournamentNameInput] = useState("")
    const [pitSchemaInput, setPitSchemaInput] = useState("")
    const [matchSchemaInput, setMatchSchemaInput] = useState("")

    useEffect(() => {
        if (localStorage.getItem("tournamentName") == null) localStorage.setItem("tournamentName", "")

        setCurrentTournamentName(localStorage.getItem("tournamentName"))

        getTournaments(setExistingTournaments)
    }, [])

    const handleSelectExistingTournament = () => {
        if(confirm(`All entries submitted from now on will be listed under the tournament "${selectedExistingTournament}". Are you sure you want to continue?`)){
            localStorage.setItem("tournamentName", selectedExistingTournament)
            localStorage.setItem("tab-state", "[]")

            setCurrentTournamentName(selectedExistingTournament)
        }
    }

    const handleCreateNewTournament = async () => {
        const [errPit, resPit] = await to(axios.get(pitSchemaInput))
        if (errPit) return alert("Unable to retrieve the provided URL. Please make sure you are connected to wifi and the provided URL exists.")
        const rawSchemaPit = resPit.data
        const statusPit = validateSchema(rawSchemaPit, "Pit")
        if (!statusPit.success) return alert(statusPit.reason)
        const pitSchema = typeof rawSchemaPit == "string" ? rawSchemaPit : JSON.stringify(rawSchemaPit)

        const [errMatch, resMatch] = await to(axios.get(matchSchemaInput))
        if (errMatch) return alert("Unable to retrieve the provided URL. Please make sure you are connected to wifi and the provided URL exists.")
        const rawSchemaMatch = resMatch.data
        const statusMatch = validateSchema(rawSchemaMatch, "Match")
        if (!statusMatch.success) return alert(statusMatch.reason)

        const matchSchema = typeof rawSchemaMatch == "string" ? rawSchemaMatch : JSON.stringify(rawSchemaMatch)

        createNewTournament(tournamentNameInput, pitSchema, matchSchema, (success) => {
            if (!success) alert("A tournament already exists with this name.")
            else {
                alert("Successfully created tournament. To use this tournament refresh the page,select it in the above menu, and apply.")
            }
        })
    }

    const existingTournamentOptions = []
    existingTournaments.forEach((existingTournament, index) => {
        existingTournamentOptions.push(
            <option key={index}>
                {
                    existingTournament.title
                }
            </option>
        )
    })

    return (
        <React.Fragment>
            <h1>Tournament Management</h1>
            <div className={"standard-content-container"}>
                <div className={"info-container"}>
                    <label>
                        Current Tournament Name: <b>{ currentTournamentName || "[N/A]" }</b>
                    </label>
                    <hr style={{ width: "540px" }} />
                    <label>
                        Switch To Existing Tournament: <select onChange={(e) => setSelectedExistingTournmanet(e.target.value)}>
                            <option />
                            {
                                existingTournamentOptions
                            }
                        </select>
                    </label>
                    <div className={"button"} onClick={handleSelectExistingTournament}>Apply</div>
                </div>
                <div className={"info-container"}>
                    <label><b>Create New Tournament</b></label>
                    <hr style={{ width: "540px" }} />
                    <label>Tournament Name: <input className={"tournament-input"} type={"text"} value={tournamentNameInput} onChange={(e) => setTournamentNameInput(e.target.value)} /></label>
                    <label>Pit Schema URL: <input className={"tournament-input"} type={"text"} value={pitSchemaInput} onChange={(e) => setPitSchemaInput(e.target.value)} /></label>
                    <label>Match Schema URL: <input className={"tournament-input"} type={"text"} value={matchSchemaInput} onChange={(e) => setMatchSchemaInput(e.target.value)} /></label>
                    <div className={"button"} onClick={handleCreateNewTournament}>Create</div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TournamentPage