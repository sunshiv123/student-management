/* ================= CONFIG ================= */
const API_BASE_URL = "https://student-management-jywp.onrender.com/students";
let currentPage = 0;
let totalPages = 1;
const PAGE_SIZE = 5;

/* ================= AUTO LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
});

/* ================= ADD / UPDATE ================= */
async function addStudent() {
    const id = document.getElementById("studentId").value;

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    try {
        const response = await fetch(
            id ? `${API_BASE_URL}/${id}` : API_BASE_URL,
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            }
        );

        if (!response.ok) throw new Error();

        showToast(id ? "Student updated successfully" : "Student added successfully");
        clearForm();
        loadStudents();

    } catch (err) {
        console.error(err);
        showToast("Failed to save student", "error");
    }
}

/* ================= LOAD STUDENTS ================= */
async function loadStudents() {
    try {
        const response = await fetch(
            `${API_BASE_URL}?page=${currentPage}&size=${PAGE_SIZE}`
        );

        if (!response.ok) throw new Error();

        const data = await response.json();
        const students = data.content || [];

        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        students.forEach(student => {
            tableBody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.phone}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Edit</button>
                        <button onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        totalPages = data.totalPages || 1;
        updatePaginationUI();

    } catch (err) {
        console.error(err);
        showToast("Failed to load students", "error");
    }
}

/* ================= EDIT ================= */
async function editStudent(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/${id}`);
        const student = await res.json();

        document.getElementById("studentId").value = student.id;
        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("course").value = student.course;
        document.getElementById("phone").value = student.phone;

        showToast("Edit mode enabled");

    } catch (err) {
        console.error(err);
        showToast("Failed to load student", "error");
    }
}

/* ================= DELETE ================= */
async function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    try {
        await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
        showToast("Student deleted");
        loadStudents();
    } catch (err) {
        console.error(err);
        showToast("Delete failed", "error");
    }
}

/* ================= SEARCH ================= */
async function searchStudents() {
    const name = document.getElementById("searchInput").value.trim();
    if (!name) return showToast("Enter name to search", "error");

    try {
        const res = await fetch(`${API_BASE_URL}/search?name=${name}`);
        const data = await res.json();

        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        data.forEach(s => {
            tableBody.innerHTML += `
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

        showToast("Search completed");

    } catch (err) {
        console.error(err);
        showToast("Search failed", "error");
    }
}

/* ================= PAGINATION ================= */
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

/* ================= UTIL ================= */
function clearForm() {
    ["studentId", "name", "email", "course", "phone"].forEach(
        id => document.getElementById(id).value = ""
    );
}

function showToast(msg, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.className = "toast", 3000);
}
