// 🚀 Library System Frontend - Single Page App

const apiUrl = "https://library-book-management-o892.onrender.com/api";
// const apiUrl = "http://localhost:5000/api"; // 👉 If testing locally

// ✅ UI Elements
const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const dashboardPage = document.getElementById("dashboard");
const userNameDisplay = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

// Forms
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Book elements
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");

// ✅ Toast Messages
function showToast(msg) {
  alert(msg);
}

// ✅ Screen Navigation
function showLogin() {
  loginPage.style.display = "block";
  registerPage.style.display = "none";
  dashboardPage.style.display = "none";
}

function showRegister() {
  loginPage.style.display = "none";
  registerPage.style.display = "block";
  dashboardPage.style.display = "none";
}

function showDashboard() {
  loginPage.style.display = "none";
  registerPage.style.display = "none";
  dashboardPage.style.display = "block";
}

// ✅ Save credentials in LocalStorage
function saveUser(token, name) {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
}

// ✅ Auto login if token is available
function checkLogin() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  if (!token) return showLogin();

  userNameDisplay.innerText = name;
  showDashboard();
  fetchBooks();
}
checkLogin();

// ✅ REGISTER ✅
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  showToast(data.message);
  showLogin();
});

// ✅ LOGIN ✅
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!data.token) return showToast(data.message);

  saveUser(data.token, data.name);
  userNameDisplay.innerText = data.name;
  showDashboard();
  fetchBooks();
});

// ✅ LOGOUT ✅
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  showLogin();
});

// ✅ Fetch Books ✅
async function fetchBooks() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${apiUrl}/books`, {
    headers: { Authorization: "Bearer " + token },
  });

  const books = await res.json();
  displayBooks(books);
}

// ✅ Display Books ✅
function displayBooks(books) {
  bookList.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${book.title}</strong> — ${book.author} (${
      book.year || "N/A"
    })</span>
      <button onclick="deleteBook('${book._id}')">❌</button>
    `;
    bookList.appendChild(li);
  });
}

// ✅ Add Book ✅
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const token = localStorage.getItem("token");

  await fetch(`${apiUrl}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, author, year }),
  });

  showToast("✅ Book Added");
  fetchBooks();
  bookForm.reset();
});

// ✅ Delete Book ✅
async function deleteBook(id) {
  const token = localStorage.getItem("token");

  await fetch(`${apiUrl}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  showToast("🗑️ Book Deleted");
  fetchBooks();
}

// ✅ Search Filter ✅
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  [...bookList.children].forEach((li) => {
    li.style.display = li.innerText.toLowerCase().includes(filter)
      ? "flex"
      : "none";
  });
});
