const API_URL = "/api";

// ✅ Save Token to Browser Storage
function saveToken(token) {
  localStorage.setItem("token", token);
}

// ✅ Get Token
function getToken() {
  return localStorage.getItem("token");
}

// ✅ Logout
function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

// ✅ Auto redirect if not logged in (for books page)
if (location.pathname.endsWith("index.html") || location.pathname === "/") {
  if (!getToken()) location.href = "login.html";
}

// ✅ Login Submit
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    });

    const data = await res.json();
    document.getElementById("loginMsg").innerText = data.message;

    if (data.token) {
      saveToken(data.token);
      location.href = "index.html";
    }
  });
}

// ✅ Registration Submit
if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.value,
          email: regEmail.value,
          password: regPassword.value,
        }),
      });

      const data = await res.json();
      document.getElementById("regMsg").innerText = data.message;

      if (data.message === "Registration successful") {
        setTimeout(() => (location.href = "login.html"), 1500);
      }
    });
}
