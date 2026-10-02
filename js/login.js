// ======================================
// LOGIN PAGE
// ======================================

const todayDate = document.getElementById("todayDate");

const clock = document.getElementById("clock");

function updateDateTime(){

    const now = new Date();

    const optionDate = {

        weekday:'long',

        day:'numeric',

        month:'long',

        year:'numeric'

    };

    todayDate.innerHTML =
    now.toLocaleDateString(
        'id-ID',
        optionDate
    );

    clock.innerHTML =
    now.toLocaleTimeString(
        'id-ID'
    );

}

updateDateTime();

setInterval(updateDateTime,1000);

/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});

// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", login);

async function login(e){

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if(username==="" || password===""){

        alert("Username dan Password wajib diisi.");

        return;

    }

    const result = await callAPI({

        action:"login",

        username,

        password

    });
    console.log(result);

    if(result.success){

// ===============================
// SIMPAN SESSION USER
// ===============================

sessionStorage.setItem(

    "currentUser",

    JSON.stringify(result.user)

);

    // Pindah ke Dashboard
    window.location.href = "dashboard.html";

}else{

    alert(result.message);

}

}
