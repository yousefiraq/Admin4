import { db, collection, getDocs } from "./firebase-config.js";

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.phone}</td>
                    <td>${data.address}</td>
                    <td><span class="status">${data.status}</span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
        showAlert('فشل في تحميل الطلبات!', 'error');
    }
}

window.onload = fetchOrders;
