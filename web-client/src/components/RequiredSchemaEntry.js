import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

const RequiredSchemaEntry = ({ index, workingSchema, setWorkingSchema }) => {
    const setAttribute = (attribute, value) => {
        const temp = [...workingSchema]

        temp[index].ui[attribute] = value

        setWorkingSchema(temp)
    }

    const setDataType = (dataType) => {
        const temp = [...workingSchema]

        temp[index].dataType = dataType

        setWorkingSchema(temp)
    }

    const bitsToMaxMap = {
        "1bit": "1",
        "2bit": "3",
        "4bit": "15",
        "6bit": "63",
        "8bit": "255",
        "16bit": "65535"
    }

    const maxToBitsMap = {
        "1": "1bit",
        "3": "2bit",
        "15": "4bit",
        "63": "6bit",
        "255": "8bit",
        "65535": "16bit"
    }

    if (index >= workingSchema.length) return null

    return (
        <div className={"schema-entry-wrapper"}>
            <div className={"schema-entry-content"}>
                <div className={"attribute"}>
                    <label>Title:</label>
                    <input value={workingSchema[index].title} onChange={() => {}} />
                </div>
                <div className={"attribute"}>
                    <label>Type:</label>
                    <select defaultValue={workingSchema[index].ui.type}>
                        <option>
                            {
                                workingSchema[index].ui.type
                            }
                        </option>
                    </select>
                </div>
                {
                    !(["header", "toggle", "slider", ""].includes(workingSchema[index].ui.type)) && (
                        <React.Fragment>
                            <hr />
                            {
                                (workingSchema[index].ui.type == "dropdown" || workingSchema[index].ui.type == "radio") ? (
                                    <div className={"attribute"}>
                                        <label>Options (comma separated):</label>
                                        <input value={workingSchema[index].ui.options ? workingSchema[index].ui.options.join(",") : ""} onChange={(e) => setAttribute("options", e.nativeEvent.target.value.split(","))} />
                                    </div>
                                ) : workingSchema[index].ui.type == "text" ? (
                                    <div className={"attribute"}>
                                        <label>Max Length:</label>
                                        <input type={"number"} value={workingSchema[index].ui.maxLength} onChange={(e) => setAttribute("maxLength", Number(e.nativeEvent.target.value))} />
                                    </div>
                                ) : (workingSchema[index].ui.type == "number" || workingSchema[index].ui.type == "timer") && (
                                    <div className={"attribute"}>
                                        <label>Max Value:</label>
                                        <select value={bitsToMaxMap[workingSchema[index].dataType] || ""} onChange={(e) => setDataType(maxToBitsMap[e.nativeEvent.target.value])}>
                                            <option />
                                            <option>1</option>
                                            <option>3</option>
                                            <option>15</option>
                                            <option>63</option>
                                            <option>255</option>
                                            <option>65535</option>
                                        </select>
                                    </div>
                                )
                            }
                        </React.Fragment>
                    )
                }
            </div>
            <div className={"delete-disallowed"}>
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div className={"drag"}>
                <FontAwesomeIcon icon={faBars} />
            </div>
        </div>
    )
}

export default RequiredSchemaEntry