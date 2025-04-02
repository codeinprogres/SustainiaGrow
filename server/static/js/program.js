document.addEventListener("DOMContentLoaded", () => {

    const loadMap = (lat, lng) => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
            const map = new google.maps.Map(mapElement, {
                center: { lat, lng },
                zoom: 10,
            });
            new google.maps.Marker({
                position: { lat, lng },
                map,
            });
        } else {
            alert("Map container not found.");
        }
    };
    let apiKey
    fetch('/get-OM-api-key')
        .then(response => response.json())
        .then(data => {
            apiKey = data.OPENAI_OM_KEY;
            console.log("API Key:", apiKey);
        })
        .catch(error => console.error("Error fetching API Key:", error));

    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

    const fetchWeatherData = (lat, lon) => {
        const url = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not available. Please check the API key or endpoint.');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherInfo(data);
                storeWeatherInfo(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Could not retrieve weather data. Please try again later.');
                document.getElementById('temperature').innerText = 'Data unavailable';
                document.getElementById('humidity').innerText = 'Data unavailable';
                document.getElementById('precipitation').innerText = 'Data unavailable';
            });
    };

    const displayWeatherInfo = (data) => {
        if (data && data.main && data.weather && data.weather.length > 0) {
            document.getElementById('temperature').innerText = `${data.main.temp}°C`;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('precipitation').innerText = `${data.weather[0].description}`;
        } else {
            document.getElementById('temperature').innerText = 'Data unavailable';
            document.getElementById('humidity').innerText = 'Data unavailable';
            document.getElementById('precipitation').innerText = 'Data unavailable';
        }
    };

    const storeWeatherInfo = (data) => {

        window.weatherInfo = {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            precipitation: data.weather[0].description,
        };

        console.log('Stored Weather Info:', window.weatherInfo);
    };

    const geocodeAddress = (address) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK") {
                const location = results[0].geometry.location;
                loadMap(location.lat(), location.lng());
                fetchWeatherData(location.lat(), location.lng());
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    document.getElementById("find-location").addEventListener("click", () => {
        const address = document.getElementById("address-input").value;
        if (address) geocodeAddress(address);
        else alert("Please enter an address.");
    });

    document.getElementById("section-title").addEventListener("click", () => {
        const selectedCrops = Array.from(document.querySelectorAll("#crop-options input:checked")).map(
            (checkbox) => checkbox.value
        );

        if (selectedCrops.length === 0) {
            alert("Please select at least one crop.");
            return;
        }

    });

});