// ======================================
// HEADER
// ======================================

// ======================================
// FORMAT ROLE
// ======================================

function formatRole(role){

    switch(role){

        case "ADMIN":
            return "Administrator";

        case "SUPERVISOR":
            return "Supervisor";

        case "RECEIVING":
        case "OPERATOR":
            return "Receiving";

        case "QC":
            return "Quality Control";

        case "PACKING":
            return "Packing";

        default:
            return role || "-";

    }

}


// ======================================
// GET CURRENT USER
// ======================================

function getHeaderUser(){

    try{

        const data =
            sessionStorage.getItem("currentUser");

        if(!data){

            return {
                username:"",
                nama:"Guest",
                role:""
            };

        }

        return JSON.parse(data);

    }
    catch(error){

        console.error(
            "Gagal membaca currentUser:",
            error
        );

        return {
            username:"",
            nama:"Guest",
            role:""
        };

    }

}


const headerUser = getHeaderUser();


// ======================================
// BUILD HEADER
// ======================================

const headerContainer =
    document.getElementById("header");


if(headerContainer){

    headerContainer.innerHTML = `

        <div class="header">

            <!-- ========================= -->
            <!-- LEFT -->
            <!-- ========================= -->

            <div class="header-left">

                <button
                    id="toggleSidebar"
                    class="icon-btn"
                    type="button"
                    title="Menu">

                    <i data-lucide="menu"></i>

                </button>


                <div class="page-info">

                    <h2>Dashboard</h2>

                    <p>
                        Logistic Packing System
                    </p>

                </div>

            </div>


            <!-- ========================= -->
            <!-- RIGHT -->
            <!-- ========================= -->

            <div class="header-right">


                <!-- CLOCK -->

                <div class="clock">

                    <i data-lucide="clock-3"></i>

                    <span id="liveClock">
                        --:--:--
                    </span>

                </div>


                <!-- NOTIFICATION -->

                <button
                    class="icon-btn"
                    type="button"
                    title="Notification">

                    <i data-lucide="bell"></i>

                </button>


                <!-- USER MENU -->

                <div class="user-menu">


                    <button
                        id="userMenuBtn"
                        class="user-info"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="true">


                        <div class="avatar">

                            ${
                                (headerUser.nama || "G")
                                    .charAt(0)
                                    .toUpperCase()
                            }

                        </div>


                        <div class="user-detail">

                            <strong>
                                ${headerUser.nama || "Guest"}
                            </strong>

                            <small>
                                ${formatRole(headerUser.role)}
                            </small>

                        </div>


                        <i
                            data-lucide="chevron-down"
                            class="user-chevron">
                        </i>


                    </button>


                    <!-- ========================= -->
                    <!-- DROPDOWN -->
                    <!-- ========================= -->

                    <div
                        id="userDropdown"
                        class="user-dropdown"
                        role="menu">


                        <div class="dropdown-user-info">

                            <div class="dropdown-avatar">

                                ${
                                    (headerUser.nama || "G")
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>


                            <div>

                                <strong>
                                    ${headerUser.nama || "Guest"}
                                </strong>

                                <small>
                                    ${formatRole(headerUser.role)}
                                </small>

                            </div>

                        </div>


                        <div class="dropdown-divider"></div>


                        <!-- PROFILE -->

                        <button
                            type="button"
                            class="dropdown-item"
                            id="profileBtn">

                            <i data-lucide="user"></i>

                            <span>
                                Profile
                            </span>

                        </button>


                        <!-- CHANGE PASSWORD -->

                        <button
                            type="button"
                            class="dropdown-item"
                            id="changePasswordBtn">

                            <i data-lucide="key"></i>

                            <span>
                                Change Password
                            </span>

                        </button>


                        ${
                            headerUser.role === "ADMIN"
                            ?
                            `

                            <div class="dropdown-divider"></div>

                            <button
                                type="button"
                                id="switchAccountBtn"
                                class="dropdown-item">

                                <i data-lucide="repeat"></i>

                                <span>
                                    Switch Account
                                </span>

                            </button>

                            `
                            :
                            ""
                        }


                        <div class="dropdown-divider"></div>


                        <!-- LOGOUT -->

                        <button
                            type="button"
                            id="headerLogoutBtn"
                            class="dropdown-item danger">

                            <i data-lucide="log-out"></i>

                            <span>
                                Logout
                            </span>

                        </button>


                    </div>

                </div>

            </div>

        </div>

    `;

}


// ======================================
// RENDER ICON
// ======================================

if(
    typeof lucide !== "undefined"
){

    lucide.createIcons();

}


// ======================================
// USER DROPDOWN
// ======================================

const userMenuBtn =
    document.getElementById("userMenuBtn");

const userDropdown =
    document.getElementById("userDropdown");


if(
    userMenuBtn &&
    userDropdown
){

    userMenuBtn.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

            const isOpen =
                userDropdown.classList.toggle("show");

            userMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        }
    );


    document.addEventListener(
        "click",
        function(event){

            if(
                !userDropdown.contains(event.target) &&
                !userMenuBtn.contains(event.target)
            ){

                userDropdown.classList.remove("show");

                userMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// ======================================
// HEADER LOGOUT
// ======================================

const headerLogoutBtn =
    document.getElementById("headerLogoutBtn");


if(headerLogoutBtn){

    headerLogoutBtn.addEventListener(
        "click",
        function(){

            sessionStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "index.html";

        }
    );

}


// ======================================
// PROFILE
// ======================================

const profileBtn =
    document.getElementById("profileBtn");


if(profileBtn){

    profileBtn.addEventListener(
        "click",
        function(){

            alert(
                "Menu Profile akan kita kerjakan pada tahap berikutnya."
            );

        }
    );

}


// ======================================
// CHANGE PASSWORD
// ======================================

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


if(changePasswordBtn){

    changePasswordBtn.addEventListener(
        "click",
        function(){

            alert(
                "Menu Change Password akan kita kerjakan pada tahap berikutnya."
            );

        }
    );

}


// ======================================
// SWITCH ACCOUNT
// ADMIN ONLY
// ======================================

const switchAccountBtn =
    document.getElementById(
        "switchAccountBtn"
    );


if(
    switchAccountBtn &&
    headerUser.role === "ADMIN"
){

    switchAccountBtn.addEventListener(
        "click",
        function(){

            alert(
                "Switch Account Admin akan kita kerjakan pada tahap berikutnya."
            );

        }
    );

}