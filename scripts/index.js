"use strict"

window.onload = () => {
    const myDropdown = document.querySelector("#cityDropdown");

    populateDropdown(myDropdown);
}

function populateDropdown(dropdown) {
    cities.forEach((city) => {
        let newOption = document.createElement("option");
        newOption.textContent = city.name;
        newOption.value = ""

        dropdown.appendChild(newOption);
    });
}