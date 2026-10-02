// ================================
// Dummy Queue QC
// ================================

let qcQueue = [];
let qcHistory = [];

// ================================
// LOAD QC QUEUE
// ================================

async function loadQCQueue() {

    const response = await callAPI({

        action: "loadQCQueue"

    });

    console.log(response);

if (!response.success) {

    alert(response.message);

    return;

    }

    qcQueue = response.data;
    renderQueue();
    updateCurrentResiInfo();
    checkFinishQCButton();
    return;
}

// ================================
// Render Queue QC
// ================================

function renderQueue() {

    const tbody = document.getElementById("qcTableBody");

    tbody.innerHTML = "";

    qcQueue.forEach((item, index) => {

    const statusClass = item.status.toLowerCase();

    const active =
        currentItem &&
        currentItem.no === item.no
            ? "active-row"
            : "";

         tbody.innerHTML += `
                 <tr class="${active}">

                 <td>${index + 1}</td>

                <td>${item.sku}</td>

                <td>${item.serial || "-"}</td>

                <td>

                    <span class="status ${statusClass}">

                        ${item.status}

                    </span>

                </td>

            </tr>
        `;

    });

}

// Barang yang sedang diproses
let currentItem = null;
let currentResi = "";

document.addEventListener("DOMContentLoaded", async() => {

    await loadQCQueue();
    clearFoundItem();
    disableQCAction();

    const serialInput = document.getElementById("serialInput");

serialInput.addEventListener("keydown", function (e) {

    if (e.key !== "Enter") return;

    findItem(this.value);

});

document
    .getElementById("btnProcessQC")
    .addEventListener("click", processQC);

document
    .getElementById("btnFinishQC")
    .addEventListener("click", finishQC);

});

// ================================
// Cari Barang QC
// ================================

function findItem(scanValue) {

    const scan = String(scanValue)
        .trim()
        .toUpperCase();
    console.log("Scan:", scan);
    console.log("QC Queue", qcQueue);

    // ===========================
    // PRIORITAS 1
    // Cari berdasarkan SERIAL
    // ===========================

    currentItem = qcQueue.find(item =>

        String(item.serial || "")
            .trim()
            .toUpperCase() === scan

    );

    // ===========================
    // PRIORITAS 2
    // Kalau tidak ketemu,
    // cari SKU yang masih PENDING
    // ===========================

    if (!currentItem) {

        currentItem = qcQueue.find(item =>

            String(item.sku || "")
                .trim()
                .toUpperCase() === scan &&

            item.status === "PENDING"

        );

    }

    console.log("Scan identifier :", scan);
    console.log("Current Item :", currentItem);

    if (!currentItem) {

        showNotFound(scan);

        disableQCAction();

        return;

    }

    showFoundItem(currentItem);

    renderQueue();
    currentResi = currentItem.resi;

    updateCurrentResiInfo();

    checkFinishQCButton();

    enableQCAction();

const radios = document.querySelectorAll(
    'input[name="qcResult"]'
);

if (radios.length > 0) {

    radios.forEach(r => r.checked = false);

    radios[0].checked = true;

}

    document.getElementById("serialInput").value = "";

}

// ================================
// Tampilkan Barang Ditemukan
// ================================

function showFoundItem(item){

    currentItem = item;

    document.getElementById("lastSku").textContent = item.sku;

    document.getElementById("lastSerial").textContent = item.serial || "-";

    document.getElementById("lastTime").textContent = item.scanTime || "-";

    document.getElementById("qcReceivingNote").textContent = item.note || "-";

}

function showNotFound(serial){

    document.getElementById("lastSku").textContent = "-";
    document.getElementById("lastSerial").textContent = "-";
    document.getElementById("lastTime").textContent = "-";

}

function clearFoundItem() {

    document.getElementById("lastSku").textContent = "-";

    document.getElementById("lastSerial").textContent = "-";

    document.getElementById("lastTime").textContent = "-";

    document.getElementById("qcReceivingNote").textContent = "-";

    document.getElementById("serialInput").value = "";

}

