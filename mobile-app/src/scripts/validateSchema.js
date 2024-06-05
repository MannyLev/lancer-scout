const failureStatus = (reason, errorData=null) => {
    console.log(errorData)

    return { success: false, reason: "Provided schema " + reason }
}

const validateSchema = (schema, mode) => {
    if (typeof schema == "string") {
        try {
            schema = JSON.parse(schema)
        } catch (e) {
            return failureStatus("string is not valid json", schema)
        }
    }

    if (!Array.isArray(schema)) return failureStatus("is not an array", schema)

    const promptTitles = []

    for(let i = 0;i<schema.length;i++){
        const prompt = schema[i]

        if (typeof prompt != "object" || prompt == null || Array.isArray(prompt)) return failureStatus("has a non object prompt", prompt)

        if (!prompt.title) return failureStatus("has a prompt without a title", prompt)

        if (promptTitles.includes(prompt.title)) return failureStatus("has prompts with duplicate titles", prompt)
        promptTitles.push(prompt.title)

        if (!prompt.ui) return failureStatus("has a prompt without a ui", prompt)
        if (prompt.ui.type != "header" && !prompt.dataType) return failureStatus("has a prompt without a data type", prompt)

        if (![ "header", "text", "number", "timer", "slider", "toggle", "radio", "dropdown" ].includes(prompt.ui.type)) return failureStatus("has an invalid ui type", prompt)

        switch(prompt.ui.type){
            case "header":
                break
            case "text":
                if (!prompt.ui.maxLength || typeof prompt.ui.maxLength != "number") return failureStatus("has an invalid max length for a text prompt", prompt)
                if (prompt.dataType != "string") return failureStatus("has a data type other than 'string' attached to a text prompt", prompt)
                break
            case "number":
            case "timer":
                if (![ "1bit", "2bit", "4bit", "6bit", "8bit", "16bit" ].includes(prompt.dataType)) return failureStatus("has an invalid data type attached to a number prompt", prompt)
                break
            case "slider":
                if (prompt.dataType != "4bit") return failureStatus("has a data type other than '4bit' attached to slider prompt", prompt)
                break
            case "toggle":
                if (prompt.dataType != "boolean") return failureStatus("has a data type other than 'boolean' attached to a toggle prompt", prompt)
                break
            case "radio":
            case "dropdown":
                if (!prompt.ui.options || !Array.isArray(prompt.ui.options) || !prompt.ui.options.every(option => typeof option == "string")) return failureStatus("has an invalid options array for a selection based prompt", prompt)

                let expectedDataType = "1bit"

                if (prompt.ui.options.length > Math.pow(2, 1)) expectedDataType = "2bit"
                if (prompt.ui.options.length > Math.pow(2, 2)) expectedDataType = "4bit"
                if (prompt.ui.options.length > Math.pow(2, 4)) expectedDataType = "6bit"
                if (prompt.ui.options.length > Math.pow(2, 6)) expectedDataType = "8bit"
                if (prompt.ui.options.length > Math.pow(2, 8)) expectedDataType = "16bit"

                if (prompt.dataType != expectedDataType) return failureStatus("has a suboptimal data type attached to a selection based prompt", prompt)
                break
        }
    }

    if (!promptTitles.includes("Team Name")) return failureStatus("does not have the required prompt with title 'Team Name'", promptTitles)

    const teamNamePrompt = schema.find(prompt => prompt.title == "Team Name")
    if (![ "text", "radio", "dropdown" ].includes(teamNamePrompt.ui.type)) return failureStatus("has a non string generating type for the required prompt with title 'Team Name'", teamNamePrompt)

    if (mode == "Match") {
        if (!promptTitles.includes("Match Number")) return failureStatus("does not have the required prompt with title 'Match Number'", promptTitles)
        const matchNumberPrompt = schema.find(prompt => prompt.title == "Match Number")
        if (matchNumberPrompt.ui.type != "number") return failureStatus("has a ui type other than 'number' for the required prompt with title 'Match Number'", matchNumberPrompt)

        if (!promptTitles.includes("Team Name")) return failureStatus("does not have the required prompt with title 'Team Name'", promptTitles)
        const teamNamePrompt = schema.find(prompt => prompt.title == "Team Name")
        if (teamNamePrompt.ui.type != "dropdown" && teamNamePrompt.ui.type != "radio") return failureStatus("has a ui type other than 'dropdown' or 'radio for the required prompt with title 'Team Name'", teamNamePrompt)

        if (!promptTitles.includes("Alliance Color")) return failureStatus("does not have the required prompt with title 'Alliance Color'", promptTitles)
        const allianceColorPrompt = schema.find(prompt => prompt.title == "Alliance Color")
        if (allianceColorPrompt.ui.type != "radio") return failureStatus("has a ui type other than 'radio' for the required prompt with title 'Alliance Color'", allianceColorPrompt)

        if (!promptTitles.includes("Alliance Score")) return failureStatus("does not have the required prompt with title 'Alliance Score'", promptTitles)
        const allianceScorePrompt = schema.find(prompt => prompt.title == "Alliance Score")
        if (allianceScorePrompt.ui.type != "number") return failureStatus("has a ui type other than 'number' for the required prompt with title 'Alliance Score'", allianceScorePrompt)

        if (!promptTitles.includes("Opponent Score")) return failureStatus("does not have the required prompt with title 'Opponent Score'", promptTitles)
        const opponentScorePrompt = schema.find(prompt => prompt.title == "Opponent Score")
        if (opponentScorePrompt.ui.type != "number") return failureStatus("has a ui type other than 'number' for the required prompt with title 'Opponent Score'", opponentScorePrompt)
    } else {
        if (!promptTitles.includes("Team Name")) return failureStatus("does not have the required prompt with title 'Team Name'", promptTitles)
        const teamNamePrompt = schema.find(prompt => prompt.title == "Team Name")
        if (teamNamePrompt.ui.type != "dropdown" && teamNamePrompt.ui.type != "radio") return failureStatus("has a ui type other than 'dropdown' or 'radio for the required prompt with title 'Team Name'", teamNamePrompt)
    }

    return {
        success: true
    }
}

export default validateSchema