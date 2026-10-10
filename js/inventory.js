// ======================================
// INVENTORY
// ======================================

let inventoryData = null;


// ======================================
// LOAD INVENTORY
// ======================================

async function loadInventory() {

    try {

        console.log("LOAD INVENTORY...");

        const response = await getInventoryData();

        console.log("INVENTORY RESPONSE:", response);

        if (!response || !response.success) {

            console.error(
                "Inventory gagal dimuat:",
                response?.message
            );

            return;

        }

inventoryData = response;

updateInventoryKPI();

loadBrandFilter(
    inventoryData.items
);

loadTypeFilter(
    inventoryData.items
);

loadSKUFilter(
    inventoryData.items
);

loadStatusFilter(
    inventoryData.items
);

renderInventoryTable(
    inventoryData.items
);

renderTopItemChart(
    inventoryData.items
);

renderInventoryDistributionChart(
    inventoryData.items
);

    } catch (error) {

        console.error(
            "Error load inventory:",
            error
        );

    }

}


// ======================================
// UPDATE INVENTORY KPI
// ======================================

function updateInventoryKPI(items = null) {

    let totalSKU = 0;
    let totalStock = 0;
    let reservedStock = 0;
    let availableStock = 0;


    // ==================================
    // TANPA FILTER
    // ==================================

    if (items === null) {

        if (!inventoryData || !inventoryData.kpi) {
            return;
        }

        const kpi = inventoryData.kpi;

        totalSKU =
            Number(kpi.totalSKU) || 0;

        totalStock =
            Number(kpi.totalStock) || 0;

        reservedStock =
            Number(kpi.reservedStock) || 0;

        availableStock =
            Number(kpi.availableStock) || 0;

    }


    // ==================================
    // DENGAN FILTER
    // ==================================

    else {

        const uniqueSKU = new Set();

        items.forEach(item => {

            const sku =
                String(item.sku || "").trim();

            if (sku !== "") {
                uniqueSKU.add(sku);
            }

            totalStock +=
                Number(item.stockQty) || 0;

            reservedStock +=
                Number(item.reservedStock) || 0;

            availableStock +=
                Number(item.availableStock) || 0;

        });

        totalSKU =
            uniqueSKU.size;

    }


    // ==================================
    // TAMPILKAN KPI
    // ==================================

    const totalSKUElement =
        document.getElementById("totalSKU");

    const totalStockElement =
        document.getElementById("totalStock");

    const reservedStockElement =
        document.getElementById("reservedStock");

    const availableStockElement =
        document.getElementById("availableStock");


    if (totalSKUElement) {

        totalSKUElement.textContent =
            totalSKU.toLocaleString("id-ID");

    }


    if (totalStockElement) {

        totalStockElement.textContent =
            totalStock.toLocaleString("id-ID");

    }


    if (reservedStockElement) {

        reservedStockElement.textContent =
            reservedStock.toLocaleString("id-ID");

    }


    if (availableStockElement) {

        availableStockElement.textContent =
            availableStock.toLocaleString("id-ID");

    }

}

// ======================================
// LOAD BRAND FILTER
// ======================================

function loadBrandFilter(items) {

    const filterBrand =
        document.getElementById("filterBrand");

    if (!filterBrand) {
        return;
    }

    // Simpan pilihan default
    filterBrand.innerHTML = `
        <option value="">Semua Brand</option>
    `;

    // Ambil brand unik
    const brands = [
        ...new Set(
            items
                .map(item => String(item.brand || "").trim())
                .filter(brand => brand !== "")
        )
    ];

    // Urutkan berdasarkan abjad
    brands.sort((a, b) =>
        a.localeCompare(b, "id")
    );

    // Masukkan ke dropdown
    brands.forEach(brand => {

        const option =
            document.createElement("option");

        option.value = brand;
        option.textContent = brand;

        filterBrand.appendChild(option);

    });

}

// ======================================
// LOAD TYPE FILTER
// ======================================

function loadTypeFilter(items) {

    const filterType =
        document.getElementById("filterType");

    if (!filterType) {
        return;
    }

    // Pilihan default
    filterType.innerHTML = `
        <option value="">Semua Type</option>
    `;

    // Ambil Type unik
    const types = [
        ...new Set(
            items
                .map(item => String(item.type || "").trim())
                .filter(type => type !== "")
        )
    ];

    // Urutkan berdasarkan abjad
    types.sort((a, b) =>
        a.localeCompare(b, "id")
    );

    // Masukkan ke dropdown
    types.forEach(type => {

        const option =
            document.createElement("option");

        option.value = type;
        option.textContent = type;

        filterType.appendChild(option);

    });

}


// ======================================
// SKU FILTER BERDASARKAN BRAND
// ======================================

