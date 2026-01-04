const API_BASE_URL = "https://student-management-jywp.onrender.com/students";

let currentPage = 0;
let totalPages = 1;
const PAGE_SIZE = 5;

/* ---------------- AUTO LOAD ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(loadStudents, 1200); // give Render time to wake up
});

/* ---------------- ADD ---------------- */
async function addStudent() {
    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    try {
        const res = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error();

        clearForm();
        loadStudents();
        showToast("Student added successfully");

    } catch {
        showToast("Failed to add student", "error");
    }
}

/* ---------------- LOAD ---------------- */
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
                        <button onclick="deleteStudent(${s.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        totalPages = data.totalPages || 1;
        updatePaginationUI();

    } catch (e) {
        console.error(e);
    }
}

/* ---------------- DELETE ---------------- */
async function deleteStudent(id) {
    if (!confirm("Delete student?")) return;

    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
    loadStudents();
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
