const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const searchInput = document.querySelector(".search");
const searchButton = document.getElementById("searchButton");
const countriesContainer = document.querySelector(".countries");
const sortButton = document.getElementById("btn3");
const sortIcon = document.getElementById("sortIcon");

// Initially, disable the search input and countries container
searchInput.disabled = true;
searchButton.disabled = true;
// countriesContainer.style.display = "none";

let currentSearchType = ""; // Variable to store the current search type (btn1 or btn2)
let currentSortingOrder = "asc"; // Variable to store the current sorting order (asc or desc)

// Function to fetch the list of countries and update the total number of countries
function fetchCountriesAndUpdateTotal() {
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
            const totalCountries = data.length;
            document.getElementById("cno").textContent = totalCountries;

            // Filter and display countries starting with 'A'
            const countriesStartingWithA = data.filter((country) =>
                country.name.common.toLowerCase().startsWith('a')
            );

            displayCountries(countriesStartingWithA);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Call the fetchCountriesAndUpdateTotal function when the page loads
window.addEventListener("load", fetchCountriesAndUpdateTotal);

function activateButton(button) {
    btn1.classList.remove("active-button");
    btn2.classList.remove("active-button");
    searchInput.disabled = false;
    searchButton.disabled = false;
    button.classList.add("active-button");

    // Set the current search type based on the button clicked
    if (button === btn1) {
        currentSearchType = "start";
    } else if (button === btn2) {
        currentSearchType = "contains";
    }
}

btn1.addEventListener("click", function () {
    activateButton(btn1);
});

btn2.addEventListener("click", function () {
    activateButton(btn2);
});

searchButton.addEventListener("click", function () {
    const userInput = searchInput.value.trim().toLowerCase();

    // Check if the search input is empty
    if (userInput === "") {
        // Clear the countries container
        countriesContainer.innerHTML = "";
        return; // Exit the function to prevent further processing
    }

    // Check the current search type and perform the corresponding search
    if (currentSearchType === "start") {
        searchStartingWith(userInput);
    } else if (currentSearchType === "contains") {
        searchContaining(userInput);
    }
});

sortButton.addEventListener("click", function () {
    // Toggle the sorting order between "asc" and "desc"
    currentSortingOrder = currentSortingOrder === "asc" ? "desc" : "asc";

    // Update the sort icon based on the current sorting order
    if (currentSortingOrder === "asc") {
        sortIcon.className = "fas fa-sort-alpha-up";
    } else {
        sortIcon.className = "fas fa-sort-alpha-down";
    }

    // Re-sort the displayed countries based on the current sorting order
    sortCountries();
});

// Function to search for countries starting with the user input
function searchStartingWith(userInput) {
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
            const countries = data.filter((country) =>
                country.name.common.toLowerCase().startsWith(userInput)
            );

            displayCountries(countries);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Function to search for countries containing the user input
function searchContaining(userInput) {
    fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) => {
            const countries = data.filter((country) =>
                country.name.common.toLowerCase().includes(userInput)
            );

            displayCountries(countries);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

// Function to display countries in the countries container or show a message if no countries found
function displayCountries(countries) {
    countriesContainer.innerHTML = "";

    if (countries.length === 0) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("country");
        messageElement.style.width="1200px";
        messageElement.style.height="100px";
        messageElement.style.paddingLeft="20px";
        messageElement.style.alignSelf="center";
        messageElement.style.fontSize="x-large";
       
        messageElement.textContent = "No countries found for the given input.";

        countriesContainer.appendChild(messageElement);
    } else {
        countries.forEach((country) => {
            const countryElement = document.createElement("div");
            countryElement.classList.add("country");
            countryElement.textContent = country.name.common;
            countriesContainer.appendChild(countryElement);
        });
    }

    // Show the countries container
    // countriesContainer.style.display = "flex";
}

// Function to sort the displayed countries based on the current sorting order
function sortCountries() {
    const countryElements = Array.from(
        countriesContainer.getElementsByClassName("country")
    );
    const sortedCountries = countryElements
        .map((element) => element.textContent)
        .sort();

    if (currentSortingOrder === "desc") {
        sortedCountries.reverse();
    }

    // Clear the current display and re-add sorted countries
    countriesContainer.innerHTML = "";
    sortedCountries.forEach((country) => {
        const countryElement = document.createElement("div");
        countryElement.classList.add("country");
        countryElement.textContent = country;
        countriesContainer.appendChild(countryElement);
    });
}
