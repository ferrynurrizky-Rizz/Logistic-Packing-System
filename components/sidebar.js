// ======================================
// SIDEBAR MENU CONFIG
// ======================================

const SIDEBAR_MENU = {

    ADMIN: [

        {
            page:"dashboard",
            icon:"house",
            title:"Dashboard"
        },

        {
            page:"receiving",
            icon:"truck",
            title:"Receiving"
        },

        {
            page:"qc",
            icon:"clipboard-check",
            title:"QC"
        },

        {
            page:"packing",
            icon:"package-check",
            title:"Packing"
        },

        {
            page:"inventory",
            icon:"boxes",
            title:"Inventory"
        },

        {
            page:"reports",
            icon:"chart-column",
            title:"Reports"
        },

        {
            page:"settings",
            icon:"settings",
            title:"Settings"
        }

    ],

    SUPERVISOR: [

        {
            page:"dashboard",
            icon:"house",
            title:"Dashboard"
        },

        {
            page:"receiving",
            icon:"truck",
            title:"Receiving"
        },

        {
            page:"qc",
            icon:"clipboard-check",
            title:"QC"
        },

        {
            page:"packing",
            icon:"package-check",
            title:"Packing"
        },

        {
            page:"inventory",
            icon:"boxes",
            title:"Inventory"
        },

        {
            page:"reports",
            icon:"chart-column",
            title:"Reports"
        }

    ],

    RECEIVING: [

        {
            page:"dashboard",
            icon:"house",
            title:"Dashboard"
        },

        {
            page:"receiving",
            icon:"truck",
            title:"Receiving"
        },

        {
            page:"reports",
            icon:"chart-column",
            title:"Reports"
        }

    ],

    QC: [

        {
            page:"dashboard",
            icon:"house",
            title:"Dashboard"
        },

        {
            page:"qc",
            icon:"clipboard-check",
            title:"QC"
        },

        {
            page:"reports",
            icon:"chart-column",
            title:"Reports"
        }

    ],

    PACKING: [

        {
            page:"dashboard",
            icon:"house",
            title:"Dashboard"
        },

        {
            page:"packing",
            icon:"package-check",
            title:"Packing"
        },

        {
            page:"reports",
            icon:"chart-column",
            title:"Reports"
        }

    ]

};

// ======================================
// BUILD SIDEBAR MENU
// ======================================

function buildMenu(role){

    const menus = SIDEBAR_MENU[role] || [];

    return menus.map(menu => `

        <a href="${menu.page}.html"
           class="menu-item"
           data-page="${menu.page}">

            <i data-lucide="${menu.icon}"></i>

            <span>${menu.title}</span>

        </a>

    `).join("");

}

// ======================================
// BUILD SIDEBAR
// ======================================

function buildSidebar(){

    const user = getCurrentUser();

        console.log(user);
        console.log(user.role);
        console.log(user.permissions);

    if(!user){

        window.location.href = "index.html";

        return;

    }

    document.getElementById("sidebar").innerHTML = `

    <div class="sidebar">

        <div class="logo">

            <img src="assets/logo.png">

            <h2>LPS</h2>

        </div>

        <nav class="menu">

            ${buildMenu(user.role)}

        </nav>

        <div class="sidebar-footer">

            <button id="logoutBtn" class="logout-btn">

                <i data-lucide="log-out"></i>

                <span>Logout</span>

            </button>

        </div>

    </div>

    `;

    lucide.createIcons();

}

/*
document.getElementById("sidebar").innerHTML = `

<div class="sidebar">

    <div class="logo">

        <img src="assets/logo.png">

        <h2>LPS</h2>

    </div>

    <nav class="menu">

        <a href="dashboard.html" class="menu-item" data-page="dashboard">
            <i data-lucide="house"></i>
            <span>Dashboard</span>
        </a>

        <a href="receiving.html" class="menu-item" data-page="receiving">
             <i data-lucide="truck"></i>
            <span>Receiving</span>
        </a>

        <a href="qc.html" class="menu-item" data-page="qc">
             <i data-lucide="clipboard-check"></i>
             <span>QC</span>
        </a>

        <a href="packing.html" class="menu-item" data-page="packing">
            <i data-lucide="package-check"></i>
             <span>Packing</span>
        </a>

        <a href="inventory.html" class="menu-item" data-page="inventory">
            <i data-lucide="boxes"></i>
             <span>Inventory</span>
        </a>

        <a href="reports.html" class="menu-item" data-page="reports">
             <i data-lucide="chart-column"></i>
             <span>Reports</span>
        </a>

        <a href="settings.html" class="menu-item" data-page="settings">
           <i data-lucide="settings"></i>
           <span>Settings</span>
        </a>

    </nav>

    <div class="sidebar-footer">

        <i data-lucide="log-out"></i>

    </div>

</div>

`;
*/

document.addEventListener("DOMContentLoaded", () => {

    buildSidebar();

    let currentPage = window.location.pathname
        .split("/")
        .pop()
        .replace(".html","");

    if(currentPage===""){

        currentPage="dashboard";

    }

    document.querySelectorAll(".menu-item").forEach(menu=>{

        if(menu.dataset.page===currentPage){

            menu.classList.add("active");

        }

    });

    lucide.createIcons();

});