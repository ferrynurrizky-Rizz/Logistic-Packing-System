const API_URL = "https://script.google.com/macros/s/AKfycbyFDrt8IHYtRIPBRDeui75VlkFTH-zIq_SJuCdMsGx_DI8-XoVym6qqdGprG2zX9_Om/exec";

async function callAPI(data) {

    try {

        console.log("SEND :", data);

        const formData = new URLSearchParams();

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const text = await response.text();

        console.log("RAW RESPONSE :", text);

        return JSON.parse(text);

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: error.message
        };

    }

}

// ======================================
// DASHBOARD
// ======================================

async function getDashboardData() {

    return await callAPI({

        action: "dashboard"

    });

}