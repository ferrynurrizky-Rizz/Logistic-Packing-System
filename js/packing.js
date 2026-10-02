// ======================================
// PACKING SESSION
// ======================================

let packingSession = {

    id: null,

    resi: null,

    operator: null,

    status: null,

    startTime: null,

    finishTime: null,

    totalItem: 0,

    items: []

};

// ======================================
// PACKING PAGE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const btnCreate =
        document.getElementById("btnCreatePacking");

    btnCreate.addEventListener("click", createPacking);

    const barcodeInput =
    document.getElementById("barcodeInput");

barcodeInput.addEventListener("keydown", handleBarcodeScan);
    
});

// ======================================
// CREATE PACKING
// ======================================

async function createPacking() {

    const resi = document
        .getElementById("resiInput")
        .value
        .trim();

    if (resi === "") {

        alert("Nomor resi wajib diisi.");
        return;

    }

    const user = JSON.parse(
        sessionStorage.getItem("user") || "{}"
    );

    const operator = user.nama || "Unknown";

    console.log({
        action: "createPacking",
        resi,
        operator
    });

    const result = await callAPI({
        action: "createPacking",
        resi,
        operator
    });

    console.log(result);

    if (!result.success) {

    alert(result.message);
    return;

}

packingSession = {

    id: result.data.no,

    resi,

    operator,

    status: result.data.status,

    startTime: new Date(),

    finishTime: null,

    totalItem: 0,

    items: []

};

renderPackingInfo();

enableBarcodeScan();

alert("Packing berhasil dibuat.");

}

// ======================================
// UPDATE PACKING INFO
// ======================================

function renderPackingInfo(){

    document.getElementById("packingStatus").textContent =
        packingSession.status;

    document.getElementById("packingOperator").textContent =
        packingSession.operator;

    document.getElementById("totalItem").textContent =
        packingSession.totalItem;

}

function enableBarcodeScan(){

    const barcode =
        document.getElementById("barcodeInput");

    barcode.disabled = false;

    barcode.focus();

    document.getElementById("resiInput").readOnly = true;

    document.getElementById("btnCreatePacking").disabled = true;

    document.getElementById("btnCreatePacking").textContent =
        "Packing Berjalan...";

}

// ======================================
// HANDLE BARCODE
// ======================================

async function handleBarcodeScan(e){

    if(e.key !== "Enter") return;

    e.preventDefault();

    const barcode = e.target.value.trim();

    if(barcode === "") return;

    const result = await callAPI({

        action: "scanBarcode",

        barcode: barcode,

        resi: packingSession.resi,

        operator: packingSession.operator

    });

    console.log(result);

    e.target.value = "";

    e.target.focus();

}