function loadSKUFilter(items) {

    const filterSKU =
        document.getElementById("filterSKU");

    if (!filterSKU) {
        return;
    }

    const selectedBrand =
        document.getElementById("filterBrand")?.value || "";

    // Simpan pilihan SKU sebelumnya
    const previousSKU = filterSKU.value;

    // Reset dropdown SKU
    filterSKU.innerHTML = `
        <option value="">Semua SKU</option>
    `;

    // Ambil SKU berdasarkan Brand terpilih
    const filteredItems = selectedBrand
        ? items.filter(item =>
            String(item.brand || "").trim() === selectedBrand
        )
        : items;

    const skus = [
        ...new Set(
            filteredItems
                .map(item => String(item.sku || "").trim())
                .filter(sku => sku !== "")
        )
    ];

    skus.sort((a, b) =>
        a.localeCompare(b, "id")
    );

    skus.forEach(sku => {

        const option = document.createElement("option");

        option.value = sku;
        option.textContent = sku;

        filterSKU.appendChild(option);

    });

    // Pertahankan SKU jika masih tersedia
    if (skus.includes(previousSKU)) {
        filterSKU.value = previousSKU;
    }
}

// ======================================
// STATUS STOCK FILTER
// ======================================

function loadStatusFilter(items) {

    const filterStatus =
        document.getElementById("filterStockStatus");

    if (!filterStatus) {
        return;
    }

    filterStatus.innerHTML = `
        <option value="">Semua Status</option>
    `;

    const statuses = [
        ...new Set(
            items
                .map(item => String(item.status || "").trim())
                .filter(status => status !== "")
        )
    ];

    statuses.sort((a, b) =>
        a.localeCompare(b, "id")
    );

    statuses.forEach(status => {

        const option =
            document.createElement("option");

        option.value = status;
        option.textContent =
            formatStockStatus(status);

        filterStatus.appendChild(option);

    });

}

// ======================================
// BRAND FILTER EVENT
// ======================================

const filterBrand =
    document.getElementById("filterBrand");

if (filterBrand) {

    filterBrand.addEventListener(
        "change",
        function () {

            loadSKUFilter(
                inventoryData.items
            );

            applyInventoryFilter();

        }
    );

}

// ======================================
// TYPE FILTER EVENT
// ======================================

const filterType =
    document.getElementById("filterType");

if (filterType) {

    filterType.addEventListener(
        "change",
        applyInventoryFilter
    );

}

// ======================================
// SKU FILTER EVENT
// ======================================

const filterSKU =
    document.getElementById("filterSKU");  

if (filterSKU) {

    filterSKU.addEventListener(
        "change",
        applyInventoryFilter
    );

}
// ======================================
// APPLY INVENTORY FILTER
// ======================================

function applyInventoryFilter() {

    const filterBrand =
        document.getElementById("filterBrand");

    const filterType =
        document.getElementById("filterType");

    const filterSKU =
        document.getElementById("filterSKU");

    const selectedBrand =
        filterBrand ? filterBrand.value : "";
    
    const selectedStatus =
        filterStatus ? filterStatus.value : "";

    const selectedType =
        filterType ? filterType.value : "";

    const selectedSKU =
        document.getElementById("filterSKU")?.value || "";


    // Ambil seluruh data inventory
    let filteredItems =
        inventoryData.items || [];


    // ==================================
    // FILTER BRAND
    // ==================================

    if (selectedBrand !== "") {

        filteredItems =
            filteredItems.filter(item =>

                String(item.brand || "").trim()
                === selectedBrand

            );

    }

    if (selectedSKU !== "") {

    filteredItems =
        filteredItems.filter(item =>
            String(item.sku || "").trim()
            === selectedSKU
        );

}

if (selectedStatus !== "") {

    filteredItems =
        filteredItems.filter(item =>
            String(item.status || "").trim()
            === selectedStatus
        );

}


    // ==================================
    // FILTER TYPE
    // ==================================

    if (selectedType !== "") {

        filteredItems =
            filteredItems.filter(item =>

                String(item.type || "").trim()
                === selectedType

            );

    }


    // ==================================
    // UPDATE KPI
    // ==================================

    updateInventoryKPI(
        filteredItems
    );


    // ==================================
    // UPDATE TABLE
    // ==================================

    renderInventoryTable(
        filteredItems
    );


    // ==================================
    // TOP ITEM CHART
    // ==================================

    renderTopItemChart(
        filteredItems
    );

    // ==================================
    // DISTRIBUSI INVENTORY CHART
    // ==================================

    renderInventoryDistributionChart(
        filteredItems
    );

}

// ======================================
// RENDER INVENTORY TABLE
// ======================================

function renderInventoryTable(items) {

    const tableBody =
        document.getElementById("inventoryTableBody");

    if (!tableBody) {
        return;
    }

    // Kosongkan tabel
    tableBody.innerHTML = "";

    // Jika tidak ada data
    if (!items || items.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-state">
                    Tidak ada data inventory.
                </td>
            </tr>
        `;

        return;
    }

    // Render setiap item
    items.forEach((item, index) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHTML(item.sku)}</td>

            <td>${escapeHTML(item.product)}</td>

            <td>${escapeHTML(item.brand)}</td>

            <td>${escapeHTML(item.type)}</td>

            <td>
                ${Number(item.stockQty).toLocaleString("id-ID")}
            </td>

            <td>
                ${Number(item.reservedStock).toLocaleString("id-ID")}
            </td>

            <td>
                ${Number(item.availableStock).toLocaleString("id-ID")}
            </td>

            <td>
                <span class="stock-status ${getStockStatusClass(item.status)}">
                    ${formatStockStatus(item.status)}
                </span>
            </td>

        `;

        tableBody.appendChild(row);

    });

}

