import React, { useRef, useEffect } from "react"

import Webcam from "react-webcam"
import jsqr from "jsqr"
import { generateDataFromBuffer } from "../scripts/dataBuffer"
import { getSchemas, uploadMatchScout, uploadPitScout } from "../scripts/api"

const UploadPage = () => {
    const webcamRef = useRef()

    useEffect(() => {
        let finishedScanning = true

        const scan = (e) => {
            if (e.code != "Space") return

            if (!finishedScanning) return alert("Existing upload task has not been resolved yet. Please allow the pending upload to finish before starting a new upload. If this issue persists, try refreshing the page or contact a developer.")
            else finishedScanning = false

            const snapshot = webcamRef.current.getScreenshot()

            const tempImg = new Image()
            tempImg.src = snapshot
            tempImg.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = 640
                canvas.height = 480

                const ctx = canvas.getContext("2d")
                
                ctx.drawImage(tempImg, 0, 0, 640, 480)
                const imageData = ctx.getImageData(0, 0, 640, 480)

                const output = jsqr(imageData.data, 640, 480)

                if(output == null){
                    finishedScanning = true

                    alert("Failed to scan qr code. Make sure the image is not blurry and contains a valid qr code.")
                } else {
                    const buffer = []

                    for (let i = 0;i<output.data.length;i++) buffer.push(output.data.charCodeAt(i))

                    getSchemas((schemas) => {
                        const pitForm = schemas.pit?.filter(e => e.ui.type != "header") || []
                        const matchForm = schemas.match?.filter(e => e.ui.type != "header") || []

                        const dataInterpretedAsPitScout = generateDataFromBuffer(buffer, pitForm)
                        const dataInterpretedAsMatchScout = generateDataFromBuffer(buffer, matchForm)

                        const form = dataInterpretedAsPitScout ? pitForm : matchForm
                        const data = dataInterpretedAsPitScout || dataInterpretedAsMatchScout

                        if(data == null){
                            finishedScanning = true
                            
                            return alert("Failed to parse QR code. Make sure the schema on the app matches the schema stored on the server.")
                        }

                        const receipt = {
                            id: data.id,
                            entries: Object.fromEntries(form.map((entry, index) => {
                                const value =  entry.ui.hasOwnProperty("options") ? entry.ui.options[data.entries[index]] : data.entries[index]
                                
                                return [ entry.title, value ]
                            }))
                        }

                        console.log({ receipt })

                        if(dataInterpretedAsPitScout){
                            uploadPitScout(receipt.id, receipt.entries, (success) => {
                                if(success){
                                    alert("Successfully uploaded form. Receipt is available in the console if needed.")
                                } else {
                                    alert("Refused to store. Either this form was listed as a duplicate entry or the tournament on the dashboard does not exist on the server. If this is a mistake, have a developer use prisma studio to change the clientFormId of the pit scout causing the collision or check your tournament settings in the dashboard tab.")
                                }
                            })
                        } else {
                            uploadMatchScout(receipt.id, receipt.entries, (success) => {
                                if(success){
                                    alert("Successfully uploaded form. Receipt is available in the console if needed.")
                                } else {
                                    alert("Refused to store. Either this form was listed as a duplicate entry or the tournament on the dashboard does not exist on the server. If this is a mistake, have a developer use prisma studio to change the clientFormId of the team performance causing the collision or check your tournament settings in the dashboard tab.")
                                }
        
                                finishedScanning = true
                            })
                        }
                    })
                }
            }
        }

        window.addEventListener("keydown", scan)

        return () => window.removeEventListener("keydown", scan)
    }, [])

    return (
        <React.Fragment>
            <h1>Upload Scout Forms</h1>
            <div className={"standard-content-container"} style={{ textAlign: "center" }}>
                <Webcam style={{ marginTop: "20px", borderRadius: "10px" }} ref={webcamRef} mirrored />
                <h2>Press Space to Scan and Upload</h2>
            </div>
        </React.Fragment>
    )
}

export default UploadPage