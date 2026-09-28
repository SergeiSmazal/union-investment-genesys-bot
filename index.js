const fs = require("fs");
const path = require("path");

const csvFilePath = path.join(__dirname, "plz_location_map_de.csv");
let plzMap = null;

function loadCsvData() {
    if (plzMap) return;
    try {
        if (!fs.existsSync(csvFilePath)) return;
        const csvData = fs.readFileSync(csvFilePath, "utf8");
        plzMap = {};

        for (const line of csvData.split("\n")) {
            if (!line.trim()) continue;
            const parts = line.split(";");

            const plz = parts[1];
            const city = (parts[2] || "").trim();
            const state = (parts[3] || "").trim();
            const region = (parts[7] || "").trim();
            
            if (plz && !plzMap[plz]) {
                plzMap[plz] = { city, state, region };
            }
        }
    } catch (err) {
        console.error("Error loading CSV:", err);
    }
}

exports.handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : event;
    const mission = body.mission || event.mission;

    loadCsvData();

    switch (mission) {
        case "leben_angebot": {
            const age = parseInt(body.age || 30, 10);
            const targetSum = parseFloat(body.targetSum || 100000);
            const isSmoker = (body.isSmoker || "Nein").toLowerCase() === "ja";
            const term = parseInt(body.term || 10, 10);

            let baseRate = (targetSum / 1000) * (age * 0.05);
            if (isSmoker) baseRate *= 1.4;
            const monthlyPremium = Math.round((baseRate / 12) * 100) / 100;
            const totalPremium = Math.round(monthlyPremium * (term * 12) * 100) / 100;

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "success",
                    mission: "leben_angebot",
                    monthlyPremium,
                    totalPremium,
                    offerId: `OFF-${Date.now()}`
                })
            };
        }

        case "stammdaten_aenderung": {
            const customerId = body.customerId;
            const changeType = body.changeType;
            const newValue = body.newValue;

            if (!customerId || !changeType) {
                return {
                    statusCode: 400,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ error: "customerId and changeType are required" })
                };
            }

            let enrichedData = { newValue };
            let successMessage = `Die Daten für Kunde ${customerId} wurden aktualisiert.`;

            // Динамическое формирование текста в зависимости от changeType
            const typeLower = changeType.toLowerCase();
            if (typeLower === "adresse") {
                successMessage = `Ihre Adresse für Kunde ${customerId} wurde erfolgreich aktualisiert.`;
                if (body.plz && plzMap) {
                    const entry = plzMap[body.plz];
                    if (entry) {
                        enrichedData.locationDetails = entry;
                    }
                }
            } else if (typeLower === "phone") {
                successMessage = `Ihre Telefonnummer für Kunde ${customerId} wurde erfolgreich aktualisiert.`;
            } else if (typeLower === "email") {
                successMessage = `Ihre E-Mail-Adresse für Kunde ${customerId} wurde erfolgreich aktualisiert.`;
            }

            return {
                statusCode: 200,
                    headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "success",
                    mission: "stammdaten_aenderung",
                    customerId,
                    changeType,
                    message: successMessage,
                    details: enrichedData
                })
            };
        }

        default:
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ error: `Unknown mission: '${mission}'` })
            };
    }
};