// ======================================
// TOP BARANG CHART
// ======================================

function renderTopItemChart(items) {

    const chartElement =
        document.getElementById("topItemChart");

    if (!chartElement) {
        return;
    }

    chartElement.innerHTML = "";

    if (!items || items.length === 0) {

        chartElement.innerHTML = `
            <div class="empty-state">
                Tidak ada data inventory.
            </div>
        `;

        return;
    }

    const productMap = {};

    items.forEach(item => {

        const sku =
            String(item.sku || "").trim();

        const product =
            String(item.product || "").trim();

        const stock =
            Number(item.stockQty) || 0;

        if (!sku) {
            return;
        }

        if (!productMap[sku]) {

            productMap[sku] = {
                sku: sku,
                product: product,
                stock: 0
            };

        }

        productMap[sku].stock += stock;

    });

    const topItems =
        Object.values(productMap)
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 10);

    if (topItems.length === 0) {

        chartElement.innerHTML = `
            <div class="empty-state">
                Tidak ada data untuk chart.
            </div>
        `;

        return;
    }

    const maxStock =
        Math.max(
            ...topItems.map(item => item.stock)
        );

    topItems.forEach(item => {

        const percentage =
            maxStock > 0
                ? (item.stock / maxStock) * 100
                : 0;

        const row =
            document.createElement("div");

        row.className =
            "top-item-row";

        row.innerHTML = `
            <div class="top-item-info">
                <span class="top-item-sku">
                    ${escapeHTML(item.sku)}
                </span>

                <span class="top-item-product">
                    ${escapeHTML(item.product)}
                </span>

                <strong>
                    ${item.stock.toLocaleString("id-ID")}
                </strong>
            </div>

            <div class="top-item-bar">
                <div
                    class="top-item-bar-fill"
                    style="width: ${percentage}%"
                ></div>
            </div>
        `;

        chartElement.appendChild(row);

    });

}

// ======================================
// DISTRIBUSI INVENTORY CHART
// ======================================

function renderInventoryDistributionChart(items) {

    const chartElement =
        document.getElementById(
            "inventoryDistributionChart"
        );

    if (!chartElement) {
        return;
    }

    chartElement.innerHTML = "";

    if (!items || items.length === 0) {

        chartElement.innerHTML = `
            <div class="empty-state">
                Tidak ada data inventory.
            </div>
        `;

        return;
    }

    let availableStock = 0;
    let reservedStock = 0;
    let outOfStock = 0;

    items.forEach(item => {

        const available =
            Number(item.availableStock) || 0;

        const reserved =
            Number(item.reservedStock) || 0;

        const stock =
            Number(item.stockQty) || 0;

        availableStock += available;
        reservedStock += reserved;

        if (stock === 0) {
            outOfStock += 1;
        }

    });

    const distribution = [
        {
            label: "Available",
            value: availableStock
        },
        {
            label: "Reserved",
            value: reservedStock
        },
        {
            label: "Out of Stock",
            value: outOfStock
        }
    ];

    const total =
        distribution.reduce(
            (sum, item) => sum + item.value,
            0
        );

    if (total === 0) {

        chartElement.innerHTML = `
            <div class="empty-state">
                Tidak ada data untuk distribusi inventory.
            </div>
        `;

        return;
    }

    distribution.forEach(item => {

        const percentage =
            (item.value / total) * 100;

        const row =
            document.createElement("div");

        row.className =
            "inventory-distribution-row";

        row.innerHTML = `

            <div class="inventory-distribution-info">

                <span>
                    ${item.label}
                </span>

                <strong>
                    ${item.value.toLocaleString("id-ID")}
                </strong>

            </div>

            <div class="inventory-distribution-bar">

                <div
                    class="inventory-distribution-bar-fill"
                    style="width: ${percentage}%"
                ></div>

            </div>

        `;

        chartElement.appendChild(row);

    });

}


// ======================================
// STOCK STATUS CLASS
// ======================================

function getStockStatusClass(status) {

    switch (status) {

        case "AVAILABLE":
            return "status-available";

        case "RESERVED":
            return "status-reserved";

        case "OUT_OF_STOCK":
            return "status-out";

        default:
            return "";

    }

}


// ======================================
// STOCK STATUS LABEL
// ======================================

function formatStockStatus(status) {

    switch (status) {

        case "AVAILABLE":
            return "Available";

        case "RESERVED":
            return "Reserved";

        case "OUT_OF_STOCK":
            return "Out of Stock";

        default:
            return status || "-";

    }

}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================
// INIT INVENTORY
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadInventory();

    }
);

// ======================================
// STATUS STOCK FILTER EVENT
// ======================================

const filterStatus =
    document.getElementById("filterStockStatus");

if (filterStatus) {

    filterStatus.addEventListener(
        "change",
        applyInventoryFilter
    );

}