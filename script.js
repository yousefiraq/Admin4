import { db, collection, addDoc } from "./firebase-config.js";

// تهيئة الخرائط
const platform = new H.service.Platform({
    apikey: "7kAhoWptjUW7A_sSWh3K2qaZ6Lzi4q3xaDRYwFWnCbE"
});

// متغيرات التطبيق
let userLocation = null;
const provinces = ["بغداد", "البصرة", /*...جميع المحافظات...*/];

// تحديث التاريخ
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('ar-IQ');

// إدارة الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// تحديد الموقع
document.getElementById("getLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                initMap(userLocation.lat, userLocation.lng);
            },
            error => alert("خطأ في الموقع: " + error.message)
        );
    }
});

// عرض الخريطة
function initMap(lat, lng) {
    const mapContainer = document.getElementById('map');
    const defaultLayers = platform.createDefaultLayers();
    new H.Map(mapContainer, defaultLayers.vector.normal.map, {
        center: { lat, lng },
        zoom: 14
    }).addObject(new H.map.Marker({ lat, lng }));
}

// إرسال الطلب
document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById("name").value,
        phone: "+9647" + document.getElementById("phone").value,
        governorate: document.getElementById("governorate").value,
        cylinders: document.getElementById("cylinders").value,
        ...userLocation
    };

    if (validateForm(formData)) {
        showConfirmation(formData);
    }
});

// التحقق من النموذج
function validateForm(data) {
    return data.phone.length === 13 && 
           data.governorate && 
           data.cylinders >= 1 && 
           data.cylinders <= 10;
}

// عرض التأكيد
function showConfirmation(data) {
    const modal = document.getElementById("confirmationModal");
    document.getElementById("modalBody").innerHTML = `
        <p>الاسم: ${data.name}</p>
        <p>الهاتف: ${data.phone}</p>
        <p>المحافظة: ${data.governorate}</p>
        <p>الكمية: ${data.cylinders}</p>
    `;
    modal.classList.remove("hidden");
}

// إدارة النافذة المنبثقة
document.querySelector(".confirm-btn").addEventListener("click", async () => {
    try {
        await addDoc(collection(db, "orders"), {
            ...formData,
            status: "قيد الانتظار",
            timestamp: new Date()
        });
        alert("تم الإرسال بنجاح 🎉");
        location.reload();
    } catch (error) {
        console.error("Error:", error);
    }
});

document.querySelector(".cancel-btn").addEventListener("click", () => {
    document.getElementById("confirmationModal").classList.add("hidden");
});
