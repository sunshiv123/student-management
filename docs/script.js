const API_BASE_URL = "http://localhost:8080/students";

let currentPage = 0;
let totalPages = 1;
const PAGE_SIZE = 5;

/* ---------------- AUTO LOAD ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(loadStudents, 1200); // Render wake-up
});

/* ---------------- ADD / UPDATE ---------------- */
async function addStudent() {
    const id = document.getElementById("studentId").value;

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    if (!student.name || !student.email) {
        showToast("Name and Email required", "error");
        return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error();

        showToast(id ? "Student updated" : "Student added", "success");
        clearForm();
        loadStudents();

    } catch (e) {
        console.error(e);
        showToast("Save failed", "error");
    }
}

/* ---------------- LOAD STUDENTS ---------------- */
async function loadStudents() {
    try {
        const res = await fetch(
            `${API_BASE_URL}?page=${currentPage}&size=${PAGE_SIZE}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        const students = data.content || [];

        const table = document.getElementById("studentTableBody");
        table.innerHTML = "";

        students.forEach(s => {
            table.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>${s.course}</td>
                    <td>${s.phone}</td>
                    <td>
                        <button onclick="editStudent(${s.id})">Edit</button>
                        <button onclick="deleteStudent(${s.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        totalPages = data.totalPages || 1;
        updatePaginationUI();

    } catch (e) {
        console.error(e);
        showToast("Failed to load students", "error");
    }
}

/* ---------------- DELETE ---------------- */
async function deleteStudent(id) {
    if (!confirm("Delete student?")) return;

    try {
        await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
        showToast("Student deleted", "success");
        loadStudents();
    } catch (e) {
        console.error(e);
        showToast("Delete failed", "error");
    }
}

/* ---------------- SEARCH ---------------- */
async function searchStudents() {
    const name = document.getElementById("searchInput").value.trim();
    if (!name) return showToast("Enter name to search", "error");

    try {
        const res = await fetch(`${API_BASE_URL}/search?name=${name}`);
        const data = await res.json();

        const table = document.getElementById("studentTableBody");
        table.innerHTML = "";

        data.forEach(s => {
            table.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>${s.course}</td>
                    <td>${s.phone}</td>
                    <td>
                        <button onclick="editStudent(${s.id})">Edit</button>
                        <button onclick="deleteStudent(${s.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        showToast("Search completed", "success");

    } catch (e) {
        console.error(e);
        showToast("Search failed", "error");
    }
}

/* ---------------- RESET SEARCH ---------------- */
function resetSearch() {
    document.getElementById("searchInput").value = "";
    currentPage = 0;
    loadStudents();
}

/* ---------------- EDIT ---------------- */
async function editStudent(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`);
        const s = await res.json();

        document.getElementById("studentId").value = s.id;
        document.getElementById("name").value = s.name;
        document.getElementById("email").value = s.email;
        document.getElementById("course").value = s.course;
        document.getElementById("phone").value = s.phone;

        showToast("Edit mode enabled", "success");

    } catch (e) {
        console.error(e);
        showToast("Edit failed", "error");
    }
}

/* ---------------- PAGINATION ---------------- */
function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadStudents();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        loadStudents();
    }
}

function updatePaginationUI() {
    document.getElementById("pageInfo").innerText =
        `Page ${currentPage + 1} of ${totalPages}`;
}

/* ---------------- UTIL ---------------- */
function clearForm() {
    document.getElementById("studentId").value = "";
    ["name", "email", "course", "phone"].forEach(id => {
        document.getElementById(id).value = "";
    });
}

function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.className = "toast", 3000);
}
