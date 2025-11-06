const apiUrl = "/api";

// UI Elements
const loginPage = document.getElementById("login-page");
const registerPage = document.getElementById("register-page");
const dashboardPage = document.getElementById("dashboard");
const userNameDisplay = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

// Forms
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");

// Toast
function showToast(msg) {
  alert(msg);
}

// UI switch
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

// Save Token
function saveUser(token, name) {
  localStorage.setItem("token", token);
  localStorage.setItem("name", name);
}

function checkLogin() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  if (!token) return showLogin();
  userNameDisplay.innerText = name;
  showDashboard();
  fetchBooks();
}
checkLogin();

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = reg - name.value;
  const email = reg - email.value;
  const password = reg - password.value;

  const res = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  showToast(data.message);
  showLogin();
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = login - email.value;
  const password = login - password.value;

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.token) return showToast(data.message);

  saveUser(data.token, data.name);
  showDashboard();
  fetchBooks();
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  showLogin();
});

// Fetch Books
async function fetchBooks() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiUrl}/books`, {
    headers: { Authorization: token },
  });
  const books = await res.json();
  displayBooks(books);
}

function displayBooks(books) {
  bookList.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${book.title}</strong> - ${book.author} (${book.year})</span>
      <button onclick="deleteBook('${book._id}')">❌</button>
    `;
    bookList.appendChild(li);
  });
}

// Add Book
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const title = title.value;
  const author = author.value;
  const year = year.value;

  await fetch(`${apiUrl}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title, author, year }),
  });
  showToast("✅ Book Added");
  fetchBooks();
  bookForm.reset();
});

// Delete Book
async function deleteBook(id) {
  const token = localStorage.getItem("token");
  await fetch(`${apiUrl}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  showToast("🗑 Deleted");
  fetchBooks();
}
