const API_URL = "https://student-management-xyz.onrender.com/students";
let currentPage = 0;
let totalPages = 1;
const PAGE_SIZE = 5;

/* ---------------- AUTO LOAD ---------------- */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(loadStudents, 1000); // wait 1 sec for backend
});

/* ---------------- ADD or UPDATE ---------------- */
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
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            }
        );

        if (!response.ok) throw new Error();

        showToast(
            id ? "Student updated successfully" : "Student added successfully",
            "success"
        );

        clearForm();
        loadStudents();

    } catch (err) {
        console.error(err);
        showToast("Something went wrong while saving student", "error");
    }
}

/* ---------------- LOAD ALL ---------------- */
currentPage = 0;
async function loadStudents() {
    try {
        const res = await fetch(
            `${API_URL}?page=${currentPage}&size=${PAGE_SIZE}`
        );
        const json = await res.json();

        const students = json.data.content;
        totalPages = json.data.totalPages;

        const table = document.getElementById("studentTableBody");
        table.innerHTML = "";

        students.forEach(s => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.course}</td>
                <td>${s.phone}</td>
                <td>
                    <button onclick="editStudent(${s.id})">Edit</button>
                    <button onclick="deleteStudent(${s.id})" style="color:red;margin-left:5px">
                        Delete
                    </button>
                </td>
            `;
            table.appendChild(row);
        });

        updatePaginationUI();

    } catch (err) {
        console.error(err);
        showToast("Failed to load students", "error");
    }
}

/* ---------------- EDIT ---------------- */
async function editStudent(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const json = await res.json();
        const s = json.data;

        document.getElementById("studentId").value = s.id;
        document.getElementById("name").value = s.name;
        document.getElementById("email").value = s.email;
        document.getElementById("course").value = s.course;
        document.getElementById("phone").value = s.phone;

        showToast("Edit mode enabled", "success");

    } catch (err) {
        console.error(err);
        showToast("Failed to fetch student details", "error");
    }
}

/* ---------------- DELETE ---------------- */
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        showToast("Student deleted successfully", "success");
        loadStudents();
    } catch (err) {
        console.error(err);
        showToast("Delete failed", "error");
    }
}

/* ---------------- SEARCH ---------------- */
async function searchStudents() {
    const name = document.getElementById("searchInput").value.trim();

    if (name === "") {
        showToast("Please enter a name to search", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?name=${name}`);
        const result = await response.json();

        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        result.data.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td>${student.phone}</td>
                <td>
                    <button onclick="editStudent(${student.id})">Edit</button>
                    <button onclick="deleteStudent(${student.id})" style="color:red;margin-left:5px">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        showToast("Search completed", "success");

    } catch (error) {
        console.error(error);
        showToast("Search failed", "error");
    }
}

/* ---------------- RESET SEARCH ---------------- */
function resetSearch() {
    document.getElementById("searchInput").value = "";
    loadStudents();
    showToast("Search reset", "success");
}

/* ---------------- CLEAR FORM ---------------- */
function clearForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("course").value = "";
    document.getElementById("phone").value = "";
}

/* ---------------- TOAST ---------------- */
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

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

    document.querySelector(".pagination button:first-child").disabled =
        currentPage === 0;

    document.querySelector(".pagination button:last-child").disabled =
        currentPage === totalPages - 1;
}
