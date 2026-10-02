// ======================================
// RECEIVING SESSION
// ======================================

const receivingSession = {

    active: false,

    resi: "",

    priority: "Regular",

    note: "",

    operator: "",

    startedAt: null,

    items: [],

    lastScan: {

        sku: "",

        serial: "",

        time: ""

    }

};

// ======================================
// HELPER
// ======================================

function getTotalSKU() {

    return receivingSession.items.length;

}

function getTotalUnit(){

    return receivingSession.items.reduce(

        (total, item) => total + item.qty,

        0

    );

}

function updateSessionData(){
   
    const priority =
        document.querySelector(
            'input[name="priority"]:checked'
        );

    const note =
        document.getElementById("noteInput");

    receivingSession.priority =
        priority
        ? priority.value
        : "Regular";

    receivingSession.note =
        note
        ? note.value.trim()
        : "";

}

// ======================================
// SCAN HELPER
// ======================================

function findSKU(sku) {

    return receivingSession.items.find(item => item.sku === sku);

}

function serialExists(serial) {

    return receivingSession.items.some(item =>

        item.serials.some(data => data.serial === serial)

    );

}

function validateScan(resi, sku) {

    if (!resi.trim()) {

        showToast("Nomor Resi belum diisi.", "warning");

        document.getElementById("resiInput").focus();

        return false;

    }

    if (!sku.trim()) {

        showToast("SKU belum diisi.", "warning");

        document.getElementById("skuInput").focus();

        return false;

    }

    // Serial Number bersifat opsional

    return true;

}

function toggleSKU(index){

    receivingSession.items[index].expanded =
        !receivingSession.items[index].expanded;

    renderTable();

}

function focusField(field) {

    field.focus();

    field.select();

}

function showToast(message, type = "success") {

    const container =
        document.getElementById("toastContainer");

    if (!container) return;

    const toast =
        document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

// ======================================
// DOM READY
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    initReceiving();

});

// ======================================
// INIT
// ======================================

function initReceiving() {

    const user =
        JSON.parse(sessionStorage.getItem("user") || "{}");

    receivingSession.operator =
    user.nama || "Unknown";

    receivingSession.startedAt = new Date();

    updateSessionData();

    renderInfo();

    renderLastScan();

    bindEvents();

    document
        .getElementById("resiInput")
        .focus();

}

// ======================================
// BIND EVENTS
// ======================================

function bindEvents() {

    const resi =
        document.getElementById("resiInput");

    const sku =
        document.getElementById("skuInput");

    const serial =
        document.getElementById("serialInput");

    const saveButton =
        document.getElementById("btnSaveItem");

    const finishButton =
        document.getElementById("btnFinishReceiving");

        saveButton.addEventListener("click", saveReceiving);

        finishButton.addEventListener("click", finishReceiving);
 
    // -------------------------
    // RESI
    // -------------------------

    resi.addEventListener("keydown", function (e) {

        if (e.key !== "Enter") return;

        e.preventDefault();

        const value = resi.value.trim();

        if (value === "") return;

        receivingSession.resi = value;

            receivingSession.active = true;

            renderInfo();

            resi.readOnly = true;

        document.getElementById("btnSaveItem").disabled = false;

        focusField(sku);

    });

    // -------------------------
    // SKU
    // -------------------------

    sku.addEventListener("keydown", function (e) {

        if (e.key !== "Enter") return;

        e.preventDefault();

        if (sku.value.trim() === "") return;

        serial.focus();

    });

    // -------------------------
    // SERIAL
    // -------------------------

    serial.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    e.preventDefault();

    document.getElementById("noteInput").focus();

});

}


// ======================================
// SAVE RECEIVING
// ======================================

async function saveReceiving() {

    const resi =
        document.getElementById("resiInput");

    const sku =
        document.getElementById("skuInput");

    const serial =
        document.getElementById("serialInput");

    const currentResi = resi.value.trim();
    const currentSKU = sku.value.trim();
    const currentSerial = serial.value.trim();

    if (!validateScan(currentResi, currentSKU)) {
        return;
    }

    // Sinkronkan Priority & Catatan
    updateSessionData();

    if (receivingSession.resi === "") {

        showToast(
    "Silakan scan nomor resi terlebih dahulu.",
    "warning"
);

        return;

    }

    if (sku.value.trim() === "") {

        showToast(
    "SKU tidak boleh kosong.",
    "warning"
);

        sku.focus();

        return;

    }

    if ( currentSerial && serialExists(currentSerial)) {

    showToast(
        "Serial Number sudah pernah dipindai.",
        "error"
    );

    serial.select();

    return;

}

    console.log(receivingSession);
    const result = await callAPI({

    action: "createReceiving",

    resi: receivingSession.resi,

    sku: currentSKU,

    serial: currentSerial,

    priority: receivingSession.priority,

    note: receivingSession.note,

    operator: receivingSession.operator

});

    console.log(result);

    if (!result.success) {

        showToast(result.message, "error");

        return;

    }

    const scanTime =
    formatScanTime();

// ==========================
// Validasi Serial Duplicate
// ==========================


// ==========================
// Cari SKU
// ==========================

let skuData = findSKU(currentSKU);


// ==========================
// SKU BELUM ADA
// ==========================

if (!skuData) {

    skuData = {

    sku: currentSKU,

    qty: 1,

    expanded: false,

    serials: [

        {

    serial: currentSerial,

    time: scanTime,

    operator: receivingSession.operator

}

    ]

};

    receivingSession.items.push(skuData);

}


// ==========================
// SKU SUDAH ADA
// ==========================

else {

    skuData.qty++;

    skuData.serials.push({

    serial: currentSerial,

    time: scanTime,

    operator: receivingSession.operator

});

}


// ==========================
// LAST SCAN
// ==========================

receivingSession.lastScan = {

    sku: currentSKU,

    serial: currentSerial,

    time: scanTime

};

    renderLastScan();

    renderInfo();

    renderTable();

    showToast("Barang berhasil disimpan.", "success");

    document.getElementById("btnFinishReceiving").style.display = "block";

    sku.value = "";

    serial.value = "";

    document.getElementById("noteInput").value = "";
    receivingSession.note = "";

    focusField(sku);

}

