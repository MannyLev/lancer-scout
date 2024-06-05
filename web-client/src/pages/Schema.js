import React, { useState, useEffect } from "react"

import VirtualDragList from "react-virtual-drag-list"

import RequiredSchemaEntry from "../components/RequiredSchemaEntry"
import CustomSchemaEntry from "../components/OptionalSchemaEntry"

import validateSchema from "../scripts/validateSchema"

const generateEmptyMatchSchema = () => {
    return [
        {
            id: "optional-pregameHeader",
            title: "Pregame",
            ui: {
                type: "header"
            }
        },
        {
            id: "required-matchNumber",
            title: "Match Number",
            ui: {
                type: "number"
            },
            dataType: "8bit"
        },
        {
            id: "optional-scoutName",
            title: "Scout Name",
            ui: {
                type: "text",
                maxLength: 50
            }
        },
        {
            id: "required-teamName",
            title: "Team Name",
            ui: {
                type: "dropdown",
                options: []
            }
        },
        {
            id: "required-allianceColor",
            title: "Alliance Color",
            ui: {
                type: "radio",
                options: [ "Red", "Blue" ]
            }
        },
        {
            id: "optional-postgameHeader",
            title: "Postgame",
            ui: {
                type: "header"
            }
        },
        {
            id: "required-allianceScore",
            title: "Alliance Score",
            ui: {
                type: "number"
            },
            dataType: "8bit"
        },
        {
            id: "required-opponentScore",
            title: "Opponent Score",
            ui: {
                type: "number"
            },
            dataType: "8bit"
        }
    ]
}

const generateEmptyPitSchema = () => {
    return [
        {
            id: "optional-scoutName",
            title: "Scout Name",
            ui: {
                type: "text",
                maxLength: 50
            }
        },
        {
            id: "required-teamName",
            title: "Team Name",
            ui: {
                type: "dropdown",
                options: []
            }
        }
    ]
}

