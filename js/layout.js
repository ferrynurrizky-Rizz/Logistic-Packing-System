// ======================================
// GLOBAL ROUTE GUARD
// ======================================

(function () {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    // Halaman yang tidak membutuhkan login
    const publicPages = [
        "",
        "index.html"
    ];

    // Jika halaman login, jangan lakukan redirect
    if (publicPages.includes(currentPage)) {
        return;
    }

    function getSessionUser() {

        const user =
            sessionStorage.getItem("currentUser");

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch (error) {

            console.error(
                "Session currentUser tidak valid:",
                error
            );

            sessionStorage.removeItem("currentUser");

            return null;
        }

    }

    function checkRoute() {

        const user = getSessionUser();

        // ============================
        // BELUM LOGIN
        // ============================

        if (!user) {

            console.log(
                "GLOBAL GUARD: user tidak ditemukan"
            );

            window.location.replace("index.html");

            return false;
        }

        // ============================
        // ADMIN
        // ============================

        if (user.role === "ADMIN") {

            return true;

        }

        // ============================
        // ROUTE → PERMISSION
        // ============================

        const routePermission = {

            "dashboard.html": "dashboard",
            "receiving.html": "receiving",
            "qc.html": "qc",
            "packing.html": "packing",
            "inventory.html": "inventory",
            "reports.html": "reports",
            "settings.html": "settings"

        };

        const requiredPermission =
            routePermission[currentPage];

        // Jika halaman tidak terdaftar,
        // jangan blokir halaman secara otomatis
        if (!requiredPermission) {

            return true;

        }

        const permissions =
            Array.isArray(user.permissions)
                ? user.permissions
                : [];

        // ============================
        // CEK PERMISSION
        // ============================

        if (!permissions.includes(requiredPermission)) {

            console.log(
                "GLOBAL GUARD: akses ditolak",
                {
                    user: user.username,
                    role: user.role,
                    page: currentPage,
                    requiredPermission
                }
            );

            window.location.replace("dashboard.html");

            return false;
        }

        return true;

    }

    // Jalankan segera
    checkRoute();

    // ============================
    // BACK / FORWARD CACHE
    // ============================

    window.addEventListener("pageshow", function (event) {

        const user = getSessionUser();

        if (!user) {

            console.log(
                "GLOBAL GUARD: halaman dipanggil kembali setelah logout"
            );

            window.location.replace("index.html");

            return;
        }

        // Jika halaman berasal dari bfcache,
        // cek permission lagi
        if (event.persisted) {

            checkRoute();

        }

    });

})();


// ======================================
// DOM READY
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const app = document.querySelector(".app");

    // ===========================
    // Restore Sidebar State
    // ===========================

    const sidebarState =
        localStorage.getItem("sidebar");

    if (
        app &&
        sidebarState === "collapsed"
    ) {

        app.classList.add("sidebar-collapsed");

    }

    // ===========================
    // Toggle Sidebar
    // ===========================

    document.body.addEventListener("click", (e) => {

        const toggle =
            e.target.closest("#toggleSidebar");

        if (!toggle || !app) return;

        app.classList.toggle(
            "sidebar-collapsed"
        );

        if (
            app.classList.contains(
                "sidebar-collapsed"
            )
        ) {

            localStorage.setItem(
                "sidebar",
                "collapsed"
            );

        } else {

            localStorage.setItem(
                "sidebar",
                "expanded"
            );

        }

    });

});


// ======================================
// CURRENT USER
// ======================================

function getCurrentUser() {

    const user =
        sessionStorage.getItem("currentUser");

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "currentUser tidak valid:",
            error
        );

        sessionStorage.removeItem(
            "currentUser"
        );

        return null;

    }

}


// ======================================
// ROLE
// ======================================

function getRole() {

    const user = getCurrentUser();

    return user
        ? user.role
        : "";

}


// ======================================
// PERMISSION
// ======================================

function hasPermission(page) {

    const user = getCurrentUser();

    if (!user) {
        return false;
    }

    const permissions =
        Array.isArray(user.permissions)
            ? user.permissions
            : [];

    return permissions.includes(page);

}


// ======================================
// CHECK LOGIN
// ======================================

function requireLogin() {

    const user =
        getCurrentUser();

    console.log(
        "CURRENT USER =",
        user
    );

    if (!user) {

        console.log(
            "Redirect ke login"
        );

        window.location.replace(
            "index.html"
        );

        return false;

    }

    return true;

}


// ======================================
// CHECK PAGE PERMISSION
// ======================================

function requirePermission(page) {

    if (!requireLogin()) {
        return false;
    }

    const user =
        getCurrentUser();

    // ADMIN boleh semua
    if (user.role === "ADMIN") {
        return true;
    }

    if (!hasPermission(page)) {

        alert(
            "Anda tidak memiliki hak akses."
        );

        window.location.replace(
            "dashboard.html"
        );

        return false;

    }

    return true;

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    console.log(
        "LOGOUT:",
        getCurrentUser()
    );

    // Hapus session
    sessionStorage.removeItem(
        "currentUser"
    );

    // Pastikan tidak ada user lama
    sessionStorage.removeItem(
        "user"
    );

    // Kembali ke login dan
    // mengganti entry history saat ini
    window.location.replace(
        "index.html"
    );

}


// ======================================
// USER INFO
// ======================================

function showCurrentUser() {

    const user =
        getCurrentUser();

    if (!user) return;

    const el =
        document.getElementById(
            "currentUserName"
        );

    if (el) {

        el.textContent =
            user.nama ||
            user.username ||
            "";

    }

}


// ======================================
// PAGE GUARD
// ======================================

function protectPage(page) {

    const user =
        getCurrentUser();

    // Tidak login
    if (!user) {

        window.location.replace(
            "index.html"
        );

        return false;

    }

    // ADMIN
    if (user.role === "ADMIN") {

        return true;

    }

    // Permission
    const permissions =
        Array.isArray(user.permissions)
            ? user.permissions
            : [];

    if (
        !permissions.includes(page)
    ) {

        window.location.replace(
            "dashboard.html"
        );

        return false;

    }

    return true;

}