function formatScanTime(date = new Date()) {

    const tanggal =
        date.toLocaleDateString("id-ID", {

            day: "2-digit",
            month: "short",
            year: "numeric"

        });

    const jam =
        date.toLocaleTimeString("id-ID", {

            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false

        });

    return `${tanggal} ${jam} WIB`;

}

// ======================================
// RENDER INFO
// ======================================

function renderInfo() {

    document.getElementById("activeResi").textContent =
        receivingSession.resi || "-";

    document.getElementById("receivingOperator").textContent =
        receivingSession.operator;

    document.getElementById("receivingStatus").innerHTML =
        receivingSession.active
        ? '<span class="badge receiving">RECEIVING</span>'
        : '<span class="badge ready">READY</span>';

    document.getElementById("totalSKU").textContent =
    getTotalSKU();

    document.getElementById("totalUnit").textContent =
    getTotalUnit();

}

function renderLastScan() {

    document.getElementById("lastSku").textContent =
        receivingSession.lastScan.sku || "-";

    document.getElementById("lastSerial").textContent =
        receivingSession.lastScan.serial || "-";

    document.getElementById("lastTime").textContent =
        receivingSession.lastScan.time || "-";

}

// ======================================
// TABLE
// ======================================

function renderTable() {

    const tbody =
        document.getElementById("receivingTableBody");

    tbody.innerHTML = "";

    if (receivingSession.items.length === 0) {

        tbody.innerHTML = `
            <tr id="emptyRow">
                <td colspan="4" class="text-center">
                    Belum ada barang yang dipindai.
                </td>
            </tr>
        `;

        return;

    }

    let html = "";

    receivingSession.items.forEach((item, index) => {

        html += `

        <tr class="sku-group">

            <td>

                <button
                    class="expand-btn"
                    onclick="toggleSKU(${index})">

                    ${item.expanded ? "▼" : "▶"}

                </button>

            </td>

            <td>

                <strong>${item.sku}</strong>

            </td>

            <td>

                ${item.qty}

            </td>

            <td>

                <span class="serial-badge">

                    ${item.serials.length} Serial

                </span>

            </td>

        </tr>

        `;

        if(item.expanded){

            item.serials.forEach((serialData, serialIndex)=>{

                html += `

                <tr class="serial-row">

                    <td></td>

                    <td class="serial-cell">

                        <span class="serial-index">

                            ${serialIndex + 1}.

                        </span>

                        <span class="serial-number">

                            ↳ ${serialData.serial}

                        </span>

                    </td>

                    <td></td>

                    <td class="serial-time">

                        ${serialData.time}

                    </td>

                </tr>

                `;

            });

        }

    });

    tbody.innerHTML = html;

}

async function finishReceiving() {

    if (!receivingSession.active) {
    

        showToast(
    "Belum ada receiving yang sedang berjalan.",
    "warning"
);

        return;

    }

    if (receivingSession.items.length === 0) {

    showToast(
        "Belum ada barang yang disimpan.",
        "warning"
    );

    return;

}

    if (!confirm("Selesaikan proses receiving ini?")) {

        return;

    }

    const result = await callAPI({

    action: "finishReceiving",

    resi: receivingSession.resi

});

if (!result.success) {

    showToast(result.message, "error");

    return;

}

    showToast("Receiving selesai.", "success");

    receivingSession.active = false;

    receivingSession.resi = "";

    receivingSession.startedAt = null;

    receivingSession.items = [];

    receivingSession.lastScan = {

        sku: "",

        serial: "",

        time: ""

    };

    document.getElementById("resiInput").value = "";
    document.getElementById("resiInput").readOnly = false;

    document.getElementById("skuInput").value = "";
    document.getElementById("serialInput").value = "";

receivingSession.priority = "Regular";
receivingSession.note = "";

document.querySelector(
    'input[name="priority"][value="Regular"]'
).checked = true;

document.getElementById("noteInput").value = "";

    renderInfo();
    renderLastScan();
    renderTable();

    document.getElementById("resiInput").focus();

    document.getElementById("btnSaveItem").disabled = true;

    document.getElementById("btnFinishReceiving").style.display = "none";
}   