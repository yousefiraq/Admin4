import { db, collection, addDoc } from "./firebase-config.js";

// تهيئة التاريخ
const dateElement = document.getElementById('date');
dateElement.textContent = new Date().toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// تبديل الوضع الداكن
document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    body.toggleAttribute('data-theme');
    const icon = document.querySelector('#themeToggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// إعدادات الخريطة
let userLatitude = null;
let userLongitude = null;
const platform = new H.service.Platform({ apikey: "7kAhoWptjUW7A_sSWh3K2qaZ6Lzi4q3xaDRYwFWnCbE" });

// تحديد الموقع وإرساله إلى Firebase
document.getElementById("getLocation").addEventListener("click", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    userLatitude = position.coords.latitude;
                    userLongitude = position.coords.longitude;
                    
                    // إرسال الموقع إلى مجموعة locations
                    await addDoc(collection(db, "locations"), {
                        latitude: userLatitude,
                        longitude: userLongitude,
                        timestamp: new Date()
                    });
                    
                    showMap(userLatitude, userLongitude);
                    alert("✅ تم تحديد الموقع وإرساله بنجاح!");
                } catch (error) {
                    console.error("فشل في إرسال الموقع:", error);
                    alert("❌ حدث خطأ أثناء إرسال الموقع!");
                }
            },
            (error) => alert("خطأ في تحديد الموقع: " + error.message)
        );
    } else {
        alert("المتصفح لا يدعم تحديد الموقع.");
    }
});

// عرض الخريطة
function showMap(lat, lng) {
    const mapContainer = document.getElementById('map');
    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
        center: { lat, lng },
        zoom: 14
    });
    new H.map.Marker({ lat, lng }).addTo(map);
}

// التحقق من صحة البيانات
const validateForm = () => {
    if (!userLatitude || !userLongitude) {
        alert("الرجاء تحديد الموقع أولاً!");
        return false;
    }
    if (!/^07\d{9}$/.test(document.getElementById('phone').value)) {
        alert("رقم الهاتف غير صحيح!");
        return false;
    }
    return true;
};

// نافذة التأكيد
const modal = document.getElementById('confirmationModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        province: document.getElementById('province').value,
        cylinders: document.getElementById('cylinders').value,
        latitude: userLatitude,
        longitude: userLongitude
    };

    document.getElementById('orderDetails').innerHTML = `
        <p>الاسم: ${formData.name}</p>
        <p>الهاتف: ${formData.phone}</p>
        <p>المحافظة: ${formData.province}</p>
        <p>عدد الأنابيب: ${formData.cylinders}</p>
        <p>الإحداثيات: ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}</p>
    `;
    modal.style.display = "block";
});

// إرسال الطلب الكامل إلى Firebase
confirmBtn.addEventListener('click', async () => {
    try {
        await addDoc(collection(db, "orders"), {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            province: document.getElementById('province').value.trim(),
            cylinders: document.getElementById('cylinders').value.trim(),
            latitude: userLatitude,
            longitude: userLongitude,
            status: "قيد الانتظار",
            timestamp: new Date()
        });
        alert("تم إرسال الطلب بنجاح!");
        document.getElementById("orderForm").reset();
        modal.style.display = "none";
    } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ أثناء الإرسال: " + error.message);
    }
});

cancelBtn.addEventListener('click', () => modal.style.display = "none");
window.onclick = (e) => e.target == modal && (modal.style.display = "none");
