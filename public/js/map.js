// safety check
window.onload = function () {

    // Debug check
    console.log("listingData:", listingData);

    // Safety check
    if (typeof listingData !== "undefined" && listingData.geometry) {

        const coords = listingData.geometry.coordinates;

        const lat = coords[1];  // latitude
        const lng = coords[0];  // longitude

        // Map create
        const map = L.map('map').setView([lat, lng], 10);

        // Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        // Marker
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Exact Location")
            .openPopup();

    } else {
        console.log("❌ listingData missing or geometry not found");
    }

};