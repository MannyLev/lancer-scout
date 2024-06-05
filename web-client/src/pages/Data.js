import React, { useState, useRef, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"

import TeamOverview from "../components/data/TeamOverview"
import TeamPerformance from "../components/data/TeamPerformance"
import TeamComparison from "../components/data/TeamComparison"
import MatchOverview from "../components/data/MatchOverview"
import PitScoutOverview from "../components/data/PitScoutOverview"
import { getNumericFields, getNumericMatchFields, getNumericPitFields, getTeamNamesAcrossMatchScouting } from "../scripts/api"
import StatRanking from "../components/data/StatRanking"

const DataPage = () => {
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const [tabs, setTabs] = useState(JSON.parse(localStorage.getItem("tab-state")) || [])

    const [showAddOptions, setShowAddOptions] = useState(false)
    const addButtonRef = useRef()

    // list of all keys in the schema that point to a numeric data type, (should be called from server?)
    const [numericMatchKeys, setNumericMatchKeys] = useState([])
    const [numericPitKeys, setNumericPitKeys] = useState([])
    const [teamNames, setTeamNames] = useState([])

    useEffect(() => {
        getNumericMatchFields(setNumericMatchKeys)
        getNumericPitFields(setNumericPitKeys)
        getTeamNamesAcrossMatchScouting(setTeamNames)

        const handleClick = (e) => {
            if(addButtonRef.current && !addButtonRef.current.contains(e.target)){
                setShowAddOptions(false)
            }
        }

        addEventListener("click", handleClick)

        return () => removeEventListener("click", handleClick)
    }, [])

    useEffect(() => {
        localStorage.setItem("tab-state", JSON.stringify(tabs))
    }, [tabs])

    const addTab = (tab) => {
        const temp = [...tabs]

        temp.push(tab)

        setCurrentTabIndex(temp.length - 1)
        setTabs(temp)
        setShowAddOptions(false)
    }

    const addPitScoutOverview = () => addTab({
        type: "Pit Scout Overview",
        title: "Pit Scout Overview",
        state: {
            query: null,
            toggleables: numericPitKeys.map(key => ({ key, show: true, label: key })),
            variationKey: null,
            xAxisKey: null,
            yAxisKey: null
        }
    })

    const addTeamOverview = () => addTab({
        type: "Team Overview",
        title: "Team Overview",
        state: {
            query: null,
            toggleables: numericMatchKeys.map(key => ({ key, show: true, label: key })),
            variationKey: null,
            xAxisKey: null,
            yAxisKey: null
        }
    })

    const addTeamPerformance = () => addTab({
        type: "Team Performance",
        title: "Team Performance",
        state: {
            multiQuery: {
                team: null,
                match: null,
                record: null
            },
            toggleables: numericMatchKeys.map(key => ({ key, show: true, label: key }))
        }
    })

    const addTeamComparison = () => addTab({
        type: "Team Comparison",
        title: "Team Comparison",
        state: {
            teamToggleables: teamNames.map(key => ({ key, show: true, label: key })),
            keyToggleables: numericMatchKeys.map(key => ({ key, show: true, label: key }))
        }
    })

    const addMatchOverview = () => addTab({
        type: "Match Overview",
        title: "Match Overview",
        state: {
            counter: 0
        }
    })

    const addStatRanking = () => addTab({
        type: "Stat Ranking",
        title: "Stat Ranking",
        state: {
            query: null
        }
    })

    const tabRenders = []

    tabs.forEach((tab, index) => {
        const deleteTab = (e) => {
            e.stopPropagation()

            const confirmed = confirm("Are your sure you want to delete this tab? You will not be able to recover it.")

            if(confirmed){
                const temp = [...tabs]
                
                temp.splice(index, 1)

                if (index < currentTabIndex || (index == currentTabIndex && index == tabs.length - 1)) setCurrentTabIndex(currentTabIndex - 1)

                setTabs(temp)
            }
        }

        tabRenders.push(
            <div key={index} className={"tab " + ((index == currentTabIndex) ? "active" : "inactive")} onClick={() => setCurrentTabIndex(index)}>
                {
                    tab.title
                }
                <div className={"delete-container"} onClick={deleteTab}>
                    <FontAwesomeIcon icon={faXmark} className={"delete-svg"} />
                </div>
            </div>
        )
    })

    let ContentComponent = () => (
        <React.Fragment>
            <h1>Data Analysis</h1>
            <p>(Start By Adding Some Tabs)</p>
        </React.Fragment>
    )

    if(tabs.length != 0){
        switch(tabs[currentTabIndex].type){
            case "Pit Scout Overview":
                ContentComponent = PitScoutOverview
                break
            case "Team Overview":
                ContentComponent = TeamOverview
                break
            case "Team Performance":
                ContentComponent = TeamPerformance
                break
            case "Team Comparison":
                ContentComponent = TeamComparison
                break
            case "Match Overview":
                ContentComponent = MatchOverview
                break
            case "Stat Ranking":
                ContentComponent = StatRanking
                break
        }
    }

    return (
        <React.Fragment>
            <div className={"tabs-container"}>
                <div className={"add"}>
                    <div ref={addButtonRef} className={"icon-container"} onClick={() => setShowAddOptions(true)}>
                        <FontAwesomeIcon icon={faPlus} className={"icon-svg"} />
                    </div>
                </div>
                {
                    tabRenders
                }
            </div>
            {
                showAddOptions && (
                    <div className={"tab-options-menu"}>
                        <div className={"option"} onClick={addPitScoutOverview}>Pit Scout Overview</div>
                        <div className={"option"} onClick={addTeamOverview}>Team Overview</div>
                        <div className={"option"} onClick={addTeamPerformance}>Team Performance</div>
                        <div className={"option"} onClick={addTeamComparison}>Team Comparison</div>
                        {/*  <div className={"option"} onClick={addMatchOverview}>Match Overview</div> */}
                        <div className={"option"} onClick={addStatRanking}>Stat Ranking</div>
                    </div>
                )
            }
            <div className={"tab-content-container"}>
                <ContentComponent state={tabs[currentTabIndex]?.state} setState={(state) => {
                    const temp = [...tabs]

                    temp[currentTabIndex].state = state

                    setTabs(temp)
                }} />
            </div>
        </React.Fragment>
    )
}

export default DataPage