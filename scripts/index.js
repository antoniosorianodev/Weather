"use strict"

window.onload = () => {
    const myDropdown = document.querySelector("#cityDropdown");
    const myTable = document.querySelector("#theTable");
    const myTableBody = document.querySelector("#weatherTableBody");

    findUserLocation(myDropdown);

    myTable.style.display = "none";
    myDropdown.addEventListener("change", (event) => populateWeatherTable(event.target, myTable, myTableBody));
}

function populateDropdown(dropdown, array) {
    array.forEach((city) => {
        const newOption = document.createElement("option");
        newOption.textContent = city.name;

        dropdown.appendChild(newOption);
    });
}

async function populateWeatherTable(dropdown, table, tbody) {
    try {
        if (dropdown.selectedIndex === 0) {
            table.style.display = "none";
        } else {
            tbody.innerHTML = "";
            const selectedCity = cities[(dropdown.selectedIndex - 1)];
            const response = await fetch(`https://api.weather.gov/points/${selectedCity.latitude},${selectedCity.longitude}`, {});
            if (!response.ok) {
                outputField.innerHTML = "Error";
                throw new Error("Api machine broke");
            }
            const data = await response.json();
            const forecastUrl = data.properties.forecast;
            createWeatherTableRows(dropdown, tbody, forecastUrl);
            table.style.display = "block";
        }
    } catch (error) {
        console.log(error);
    }
}

async function createWeatherTableRows(dropdown, tbody, url) {
    try {
        const response = await fetch(url, {});
        const data = await response.json();
        const weatherArray = data.properties.periods;
        weatherArray.forEach((period) => {
            const newRow = tbody.insertRow();
            createWeatherTableCell(newRow, period, "number");
            createWeatherTableCell(newRow, period, "name");
            createWeatherTableCell(newRow, period, "temperature");
            createWeatherTableCell(newRow, period, "temperatureUnit");
            createWeatherTableCell(newRow, period, "windSpeed");
            createWeatherTableCell(newRow, period, "windDirection");
            createWeatherTableCell(newRow, period, "shortForecast");
            tbody.appendChild(newRow);
        });
    } catch (error) {
        console.log(error);
    }
}

function createWeatherTableCell(tableRow, data, key) {
    const newCell = tableRow.insertCell();
    newCell.innerHTML = data[`${key}`];
}

function findUserLocation(dropdown) {
    const currentPosition = navigator.geolocation;

    // the async that uses currentPosition is the success condition
    currentPosition.getCurrentPosition(async (currentPosition) => {
        const crd = currentPosition.coords;

        // removed .toFixed(4) since my data gets trimmed at the endpoint anyway and this preserves precision
        const currentLat = crd.latitude
        const currentLng = crd.longitude

        const response = await fetch(`https://api.weather.gov/points/${currentLat},${currentLng}`, {});
        const data = await response.json();

        const longPathToData = data.properties.relativeLocation.properties;

        const newCity = {
            name: `Current Location (${longPathToData.city}, ${longPathToData.state})`,
            latitude: currentLat,
            longitude: currentLng
        }

        cities.unshift(newCity);
        populateDropdown(dropdown, cities);
        // this async is the error handling, optional but I want it for when the user says no to sharing their location
    }, (error) => {
        populateDropdown(dropdown, cities);
    });
}