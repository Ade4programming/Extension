document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("extensions-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");


  let extensions = [];

  // fetch the data
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      extensions = data;
      displayExtensions(extensions);
    })
    .catch((err) => {
      console.error("Failed to load data:", err);
    });

  function displayExtensions(data) {
    cardContainer.innerHTML = "";
    if (data.length === 0) {
      cardContainer.innerHTML = "<p> No extensions found.</p>";
      return;
    }
    data.forEach((ext) => {
      const card = document.createElement("section");
      card.classList.add("card");
      card.setAttribute("data-status", ext.isActive ? "active" : "inactive");

      card.innerHTML = `
            <section class="card-hero">
                <img src="${ext.logo}" alt="${ext.name}">
            
                <section class="extension-info">
                    <h3>${ext.name}</h3>
                    <p>${ext.description}</p>
                </section>
            </section>
            
            <section class="extension-actions">
                 <label class="label-switch">
                        <input type="checkbox" ${
                          ext.isActive ? "checked" : ""
                        } class="toggle-input"  name="toggle-swicth${
        ext.id
      }"></input>
                        <span class="toggle-switch"></span>
                </label>
                <button class="remove-btn" type="button">Remove</button>
            </section>
            `;
      cardContainer.appendChild(card);
    });
  }

  

  // Handle toggle switch changes
  cardContainer.addEventListener("change", (e) => {
    // Check if the changed element is a toggle switch
    if (e.target.classList.contains("toggle-input")) {
      // Get the card element that contains this toggle
      const card = e.target.closest(".card");

      // Find which number card this is (0 for first card, 1 for second, etc)
      const cardPosition = Array.from(cardContainer.children).indexOf(card);

      // Update our data to match the toggle state
      extensions[cardPosition].isActive = e.target.checked;

      // Update the card's visible status
      if (e.target.checked) {
        card.setAttribute("data-status", "active");
      } else {
        card.setAttribute("data-status", "inactive");
      }
    }
  });

  // Handle filter button clicks (All, Active, Inactive)
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get the type of filter from the button
      const filterType = button.dataset.filter;

      // Filter and display extensions based on button clicked
      if (filterType === "all") {
        // Show all extensions
        displayExtensions(extensions);
      } else if (filterType === "active") {
        // Show only active extensions
        const activeExtensions = extensions.filter(
          (extension) => extension.isActive
        );
        displayExtensions(activeExtensions);
      } else {
        // Show only inactive extensions
        const inactiveExtensions = extensions.filter(
          (extension) => !extension.isActive
        );
          
        displayExtensions(inactiveExtensions);
      }
    });
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");

    // swap icon
    const isDark = body.classList.contains("dark-theme");
    themeIcon.src = isDark
      ? "./assets/images/icon-sun.svg"
      : "./assets/images/icon-moon.svg";
  });

  
    cardContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        e.target.closest(".card").remove();
      }
    });
  
  
});
