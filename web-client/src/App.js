import React, { useEffect } from "react"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomePage from "./pages/Home"
import TournamentPage from "./pages/Tournament"
import SchemaPage from "./pages/Schema"
import UploadPage from "./pages/Upload"
import DataPage from "./pages/Data"

import Page from "./components/Page"
import { getOPR } from "./scripts/api"

const App = () => {
    const siteMap = {
        "/": <HomePage />,
        "tournament": <TournamentPage />,
        "schema": <SchemaPage />,
        "upload": <UploadPage />,
        "data": <DataPage />
    }

    const router = createBrowserRouter(Object.entries(siteMap).map(([ path, element ]) => ({ path, element })))

    useEffect(() => {
        console.log("attempting to eget bitch ass opr")
        getOPR(console.log)
    }, [])

    return (
        <Page>
            <RouterProvider router={router} />
        </Page>
    )
}

export default App