"use strict"

window.onload = () => {
    const myDropdown = document.querySelector("#cityDropdown");
    const myTableBody = document.querySelector("#cityTableBody");

    populateDropdown(myDropdown);
    myDropdown.addEventListener("change", (event) => displayWeatherData(event.target, myTableBody));
}

function populateDropdown(dropdown) {
    cities.forEach((city) => {
        let newOption = document.createElement("option");
        newOption.textContent = city.name;
        // I'm unsure if I need this line is required, since I will never use the value property
        newOption.value = "";

        dropdown.appendChild(newOption);
    });
}

async function displayWeatherData(dropdown, tbody) {
    try {
        tbody.innerHTML = "";
        let selectedCity = cities[(dropdown.selectedIndex - 1)];
        let response = await fetch(`https://api.weather.gov/points/${selectedCity.latitude},${selectedCity.longitude}`, {});
        if (!response.ok) {
            outputField.innerHTML = "Error";
            throw new Error("Api machine broke");
        }
        let data = await response.json();
        let forecastUrl = data.properties.forecast;
        displayWeatherDataV2(dropdown, tbody, forecastUrl);
    } catch (error) {
        console.log(error);
    }
}

async function displayWeatherDataV2(dropdown, tbody, url) {
    let response = await fetch(url, {});
    let data = await response.json();
    let weatherArray = data.properties.periods;
    console.log(data.properties.periods);
    weatherArray.forEach((period) => {
        console.log(tbody);
        let newRow = tbody.insertRow();
        createTableCell(newRow, period, "number");
        createTableCell(newRow, period, "name");
        createTableCell(newRow, period, "temperature");
        createTableCell(newRow, period, "temperatureUnit");
        createTableCell(newRow, period, "windSpeed");
        createTableCell(newRow, period, "windDirection");
        createTableCell(newRow, period, "shortForecast");
        tbody.appendChild(newRow);
    });
}

function createTableCell(tableRow, data, key) {
    let newCell = tableRow.insertCell();
    newCell.innerHTML = data[`${key}`];
}