import { db, collection, addDoc } from "./firebase-config.js";
import { GeoPoint } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ---------- تحديد الموقع الجغرافي ----------
document.getElementById("getLocation").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                document.getElementById("latitude").value = lat;
                document.getElementById("longitude").value = lng;
                
                const mapDiv = document.getElementById("map");
                mapDiv.style.display = "block";
                
                // تهيئة الخريطة
                const map = new google.maps.Map(mapDiv, {
                    center: { lat, lng },
                    zoom: 15,
                    mapTypeId: 'hybrid'
                });
                
                new google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    title: "موقعك الحالي"
                });
            },
            (error) => {
                alert("❌ خطأ: " + error.message);
            }
        );
    } else {
        alert("⚠️ المتصفح لا يدعم تحديد الموقع!");
    }
});

// ---------- إرسال الطلب إلى Firebase ----------
document.getElementById("orderForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    if (name && phone && address && latitude && longitude) {
        try {
            await addDoc(collection(db, "orders"), { 
                name, 
                phone, 
                address, 
                location: new GeoPoint(
                    parseFloat(latitude),
                    parseFloat(longitude)
                ),
                status: "قيد الانتظار",
                timestamp: new Date() 
            });
            alert("✅ تم إرسال الطلب بنجاح!");
            document.getElementById("orderForm").reset();
            document.getElementById("map").style.display = "none";
        } catch (error) {
            console.error("⛔ خطأ في الإرسال:", error);
            alert("⛔ فشل في إرسال الطلب!");
        }
    } else {
        alert("⚠️ يرجى ملء جميع الحقول وتحديد الموقع!");
    }
});
