// Responsive website using only Bootstrap 5 and Javascript fetching from API, form validation

let quote = document.getElementById("quote");
let author = document.getElementById("author");

fetch("https://api.quotable.io/random?tags=technology")
    .then(response => response.json())
    .then((data) => {
        quote.innerText = data.content;
        author.innerText = data.author;
    })
    .catch((error) => {
        console.log(error);
        quote.innerText = "Out of quotes :)";
        author.innerText = "JavaScript 2022";
    })

let robotsRow = document.getElementById("robotsRow");
const moreBtn = document.querySelector("#robotsSection button");
let robotsShown = 0;

handleRobots();
moreBtn.addEventListener("click", handleRobots);

function handleRobots(e) {
    if (robotsShown < 2) {
        fetch("https://random-data-api.com/api/v2/users?size=3")
            .then(response => response.json())
            .then(data => {
                data.forEach(el => {
                    let div = document.createElement("div");
                    div.setAttribute("class", "col-md-4");
                    div.innerHTML = `
            <div class="d-flex justify-content-center align-items-center mb-2">
                        <img src="${el.avatar}" alt="robot picture" class="rounded-circle shadow-lg">
                    </div>
                    <div class="text-center">
                        <p class="name">Name: ${el.first_name} ${el.last_name}</p>
                        <p class="email">Email: ${el.email}</p>
                        <p class="phone">Phone: ${el.phone_number}</p>
                    </div>`;
                    robotsRow.appendChild(div);
                });
            })
            .catch(error => {
                console.log(error);
            })

        robotsShown++;
    } else {
        moreBtn.setAttribute("disabled", "disabled")
    }
}
// Navbar links to be red 
let navLinks = document.querySelectorAll(".navbar .container-fluid a");

navLinks.forEach(el => {
    el.addEventListener("click", handleNavButtons);
})

function handleNavButtons(e) {
    // to remove the other active classes when clicked on new button
    navLinks.forEach(el => {
        el.classList.remove("active", "text-danger");

    })
    e.target.classList.add("active", "text-danger");
}

let addedProducts = 0;

document.querySelector("#products form").addEventListener("submit", function (e) {
    e.preventDefault();
    let name = document.getElementById("pname");
    let email = document.getElementById("pemail");
    let quantity = document.getElementById("pquantity");
    let priority = document.getElementById("priority");


    if (addedProducts < 5) {
        if (validateForm(name, email, quantity, priority)) {
            product = {
                name: name.value,
                quantity: quantity.value,
                priority: priority.value
            };
            addProduct(product);
            addedProducts++;
        }

    } else {
        alert("You can add only 5 products.");
        document.querySelector("#products form button").setAttribute("disabled", "disabled");
    }


})

function addProduct(product) {
    let div = document.createElement("div");
    let totalItems = document.getElementById("total_items");
    let priorityColor = null;

    if (product.priority == 'low') {
        priorityColor = "info";
    } else if (product.priority == "medium") {
        priorityColor = "warning";
    } else {
        priorityColor = "danger";
    }

    div.classList.add(`bg-${priorityColor}`, "mb-1", "p-2");

    div.style.borderRadius = "8px";
    div.innerHTML = `<p class="d-flex justify-content-between mb-0 px-3">${product.name}<span class="badge bg-primary">${product.quantity}</span></p>`;
    totalItems.appendChild(div);

    let totalNum = document.getElementById("total_num");
    total = parseInt(totalNum.innerText) + parseInt(product.quantity);
    totalNum.innerText = total;
}

function createErrorMsg(msg) {
    let error = document.createElement("p");
    error.classList.add("text-danger");
    error.innerText = msg;
    return error;
}
function attachError(element, cb, msg) {
    element.parentNode.insertBefore(cb(msg), element.nextSibling);
}

function removeError(element) {
    if (element.nextElementSibling) {
        element.nextElementSibling.remove();
    }
}

function validateForm(name, email, quantity, priority) {
    let success = true;

    if (name.value.length < 5) {
        success = false;
        // to not show the same error twice if it fails two times
        if (!name.nextElementSibling) {
            // name.parentNode.insertBefore(createErrorMsg("Name value must be greater than 5 characters."), name.nextSibling);
            attachError(name, createErrorMsg, "Name value must be greater than 5 characters.")
        }
    } else {
        removeError(name);
    }

    if (email.value.indexOf("@") == -1) {
        success = false;
        if (!email.nextElementSibling) {
            attachError(email, createErrorMsg, "Please enter a valid email address.");
        }
    } else {
        removeError(email);

        let domain = email.value.split("@");
        domain = domain[1];

        if (domain != "gmail.com" && domain != "yahoo.com" && domain != "hotmail.com") {
            success = false;
            attachError(email, createErrorMsg, "Please use gmail, yahoo or hotmail account.");
        } else {
            removeError(email);
        }
    }

    if (quantity.value == "") {
        success = false;
        if (!quantity.nextElementSibling) {
            attachError(quantity, createErrorMsg, "Please choose amount.")
        }
    } else {
        // check if quantity is not numeric
        if (/\D/.test(quantity.value)) {
            success = false;
            attachError(quantity, createErrorMsg, "Please don't play tricks on me.");
        } else {
            removeError(quantity);
        }
    }

    let priorityValue = priority.value.toLowerCase();
    if (priorityValue != "low" && priorityValue != "medium" && priorityValue != "high") {
        success = false;
        if (!priority.nextElementSibling) {
            attachError(priority, createErrorMsg, "Please choose priority");
        }
    } else {
        removeError(priority);
    }
    return success;
}


