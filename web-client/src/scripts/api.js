import axios from "axios"

const getTournaments = (callback) => {
    axios.post("http://localhost:3000/getTournaments", {}, {
        withCredentials: false
    })
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting tournaments", {}, err))
}

const createNewTournament = (tournamentName, pitSchema, matchSchema, callback) => {
    const body = {
        tournamentName,
        pitSchema,
        matchSchema
    }

    axios.post("http://localhost:3000/createNewTournament", body, {
        withCredentials: false
    })
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred creating new tournament", body, err))
}

const getSchemas = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getSchemas", body, {
        withCredentials: false
    })
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting schemas", body, err))
}

const uploadMatchScout = (formId, formJson, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""
    const matchNumber = formJson["Match Number"]
    const teamName = formJson["Team Name"]
    const clientFormId = formId
    const jsonValues = formJson

    const body = {
        tournamentName,
        matchNumber,
        teamName,
        clientFormId,
        jsonValues
    }

    axios.post("http://localhost:3000/uploadMatchScoutForm", body, {
        withCredentials: false
    })
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred uploading form", body, err))
}

const uploadPitScout = (formId, formJson, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""
    const teamName = formJson["Team Name"]
    const clientFormId = formId
    const jsonValues = formJson

    const body = {
        tournamentName,
        teamName,
        clientFormId,
        jsonValues
    }

    axios.post("http://localhost:3000/uploadPitScoutForm", body, {
        withCredentials: false
    })
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred uploading form", body, err))
}

const getMatchNumbers = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getMatchNumbers", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting match numbers", body, err))
}

const getTeamNamesAcrossMatchScouting = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getTeamNamesMatch", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting team names", body, err))
}

const getTeamNamesAcrossPitScouting = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getTeamNamesPit", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting team names", body, err))
}

const getMatchNumbersWithTeam = (teamName, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        teamName
    }

    axios.post("http://localhost:3000/getMatchNumbersForTeam", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting match numbers with team", body, err))
}

const getTeamsInMatchNumber = (matchNumber, callback) => {
    if (matchNumber == null) return getTeamNames(callback)
    
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        matchNumber
    }

    axios.post("http://localhost:3000/getTeamsInMatch", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting teams in match number", body, err))
}

const getRecordsCount = (matchNumber, teamName, callback) => {
    if (matchNumber == null || teamName == null) return callback([])

    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        matchNumber,
        teamName
    }

    axios.post("http://localhost:3000/getRecordsCount", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting records count", body, err))
}

const getNumericMatchFields = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getNumericMatchFields", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting maximums", body, err))
}

const getNumericPitFields = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getNumericPitFields", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting maximums", body, err))
}

const getMaximumsAcrossMatchScouting = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getSchemaMaximaAcrossMatchScouting", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting maximums", body, err))
}

const getMaximumsAcrossPitScouting = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }

    axios.post("http://localhost:3000/getSchemaMaximaAcrossPitScouting", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting maximums", body, err))
}

const getTeamPerformance = (teamName, matchNumber, recordNumber, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        teamName,
        matchNumber,
        recordNumber
    }
    
    axios.post("http://localhost:3000/getTeamPerformance", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting team performance", body, err))
}

const getTeamOverviewAcrossMatchScouting = (teamName, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        teamName
    }
    
    axios.post("http://localhost:3000/getTeamOverviewAcrossMatchScouting", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting team overview", body, err))
}

const getTeamOverviewAcrossPitScouting = (teamName, callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName,
        teamName
    }
    
    axios.post("http://localhost:3000/getTeamOverviewAcrossPitScouting", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting team overview", body, err))
}

const getMatch = (matchNumber, callback) => {
    return callback([])

    const tournamentName = localStorage.getItem("tournamentName") ?? ""
    
    const body = {
        tournamentName,
        matchNumber
    }

    axios.post("http://localhost:3000/getMatch", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting match", body, err))
}

const getOPR = (callback) => {
    const tournamentName = localStorage.getItem("tournamentName") ?? ""

    const body = {
        tournamentName
    }
    
    axios.post("http://localhost:3000/getOPRs", body)
        .then(({ data }) => callback(data.data))
        .catch((err) => console.warn("Error occurred getting opr", body, err))
}

export {
    getTournaments,
    createNewTournament,
    getSchemas,
    uploadPitScout,
    uploadMatchScout,
    getMatchNumbers,
    getTeamNamesAcrossMatchScouting,
    getTeamNamesAcrossPitScouting,
    getMatchNumbersWithTeam,
    getTeamsInMatchNumber,
    getRecordsCount,
    getNumericMatchFields,
    getNumericPitFields,
    getMaximumsAcrossMatchScouting,
    getMaximumsAcrossPitScouting,
    getTeamPerformance,
    getTeamOverviewAcrossMatchScouting,
    getTeamOverviewAcrossPitScouting,
    getMatch,
    getOPR
}