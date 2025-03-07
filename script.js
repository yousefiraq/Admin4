import { db, collection, addDoc } from "./firebase-config.js";

document.getElementById("orderForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (name && phone && address) {
        try {
            await addDoc(collection(db, "orders"), { name, phone, address, status: "قيد الانتظار" });
            alert("تم إرسال الطلب بنجاح!");
            document.getElementById("orderForm").reset();
        } catch (error) {
            console.error("خطأ في إرسال الطلب: ", error);
        }
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
});

// تفعيل الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// إضافة مستخدم جديد
function addUser() {
    let table = document.getElementById("usersTable");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    
    row.insertCell(0).innerHTML = rowCount; // ترقيم المستخدمين
    row.insertCell(1).innerHTML = document.getElementById("nameInput").value;
    row.insertCell(2).innerHTML = document.getElementById("emailInput").value;
    row.insertCell(3).innerHTML = '<button onclick="editUser(this)">تعديل</button> <button onclick="deleteUser(this)">حذف</button>';

    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
}

// حذف مستخدم
function deleteUser(btn) {
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateUserNumbers();
}

// تعديل مستخدم
function editUser(btn) {
    let row = btn.parentNode.parentNode;
    let name = row.cells[1].innerHTML;
    let email = row.cells[2].innerHTML;

    let newName = prompt("تعديل الاسم:", name);
    let newEmail = prompt("تعديل البريد:", email);

    if (newName && newEmail) {
        row.cells[1].innerHTML = newName;
        row.cells[2].innerHTML = newEmail;
    }
}

// تحديث أرقام المستخدمين بعد الحذف
function updateUserNumbers() {
    let table = document.getElementById("usersTable");
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
}


// تفعيل/إلغاء الوضع الليلي
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

// التحقق من تفعيل الوضع الليلي سابقًا
window.onload = function() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};


// قائمة المستخدمين
let users = [];

// تحميل المستخدمين من localStorage
function loadUsers() {
    users = JSON.parse(localStorage.getItem("users")) || [];
    renderUsers();
}

// تحديث الجدول بناءً على البيانات
function renderUsers() {
    let table = document.getElementById("userTable");
    table.innerHTML = `
        <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الإجراءات</th>
        </tr>
    `;
    users.forEach((user, index) => {
        let row = table.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${index})">✏️ تعديل</button>
                <button onclick="deleteUser(${index})">🗑 حذف</button>
            </td>
        `;
    });
}

// إضافة مستخدم جديد
function addUser() {
    let name = document.getElementById("nameInput").value;
    let email = document.getElementById("emailInput").value;

    if (name && email) {
        users.push({ name, email });
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
    } else {
        alert("يرجى إدخال جميع البيانات!");
    }
}

// تعديل مستخدم
function editUser(index) {
    let newName = prompt("أدخل الاسم الجديد:", users[index].name);
    let newEmail = prompt("أدخل البريد الإلكتروني الجديد:", users[index].email);

    if (newName && newEmail) {
        users[index] = { name: newName, email: newEmail };
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
    }
}

// حذف مستخدم
function deleteUser(index) {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
    }
}

// تحميل البيانات عند فتح الصفحة
window.onload = function() {
    loadUsers();
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};
