// ======================================
// SESSION CHECK
// ======================================

requireLogin();
showCurrentUser();

// ======================================
// LOGOUT
// ======================================

// =========================
// LIVE CLOCK
// =========================

const liveClock = document.getElementById("liveClock");

function updateClock(){

    if(!liveClock) return;

    liveClock.textContent =
        new Date().toLocaleTimeString("id-ID");

}

updateClock();

setInterval(updateClock,1000);

// ======================================
// KPI DATA
// ======================================

const dashboardKPI = [

    {
        id: "packing",
        title: "Packing Hari Ini",
        value: 152,
        icon: "package-check",
        color: "blue"
    },

    {
        id: "pending",
        title: "Pending",
        value: 18,
        icon: "clock-3",
        color: "orange"
    },

    {
        id: "pickup",
        title: "Ready Pickup",
        value: 124,
        icon: "truck",
        color: "green"
    },

    {
        id: "sku",
        title: "Total SKU",
        value: 2458,
        icon: "boxes",
        color: "purple"
    },

    {
        id: "return",
        title: "Return",
        value: 3,
        icon: "rotate-ccw",
        color: "red"
    },

    {
        id: "cancel",
        title: "Cancel",
        value: 1,
        icon: "circle-x",
        color: "gray"
    }

];

// ======================================
// RECENT ACTIVITY
// ======================================

const recentActivities = [

    {
        time: "09:15",
        invoice: "INV-240701",
        store: "Shopee",
        status: "Packing",
        operator: "Andi"
    },

    {
        time: "09:28",
        invoice: "INV-240702",
        store: "Tokopedia",
        status: "Ready Pickup",
        operator: "Budi"
    },

    {
        time: "09:45",
        invoice: "INV-240703",
        store: "Lazada",
        status: "Pending",
        operator: "Rina"
    },

    {
        time: "10:02",
        invoice: "INV-240704",
        store: "TikTok",
        status: "Return",
        operator: "Agus"
    },

    {
        time: "10:10",
        invoice: "INV-240705",
        store: "Shopee",
        status: "Cancel",
        operator: "Sinta"
    }

];

// ======================================
// CHART DATA
// ======================================

const packingChartData = {

    labels: [

        "Sen",
        "Sel",
        "Rab",
        "Kam",
        "Jum",
        "Sab",
        "Min"

    ],

    datasets:[{

        label:"Packing",

        data:[120,145,138,170,165,192,152],

        borderColor:"#3b82f6",

        backgroundColor:"rgba(59,130,246,.2)",

        borderWidth:3,

        tension:.35,

        fill:true

    }]

};

const statusChartData = {

    labels:[

        "Pending",
        "Packing",
        "Ready Pickup",
        "Return",
        "Cancel"

    ],

    datasets:[{

        data:[18,152,124,3,1],

        backgroundColor:[

            "#f59e0b",
            "#2563eb",
            "#10b981",
            "#ef4444",
            "#64748b"

        ],

        borderWidth:0

    }]

};

loadDashboard();

// ======================================
// LOAD DASHBOARD
// ======================================

async function loadDashboard(){

    try{

        const response = await getDashboardData();

        if(!response.success){

            alert(response.message);

            return;

        }

        dashboardKPI[0].value = response.kpi.packingToday;
        dashboardKPI[1].value = response.kpi.pending;
        dashboardKPI[2].value = response.kpi.readyPickup;
        dashboardKPI[3].value = response.kpi.totalSKU;
        dashboardKPI[4].value = response.kpi.return;
        dashboardKPI[5].value = response.kpi.cancel;

        packingChartData.labels =
            response.charts.packing7Days.labels;
        packingChartData.datasets[0].data =
            response.charts.packing7Days.datasets[0].data;
        statusChartData.labels =
            response.charts.status.labels;
        statusChartData.datasets[0].data =
            response.charts.status.datasets[0].data;

        recentActivities.length = 0;

response.activities.forEach(item => {

    const waktu = new Date(item.finishTime || item.startTime);

recentActivities.push({

    tanggal: waktu.toLocaleDateString("id-ID"),

    jam: waktu.toLocaleTimeString("id-ID"),

    invoice: item.resi,

    status: item.status,

    operator: item.operator || "-",

    totalItem: item.totalItem || 0

});

});

        renderKPI();

    }

    catch(err){

        console.error(err);

    }

}

