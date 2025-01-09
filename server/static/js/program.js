document.addEventListener("DOMContentLoaded", () => {
    // Load Map
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

    // Fetch Weather Data
    const apiKey = '2e97d647ec6dfcfac37a380185120286';  // Your OpenWeatherMap API key
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

    // Geocode Address
    const geocodeAddress = (address) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK") {
                const location = results[0].geometry.location;
                loadMap(location.lat(), location.lng());
                fetchWeatherData(location.lat(), location.lng());  // Fetch weather data after map load
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    // Event Listener for Location
    document.getElementById("find-location").addEventListener("click", () => {
        const address = document.getElementById("address-input").value;
        if (address) geocodeAddress(address);
        else alert("Please enter an address.");
    });

    // Generate 30-Day Plan
    document.getElementById("generate-plan").addEventListener("click", () => {
        const selectedCrops = Array.from(document.querySelectorAll("#crop-options input:checked")).map(
            (checkbox) => checkbox.value
        );

        if (selectedCrops.length === 0) {
            alert("Please select at least one crop.");
            return;
        }

        const calendarContainer = document.getElementById("calendar-container");
        const calendar = document.getElementById("calendar");
        calendar.innerHTML = ""; // Clear previous plan

        selectedCrops.forEach((crop) => {
            const cropPlan = document.createElement("div");
            cropPlan.classList.add("crop-plan");
            cropPlan.innerHTML = ` 
                <h4>${crop}</h4>
                <p><strong>Watering Schedule:</strong> Water every 2 days.</p>
                <p><strong>Harvest Time:</strong> Harvest in 30 days.</p>
                <p><strong>Ideal Temperature:</strong> 65-75°F.</p>
                <p><strong>Additional Tips:</strong> Ensure good soil drainage.</p>
            `;
            calendar.appendChild(cropPlan);
        });

        calendarContainer.classList.remove("hidden");
    });

    // FullCalendar Initialization for Interactive Calendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        events: [], // Populate events dynamically if needed
        selectable: true, // Allow selecting days
        select: function(startDate, endDate) {
            const date = startDate.format('YYYY-MM-DD');
            displayTask(date); // Display tasks for selected date
        },
        dayClick: function(date) {
            const selectedDate = date.format('YYYY-MM-DD');
            displayTask(selectedDate); // Trigger task display for clicked date
        }
    });

    // Function to display tasks based on clicked date
    function displayTask(date) {
        document.getElementById('task-message').innerText = `Tasks for ${date}: Plant your crops!`;  // Modify this based on your task logic
    }
});