const SchemaPage = () => {
    const [workingMatchSchema, setWorkingMatchSchema] = useState(JSON.parse(localStorage.getItem("working-match-schema")) || generateEmptyMatchSchema())
    const [workingPitSchema, setWorkingPitSchema] = useState(JSON.parse(localStorage.getItem("working-pit-schema")) || generateEmptyPitSchema())

    useEffect(() => localStorage.setItem("working-match-schema", JSON.stringify(workingMatchSchema)), [workingMatchSchema])
    useEffect(() => localStorage.setItem("working-pit-schema", JSON.stringify(workingPitSchema)), [workingPitSchema])

    const addMatchEntry = () => {
        const updatedSchema = [...workingMatchSchema, {
            id: "custom-" + Math.random().toString(),
            title: "New Entry",
            ui: {
                type: ""
            }
        }]

        setWorkingMatchSchema(updatedSchema)
    }

    const addPitEntry = () => {
        const updatedSchema = [...workingPitSchema, {
            id: "custom-" + Math.random().toString(),
            title: "New Entry",
            ui: {
                type: ""
            }
        }]

        setWorkingPitSchema(updatedSchema)
    }

    const exportMatchJSON = () => {
        const formatted = [...workingMatchSchema]

        formatted.forEach(entry => {
            if (entry.ui.type == "text") entry.dataType = "string"
            else if(entry.ui.type == "slider") entry.dataType = "4bit"
            else if(entry.ui.type == "toggle") entry.dataType = "boolean"
            else if(entry.ui.type == "radio" || entry.ui.type == "dropdown") {
                entry.ui.options = entry.ui.options.map(option => option.trim())

                let expectedDataType = "1bit"

                if (entry.ui.options.length > Math.pow(2, 1)) expectedDataType = "2bit"
                if (entry.ui.options.length > Math.pow(2, 2)) expectedDataType = "4bit"
                if (entry.ui.options.length > Math.pow(2, 4)) expectedDataType = "6bit"
                if (entry.ui.options.length > Math.pow(2, 6)) expectedDataType = "8bit"
                if (entry.ui.options.length > Math.pow(2, 8)) expectedDataType = "16bit"

                entry.dataType = expectedDataType
            }
        })
        
        const validationResult = validateSchema(formatted, "Match")

        if(validationResult.success){
            const download = document.createElement("a")

            download.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(formatted, null, 4)))
            download.setAttribute("download", "match-schema-" + new Date().toLocaleDateString() + ".json")

            download.click()
        } else {
            alert(validationResult.reason)
        }
    }

    const exportPitJSON = () => {
        const formatted = [...workingPitSchema]

        formatted.forEach(entry => {
            if (entry.ui.type == "text") entry.dataType = "string"
            else if(entry.ui.type == "slider") entry.dataType = "4bit"
            else if(entry.ui.type == "toggle") entry.dataType = "boolean"
            else if(entry.ui.type == "radio" || entry.ui.type == "dropdown") {
                entry.ui.options = entry.ui.options.map(option => option.trim())

                let expectedDataType = "1bit"

                if (entry.ui.options.length > Math.pow(2, 1)) expectedDataType = "2bit"
                if (entry.ui.options.length > Math.pow(2, 2)) expectedDataType = "4bit"
                if (entry.ui.options.length > Math.pow(2, 4)) expectedDataType = "6bit"
                if (entry.ui.options.length > Math.pow(2, 6)) expectedDataType = "8bit"
                if (entry.ui.options.length > Math.pow(2, 8)) expectedDataType = "16bit"

                entry.dataType = expectedDataType
            }
        })
        
        const validationResult = validateSchema(formatted, "Pit")

        if(validationResult.success){
            const download = document.createElement("a")

            download.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(formatted, null, 4)))
            download.setAttribute("download", "pit-schema-" + new Date().toLocaleDateString() + ".json")

            download.click()
        } else {
            alert(validationResult.reason)
        }
    }

    const importMatchJSON = () => {
        const importedSchemaString = prompt("Paste an the JSON (not url) for an existing match schema created with the Lancer Scout schema builder.")

        const validationResult = validateSchema(importedSchemaString, "Match")

        if (!validationResult.success) return alert(validationResult.reason)

        const schema = JSON.parse(importedSchemaString)

        const hasIds = schema.every(entry => entry.id && typeof entry.id == "string")
        
        if(hasIds){
            if(confirm("Are you sure you would like to overwrite the working match schema with the imported one?")){
                setWorkingMatchSchema(schema)
            }
        } else alert("No internal ids were attached to schema entries which means it was likely built by hand. Only schemas created with the Lancer Scout schema builder can be imported.")
    }

    const importPitJSON = () => {
        const importedSchemaString = prompt("Paste an the JSON (not url) for an existing pit schema created with the Lancer Scout schema builder.")

        const validationResult = validateSchema(importedSchemaString, "Pit")

        if (!validationResult.success) return alert(validationResult.reason)

        const schema = JSON.parse(importedSchemaString)

        const hasIds = schema.every(entry => entry.id && typeof entry.id == "string")
        
        if(hasIds){
            if(confirm("Are you sure you would like to overwrite the working pit schema with the imported one?")){
                setWorkingPitSchema(schema)
            }
        } else alert("No internal ids were attached to schema entries which means it was likely built by hand. Only schemas created with the Lancer Scout schema builder can be imported.")
    }

    return (
        <React.Fragment>
            <h1>Schema Builder</h1>
            <div style={{ display: "flex", flexDirection: "row" }} className={"standard-content-container"}>
                <div className={"info-container"}>
                    <h2>Working Match Schema</h2>
                    <VirtualDragList dataKey={"id"} dataSource={workingMatchSchema} lockAxis={"x"} v-drop={({ list }) => {
                        if (JSON.stringify(workingMatchSchema) != JSON.stringify(list)) setWorkingMatchSchema(list)
                    }}>
                        {
                            (item, index) => {
                                return item.id.startsWith("required") ? <RequiredSchemaEntry index={index} workingSchema={workingMatchSchema} setWorkingSchema={setWorkingMatchSchema} /> : <CustomSchemaEntry index={index} workingSchema={workingMatchSchema} setWorkingSchema={setWorkingMatchSchema} />
                            }
                        }
                    </VirtualDragList>
                    <div className={"button"} onClick={addMatchEntry}>Add Entry</div>
                    <div className={"button"} onClick={exportMatchJSON}>Export to JSON</div>
                    <hr />
                    <div className={"button"} onClick={importMatchJSON}>Import from JSON</div>
                </div>
                <div style={{ width: "20px", flexShrink: 0 }} />
                <div className={"info-container"}>
                    <h2>Working Pit Schema</h2>
                    <VirtualDragList dataKey={"id"} dataSource={workingPitSchema} lockAxis={"x"} v-drop={({ list }) => {
                        if (JSON.stringify(workingPitSchema) != JSON.stringify(list)) setWorkingPitSchema(list)
                    }}>
                        {
                            (item, index) => {
                                return item.id.startsWith("required") ? <RequiredSchemaEntry index={index} workingSchema={workingPitSchema} setWorkingSchema={setWorkingPitSchema} /> : <CustomSchemaEntry index={index} workingSchema={workingPitSchema} setWorkingSchema={setWorkingPitSchema} />
                            }
                        }
                    </VirtualDragList>
                    <div className={"button"} onClick={addPitEntry}>Add Entry</div>
                    <div className={"button"} onClick={exportPitJSON}>Export to JSON</div>
                    <hr />
                    <div className={"button"} onClick={importPitJSON}>Import from JSON</div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SchemaPage