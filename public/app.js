const API_URL = "https://library-book-management-o892.onrender.com/api";
const bookList = document.getElementById("bookList");
const searchBar = document.getElementById("searchBar");
const bookForm = document.getElementById("bookForm");

// Modal for Edit
const editModal = new bootstrap.Modal(document.getElementById("editModal"));

// Load All Books
async function loadBooks() {
  const res = await fetch(`${API_URL}/books`);
  const books = await res.json();
  displayBooks(books);
}

// Display Books in Table
function displayBooks(books) {
  bookList.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2"
          onclick="openEditModal('${book._id}', '${book.title}', '${
      book.author
    }', '${book.year || ""}')">
          Edit
        </button>
        <button class="btn btn-danger btn-sm"
          onclick="deleteBook('${book._id}')">
          Delete
        </button>
      </td>
    `;
    bookList.appendChild(row);
  });
}

// Add Book
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    year: document.getElementById("year").value,
  };

  await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  bookForm.reset();
  loadBooks();
});

// Delete Book
async function deleteBook(id) {
  await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  loadBooks();
}

// ✅ Open Edit Modal with data
function openEditModal(id, title, author, year) {
  document.getElementById("editId").value = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editAuthor").value = author;
  document.getElementById("editYear").value = year;

  editModal.show();
}

// ✅ Update Book
document
  .getElementById("editBookForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const updatedBook = {
      title: document.getElementById("editTitle").value,
      author: document.getElementById("editAuthor").value,
      year: document.getElementById("editYear").value,
    };

    await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    });

    editModal.hide();
    loadBooks();
  });

// ✅ Search Functionality (REAL-TIME CLIENT FILTER)
document.getElementById("searchBar").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const rows = document.querySelectorAll("#bookList tr");

  rows.forEach((row) => {
    const title = row.children[0].innerText.toLowerCase();
    const author = row.children[1].innerText.toLowerCase();
    const year = row.children[2].innerText.toLowerCase();

    if (
      title.includes(searchText) ||
      author.includes(searchText) ||
      year.includes(searchText)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// Initial Load
loadBooks();
