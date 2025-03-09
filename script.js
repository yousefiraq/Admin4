import { db, collection, addDoc } from "./firebase-config.js";

// تهيئة الخرائط
const platform = new H.service.Platform({
    apikey: "7kAhoWptjUW7A_sSWh3K2qaZ6Lzi4q3xaDRYwFWnCbE"
});

let userLatitude = null;
let userLongitude = null;

// تحديد الموقع
document.getElementById("getLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;
                showMap(userLatitude, userLongitude);
                alert("تم تحديد الموقع بنجاح! ✅");
            },
            (error) => alert("خطأ في الموقع: " + error.message)
        );
    } else {
        alert("المتصفح لا يدعم GPS ❌");
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

// الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// إرسال الطلب
document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const provider = document.getElementById("provider").value;
    const phone = "+964" + document.getElementById("phone").value;
    const governorate = document.getElementById("governorate").value;
    const cylinders = document.getElementById("cylinders").value;

    if (provider && phone && governorate && cylinders && userLatitude && userLongitude) {
        try {
            // إضافة إلى Firebase
            await addDoc(collection(db, "orders"), {
                provider,
                phone,
                governorate,
                cylinders,
                latitude: userLatitude,
                longitude: userLongitude,
                status: "قيد الانتظار",
                timestamp: new Date()
            });

            // عرض الملخص
            document.getElementById("orderSummary").classList.remove("hidden");
            document.getElementById("summaryContent").innerHTML = `
                <p><strong>المزود:</strong> ${provider}</p>
                <p><strong>الهاتف:</strong> ${phone}</p>
                <p><strong>المحافظة:</strong> ${governorate}</p>
                <p><strong>الكمية:</strong> ${cylinders} أسطوانة</p>
                <div class="success-animation">
                    <i class="fas fa-check-circle"></i>
                    <p>تم استلام طلبك بنجاح! 🎉</p>
                </div>
            `;

            // إعادة تعيين النموذج
            document.getElementById("orderForm").reset();
        } catch (error) {
            console.error("فشل الإرسال:", error);
            alert("حدث خطأ! الرجاء المحاولة لاحقًا ❌");
        }
    } else {
        alert("الرجاء ملء جميع الحقول وتحديد الموقع! ⚠️");
    }
});
