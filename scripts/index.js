"use strict"

window.onload = () => {
    const myDropdown = document.querySelector("#cityDropdown");
    const myTable = document.querySelector("#theTable");
    const myTableBody = document.querySelector("#weatherTableBody");

    myTable.style.display = "none";
    populateDropdown(myDropdown);
    myDropdown.addEventListener("change", (event) => populateWeatherTable(event.target, myTable, myTableBody));
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

async function populateWeatherTable(dropdown, table, tbody) {
    try {
        if (dropdown.selectedIndex === 0) {
            table.style.display = "none";
        } else {
            tbody.innerHTML = "";
            let selectedCity = cities[(dropdown.selectedIndex - 1)];
            let response = await fetch(`https://api.weather.gov/points/${selectedCity.latitude},${selectedCity.longitude}`, {});
            if (!response.ok) {
                outputField.innerHTML = "Error";
                throw new Error("Api machine broke");
            }
            let data = await response.json();
            let forecastUrl = data.properties.forecast;
            createWeatherTableRows(dropdown, tbody, forecastUrl);
            table.style.display = "block";
        }
    } catch (error) {
        console.log(error);
    }
}

async function createWeatherTableRows(dropdown, tbody, url) {
    try {
        let response = await fetch(url, {});
        let data = await response.json();
        let weatherArray = data.properties.periods;
        weatherArray.forEach((period) => {
            let newRow = tbody.insertRow();
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
    let newCell = tableRow.insertCell();
    newCell.innerHTML = data[`${key}`];
}