const API = "https://library-book-management-o892.onrender.com//api";

function showRegister() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
}

function showLogin() {
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

async function register() {
  const username = regUser.value;
  const password = regPass.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  alert("Registered! Now Login");
  showLogin();
}

async function login() {
  const username = loginUser.value;
  const password = loginPass.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  loadBooks();
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainPage").style.display = "block";
}

async function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  await fetch(`${API}/books/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, year }),
  });

  loadBooks();
}

async function loadBooks() {
  const res = await fetch(`${API}/books`);
  const books = await res.json();

  bookList.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `${book.title} - ${book.author} (${book.year}) 
    <button onclick="deleteBook('${book._id}')">X</button>`;
    bookList.appendChild(li);
  });
}

async function deleteBook(id) {
  await fetch(`${API}/books/${id}`, { method: "DELETE" });
  loadBooks();
}

function logout() {
  document.getElementById("mainPage").style.display = "none";
  showLogin();
}
