// إضافة مستخدم مع تأثيرات
function addUser() {
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;

    if (!name || !email) {
        showAlert('يرجى ملء جميع الحقول!', 'error');
        return;
    }

    const table = document.getElementById("usersTable");
    const newRow = table.insertRow(-1);

    // الترقيم التلقائي
    newRow.insertCell(0).textContent = table.rows.length;

    // إضافة البيانات
    newRow.insertCell(1).textContent = name;
    newRow.insertCell(2).textContent = email;

    // إضافة أزرار الإجراءات
    const actionsCell = newRow.insertCell(3);
    actionsCell.innerHTML = `
        <button class="button edit-btn" onclick="editUser(this)">✎ تعديل</button>
        <button class="button delete-btn" onclick="deleteUser(this)">🗑️ حذف</button>
    `;

    // تأثير الإضافة
    newRow.style.opacity = '0';
    setTimeout(() => {
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateX(0)';
    }, 100);

    showAlert('تمت إضافة المستخدم بنجاح!', 'success');
}

// حذف مستخدم مع تأثير
function deleteUser(btn) {
    const row = btn.closest('tr');
    row.style.transform = 'translateX(100%)';
    row.style.opacity = '0';

    setTimeout(() => {
        row.remove();
        updateUserNumbers();
        showAlert('تم حذف المستخدم بنجاح!', 'success');
    }, 300);
}

// تحديث الترقيم
function updateUserNumbers() {
    const table = document.getElementById("usersTable");
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].textContent = i;
    }
}

// عرض التنبيهات
function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

// تفعيل الوضع الداكن
document.getElementById("darkModeToggle").addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
