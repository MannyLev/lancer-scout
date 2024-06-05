import { getOPRs } from "./getOPR";
import { getNumericMatchFields, getTeamNamesAcrossMatchScouting, getTeamOverviewAcrossMatchScouting } from "../../scripts/api"
import React, { useEffect, useState } from "react"
import BarChart from "../BarChart"

const OPRRanking = ({ state, setState }) => {
    const { query } = state

    const [queryOptions, setQueryOptions] = useState([])

    const [queriedData, setQueriedData] = useState([])

    useEffect(() => {
        getNumericMatchFields(setQueryOptions)
    }, [])

    useEffect(() => {
        if (!query) return setQueriedData([])

        // TODO: this is slow and redundant

    getTeamNamesAcrossMatchScouting((teamNames) => {
        Promise.all(teamNames.map(teamName => {
            return new Promise((resolve) => {
                getTeamOverviewAcrossMatchScouting(teamName, (teamPerformances) => {
                    for (let i = 0; i < teamNames.length; i++) {
                        if (getOPRs(tournamentName).teamNames[i] == teamNames[i]) { // is this right
                            resolve({ teamName, stats: getOPRs.pseudoinverse[i]})
                        }
                        else {
                            resolve({ teamName, stats: 0.0 })
                        }
                    }
                })
            })
        }))
    })
}, [query])

    const setQuery = (newQuery) => {
        const temp = {...state}

        temp.query = newQuery

        setState(temp)
    }

    const options = []

    queryOptions.forEach((option) => {
        options.push(
            <option key={option}>
                {
                    option
                }
            </option>
        )
    })

    return (
        <React.Fragment>
            <div style={{ textAlign: "center", paddingTop: 20 }}>
                <div className={"query-segments"}>
                    <div className={"query-segment"}>
                        Field
                        <select value={query || ""} onChange={(e) => {
                            setQuery(e.target.value || null)
                        }}>
                            <option />
                            {
                                options
                            }
                        </select>
                    </div>
                </div>
            </div>
            <h1>
                {
                    `${query || "[N/A]"} Ranking`
                }
            </h1>
            {
                query && (
                    <React.Fragment>
                        <hr />
                        <BarChart stats={queriedData} />
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )
}

export default StatRanking