function renderKPI(){

    const container =
        document.getElementById("kpiContainer");

    container.innerHTML = dashboardKPI.map(item=>`

        <div class="kpi-card ${item.color}">

            <div class="kpi-icon">

                <i data-lucide="${item.icon}"></i>

            </div>

            <div class="kpi-title">

                ${item.title}

            </div>

            <div class="kpi-value" id="${item.id}">
    ${item.value}
</div>

<div class="kpi-progress">

    <div
        class="progress-fill"
        id="progress-${item.id}">
    </div>

</div>

<div
    class="progress-text"
    id="percent-${item.id}">

    0%

</div>

        </div>
    
        `).join("");

    lucide.createIcons();

// Jalankan animasi angka
    const totalOrder =
    dashboardKPI.reduce(
        (a,b)=>a+b.value,
        0
    );

dashboardKPI.forEach(item=>{

    animateValue(item.id,item.value);

    animateProgress(
        item.id,
        item.value,
        totalOrder
    );

});

    renderRecentActivity();

    renderCharts();

}

// ======================================
// COUNT UP ANIMATION
// ======================================

function animateValue(id, endValue, duration = 1200){

    const element = document.getElementById(id);

    if(!element) return;

    let start = 0;

    const increment = Math.max(1, Math.ceil(endValue / (duration / 16)));

    const timer = setInterval(()=>{

        start += increment;

        if(start >= endValue){

            start = endValue;

            clearInterval(timer);

        }

        element.textContent = start.toLocaleString("id-ID");

    },16);

}

function animateProgress(id,value,total){

    const percent =
        total===0
        ?0
        :Math.round(value/total*100);

    const fill =
        document.getElementById(
            "progress-"+id
        );

    const text =
        document.getElementById(
            "percent-"+id
        );

    if(fill){

        fill.style.width =
            percent+"%";

    }

    if(text){

        text.textContent =
            percent+"%";

    }

}

// ======================================
// RECENT ACTIVITY
// ======================================

function renderRecentActivity(){

    const container = document.getElementById("recentActivity");

    if(!container) return;

    container.innerHTML = recentActivities.map(item => `

        <div class="activity-item">

    <div class="activity-time">

        <div class="activity-date">
            ${item.tanggal}
        </div>

        <div class="activity-hour">
            ${item.jam}
        </div>

    </div>

    <div class="activity-line">

        <div class="activity-dot"></div>

    </div>

    <div class="activity-content">

                <div class="activity-title">
                    ${item.invoice}
                </div>

                <div class="activity-detail">

                    <div class="activity-operator">
                        <i data-lucide="user" class="mini-icon"></i>
                        <span>${item.operator}</span>
                    </div>

                    <div class="status-badge ${item.status.toLowerCase().replace(/\s+/g,'-')}">

                         ${getStatusIcon(item.status)}

                         ${item.status}

                    </div>

                    <div class="activity-total">
                        📦 ${item.totalItem} Item
                    </div>

                </div>

            </div>

        </div>

    `).join("");

    lucide.createIcons();

}

// ======================================
// CHART
// ======================================

function renderCharts(){

    new Chart(

        document.getElementById("packingChart"),

        {

            type:"line",

            data:packingChartData,

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:false
                    }

                },

                scales:{

                    x:{
                        grid:{
                            display:false
                        }
                    },

                    y:{
                        beginAtZero:true
                    }

                }

            }

        }

    );

    new Chart(

        document.getElementById("statusChart"),

        {

            type:"doughnut",

            data:statusChartData,

            options:{

                responsive:true,

                maintainAspectRatio:false,

                cutout:"70%",

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{

                            color:"#fff",

                            padding:20

                        }

                    }

                }

            }

        }

    );

}

function getStatusIcon(status){

    switch(status.toUpperCase()){

        case "RECEIVING COMPLETE":
            return "📥";

        case "QC COMPLETE":
            return "🔍";

        case "PACKING":
            return "📦";

        case "READY PICKUP":
            return "🚚";

        case "RETURN":
            return "↩️";

        case "CANCEL":
            return "❌";

        default:
            return "•";

    }

}