function enableQCAction() {

    document
        .querySelectorAll('input[name="qcResult"]')
        .forEach(radio => {

            radio.disabled = false;

        });

    document
        .getElementById("btnProcessQC")
        .disabled = false;

}

function disableQCAction() {

    document
        .querySelectorAll('input[name="qcResult"]')
        .forEach(radio => {

            radio.disabled = true;

            radio.checked = false;

        });

    document
        .getElementById("btnProcessQC")
        .disabled = true;

}

async function processQC() {

    if (!currentItem) return;

    const selected = document.querySelector(
        'input[name="qcResult"]:checked'
    );

    if (!selected) {

        alert("Pilih hasil QC terlebih dahulu.");

        return;

    }

    const result = selected.value;

    const note = document
        .getElementById("noteInput")
        .value
        .trim();

    // Catatan wajib jika REJECT
    if (result === "REJECT" && note === "") {

        alert("Alasan Reject wajib diisi.");

        return;

    }

    const response = await callAPI({

    action: "saveQCResult",

    no: currentItem.no,

    status: result,

    note: note,

    operator: localStorage.getItem("operator") || ""

});

    if (!response.success) {

        alert(response.message);

        return;

    }

    alert("QC berhasil disimpan.");

qcHistory.unshift({

        time: new Date().toLocaleTimeString(),
        sku: currentItem.sku,
        serial: currentItem.serial,
        status: result
});

    if (qcHistory.length > 10) {

        qcHistory.pop();

    }
renderHistory();

    // Reload Queue dari Google Sheet
    await loadQCQueue();

    disableQCAction();

    clearFoundItem();

    document.getElementById("noteInput").value = "";

    document.getElementById("serialInput").focus();

    currentItem = null;
    
}

function updateCurrentResiInfo() {

    if (!currentResi) return;

    const items = qcQueue.filter(item => item.resi === currentResi);

    const total = items.length;

    const pending = items.filter(item => item.status === "PENDING").length;

    const pass = items.filter(item => item.status === "PASS").length;

    const reject = items.filter(item => item.status === "REJECT").length;

    document.getElementById("activeResi").textContent = currentResi;
        if(items.length){

            document.getElementById("operatorName").textContent = items[0].operator   || "-";
            
        }

    document.getElementById("totalItem").textContent = total;

    document.getElementById("pendingItem").textContent = pending;

    document.getElementById("passItem").textContent = pass;

    document.getElementById("rejectItem").textContent = reject;

}

function checkFinishQCButton() {

    if (!currentResi) {

        document.getElementById("btnFinishQC").disabled = true;
        return;

    }

    const pending = qcQueue.filter(item =>
        item.resi === currentResi &&
        item.status === "PENDING"
    ).length;

    document.getElementById("btnFinishQC").disabled = (pending > 0);

}

async function finishQC() {

    if (!currentResi) {

        alert("Tidak ada resi aktif.");

        return;

    }

    const response = await callAPI({

        action: "finishQC",

        resi: currentResi,

        operator: localStorage.getItem("operator") || ""

    });

    if (!response.success) {

        alert(response.message);

        return;

    }

    alert("QC berhasil diselesaikan.");

    currentResi = "";

    currentItem = null;

    clearFoundItem();

    await loadQCQueue();

    document.getElementById("activeResi").textContent = "-";

    document.getElementById("totalItem").textContent = "0";

    document.getElementById("pendingItem").textContent = "0";

    document.getElementById("passItem").textContent = "0";

    document.getElementById("rejectItem").textContent = "0";

    checkFinishQCButton();

}

function renderHistory() {

    const tbody = document.getElementById("qcHistoryBody");

    if (!tbody) return;

    if (qcHistory.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center">
                    Belum ada aktivitas
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = qcHistory.map(item => `

        <tr>

            <td>${item.time}</td>

            <td>${item.sku}</td>

            <td>${item.serial || "-"}</td>

            <td>

                <span class="status ${item.status.toLowerCase()}">

                    ${item.status}

                </span>

            </td>

        </tr>

    `).join("");

}