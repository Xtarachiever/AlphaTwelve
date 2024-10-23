// Fetching the sidebar links from the JSON file
document.addEventListener("DOMContentLoaded", function () {
  const layoutDiv = document.querySelector('.layout');
  const layoutMainDiv = document.querySelector(".layout .main_body");
  const mediaQuery = window.matchMedia("(max-width: 700px)");
  const sidebarContainer = document.querySelector("#sidebar");
  fetch("./components/sidebar_links.json")
    .then((response) => response.json())
    .then((data) => {
      const nav_container = document.createElement("div");
      nav_container.innerHTML = "";
      nav_container.className = "nav_container";

      const profileContainer = document.querySelector(".profile");
      function renderSideBar() {
        nav_container.innerHTML = "";
        data.forEach((item) => {
          const nav_links = document.createElement("div");
          nav_links.className = "nav_links";

          // Create img tag
          const img = document.createElement("img");
          img.src = item.icon;
          img.className = `svg-icon svg_${item.name.toLowerCase()}`;

          // Create text node with item name
          nav_links.appendChild(img);
          //  nav_links.appendChild(document.createTextNode(item.name));
          const profileDiv = profileContainer.querySelector("div"); // Ensure this selects the correct div

          // Check if the div exists
          if (profileDiv) {
            const computedStyle = window.getComputedStyle(profileDiv);

            // Check if the sidebar is NOT collapsed
            if (!sidebarContainer.classList.contains("bar_collapse")) {
              // If the div is hidden (display: 'none'), show it as a block element
              if (
                computedStyle.display === "none" ||
                computedStyle.display === ""
              ) {
                profileDiv.style.display = "block"; // Show the div
              }

              // Append the item name to the nav_links
              nav_links.appendChild(document.createTextNode(item.name));
            } else {
              // Handle sidebar collapsed state (if necessary)
              profileDiv.style.display = "none"; // Hide the div if the sidebar is collapsed
            }
          } else {
            console.error("Div not found inside profileContainer.");
          }

          // Append to the nav_container
          nav_container.appendChild(nav_links);
        
        });

        const sidebarLinks = document.querySelectorAll(".sidebar_links");

        if (sidebarLinks.length > 0) {
          sidebarLinks.forEach((sidebar) => {
            sidebar.innerHTML = "";
            // Clone nav_container for each sidebar
            const clonedNavContainer = nav_container.cloneNode(true); // Deep clone
            sidebar.appendChild(clonedNavContainer);
          });
        }

        applyNavLinkEventListener();
        renderChart();
      }


      function applyNavLinkEventListener() {
        const sideBarNavLinks = document.querySelectorAll(
          ".nav_container .nav_links"
        );
        sideBarNavLinks.forEach((link) => {
          link.addEventListener("click", () => {
            if(link.querySelector("img").classList.contains("svg_dark")){
              if(layoutDiv.classList.contains('dark')){
                layoutDiv.classList.remove('dark')
              }else{
                layoutDiv.classList.add('dark');
              }
            }
            if (!mediaQuery.matches) {
              if (
                link.querySelector("img").classList.contains("svg_collapse")
              ) {
                if (sidebarContainer.classList.contains("bar_collapse")) {
                  sidebarContainer.classList.remove("bar_collapse");
                  layoutMainDiv.style.marginLeft = "250px";
                  computedLayoutMargin += "250px";
                } else {
                  sidebarContainer.classList.add("bar_collapse");
                  layoutMainDiv.style.marginLeft = "100px";
                  computedLayoutMargin = "100px";
                }
              }
            }
            renderSideBar();
          });
        });
      }

      applyNavLinkEventListener();
      renderSideBar();
    });

    function renderChart(){
      var xValues = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var yValues = [700, 950, 780, 400, 1000, 560, 900, 380, 850, 700, 1000, 600];
    
      new Chart("myChart", {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [
            {
              backgroundColor:  "#8576FF",
              color: layoutDiv.classList.contains('dark') ? "white" :"#000000",
              data: yValues,
            },
          ],
        },
        options: {
          legend: { display: false },
          title: {
            display: false,
          },
          scales: {
            y: {
              ticks: {
                color: layoutDiv.classList.contains('dark') ? "#ffffff" : "#000000", // Axis label color for Y
              },
              grid: {
                color: layoutDiv.classList.contains('dark') ? "#333333" : "#cccccc" // Grid color for Y axis
              }
            },
            x: {
              ticks: {
                color: layoutDiv.classList.contains('dark') ? "#ffffff" : "#000000", // Axis label color for X
              },
              grid: {
                color: layoutDiv.classList.contains('dark') ? "#333333" : "#cccccc" // Grid color for X axis
              }
            }
          }
        },
      });
    }

    renderChart();

  // All details about pagination and table
  // Fetching JSON MockUp data
  fetch("https://api.json-generator.com/templates/3rlNyhnuTG96/data", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${window.env.API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("table");
      const desktopTableDiv = document.createElement("table");
      const mobileTableDiv = document.createElement("table");
      mobileTableDiv.classList.add('table_mobile_view');
      desktopTableDiv.classList.add('table_desktop_view');
      let itemsPerPage = 10;
      let currentPage = 1;

      //   Search function
      const selectContainer = document.querySelector(".input_field input");
      let filterBySearch = [...data];
      selectContainer.addEventListener("input", (e) => {
        const inputtedSearch = e.target.value.toLowerCase();
        filterBySearch = data.filter((eachData) => {
          // Ensure both are compared in lowercase
          return (
            eachData?.name?.toLowerCase().includes(inputtedSearch) ||
            eachData?.event?.toLowerCase().includes(inputtedSearch)
          );
        });
        renderTable();
        renderPagination();
      });

      function renderTable() {
        const visibleData = filterBySearch?.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

        // desktopTableDiv Content
        desktopTableDiv.innerHTML = `
        <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Speaker</th>
            <th>Status</th>
        </tr>`;

        // Mobile Table Details
        mobileTableDiv.innerHTML = `
        <tr>
            <th>Event Name</th>
            <th>Status</th>
        </tr>`;
        

        // Append rows for each user info
        visibleData.forEach((userInfo,index) => {
          const formattedDate = userInfo?.date.split("T")[0]; // Ensure date exists
          const row = document.createElement("tr");
          row.innerHTML = `
                <td class="event">${userInfo?.event}</td>
                <td>${formattedDate}</td>
                <td>${userInfo?.name}</td>
                <td class="status">${userInfo?.status}</td>
                `;

          // Create the event-div to be appended
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event-div");
          eventDiv.style.display = "none";
          eventDiv.innerHTML = `
            <div class="upper_modal">
                <div>
                <h4>${userInfo?.event}</h4>
                <p>${formattedDate}</p>
                </div>
                <p>Event Description</p>
                <div>
                <img src="./images/avatar_group.svg" alt="avatar"/>
                <p>Speakers: Speaker A, Speaker B, Speaker C.</p>
                <span>300 attendees</span>
                </div>
            </div>
            <div class="bottom_modal">
                <button class="edit_button">Edit</button>
                <div>
                <button class="delete_button">Delete</button>
                <button class="completed_button">Mark as completed</button>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width: 20px; cursor:pointer;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>`;

          // Append eventDiv to the row
          row.appendChild(eventDiv);

          row.addEventListener("click", () => {
            if (
              eventDiv.style.display === "none" ||
              eventDiv.style.display === ""
            ) {
              eventDiv.style.display = "block"; // Show the event details
            } else {
              eventDiv.style.display = "none"; // Hide the event details
            }
          });

          desktopTableDiv.appendChild(row); // Append row to the table

          // Mobile Table Details
          const mobileTableRow = document.createElement("tr");

          // <td>${formattedDate}</td>
          // <td>${userInfo?.name}</td>
          // Add the HTML structure for the SVGs inside the row
        mobileTableRow.innerHTML = `
          <td class="drop_down"> 
            <svg class="svg-default" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:10px; margin-right:10px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <svg class="svg-toggled" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:10px; margin-right:10px; display:none;">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>            
            ${userInfo?.event}
          </td>
          <td class="status">${userInfo?.status}</td>
        `;

        const dropDownRow = document.createElement('tr');
        const dropDownTd = document.createElement('td');
        dropDownTd.colSpan = 2;

        const dropDownContent = (index % 2 === 0)
          ? `<p style="border:1px dotted #3B82F6; text-align:center; padding:5px; color:#3B82F6">Replace</p>`
          : `<div style="display:flex; justify-content:space-between; padding:2px 8px;"><span>${userInfo?.name}</span> <span>${formattedDate}</span></div>`;

        dropDownTd.innerHTML = `
          <div class="drop_down_content">
            ${dropDownContent}
          </div>
        `;
    
        dropDownRow.style.display = 'none'; // Initially hide the dropdown row
        dropDownRow.appendChild(dropDownTd);
    
        mobileTableDiv.appendChild(mobileTableRow);
        mobileTableDiv.appendChild(dropDownRow);


        // Now, add event listener for dropdown toggle
        const detailsDropdowns = document.querySelectorAll('tr:has(.drop_down_content)');

        detailsDropdowns.forEach(details => {
          details.style.display = 'none';
        });

        mobileTableRow.addEventListener('click', () => {
          const defaultSvg = mobileTableRow.querySelector('.svg-default');
          const toggledSvg = mobileTableRow.querySelector('.svg-toggled');
    
          if (dropDownRow.style.display === 'none') {
            dropDownRow.style.display = 'table-row'; // Show details
            defaultSvg.style.display = 'none';
            toggledSvg.style.display = 'inline';
          } else {
            dropDownRow.style.display = 'none'; // Hide details
            defaultSvg.style.display = 'inline';
            toggledSvg.style.display = 'none';
          }
        });

          //Styling status button
          const statusDiv = document.querySelectorAll(".status");
          statusDiv.forEach((eachStatus) => {
            if (eachStatus?.innerText === "Completed") {
              eachStatus.style.backgroundColor = "#D1FAE5";
              eachStatus.style.color = "#10B981";
            } else {
              eachStatus.style.backgroundColor = "#DBEAFE";
              eachStatus.style.color = "#3B82F6";
            }
          });
        });
        sortData(filterBySearch);
      }

      // Function to render pagination
      const paginationContainer = document.createElement("div");
      paginationContainer.className = "pagination_container";
      const paginationList = document.createElement("ul");
      //   console.log(selectContainer.innerHTML);

      function renderPagination() {
        let totalPages = Math.ceil(filterBySearch?.length / itemsPerPage);
        paginationContainer.innerHTML = "";
        paginationList.innerHTML = "";
        const prevDiv = document.createElement("span");
        const nextDiv = document.createElement("span");
        prevDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6" style="width:10px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>`;
        nextDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6" style="width:10px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        `;

        // Navigating to the previous divs
        prevDiv.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            renderTable();
            highlightCurrentPage();
          }
        });

        paginationList.appendChild(prevDiv);
        for (let i = 1; i <= totalPages; i++) {
          const listItem = document.createElement("li");
          listItem.textContent = i;

          // Add a click event to each pagination item
          listItem.addEventListener("click", () => {
            currentPage = i; // Update current page
            renderTable();
            highlightCurrentPage();
          });

          paginationList.appendChild(listItem);
        }

        // Navigating to the next divs
        nextDiv.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            highlightCurrentPage();
          }
        });

        paginationList.appendChild(nextDiv);

        // Filtering by select
        const selectByRows = document.createElement("div");
        selectByRows.className = "filterByRows";
        selectByRows.innerHTML = `<p>Show:</p>
        <select>
          <option value="10" ${
            itemsPerPage === 10 ? "selected" : ""
          }>10 rows</option>
          <option value="20" ${
            itemsPerPage === 20 ? "selected" : ""
          }>20 rows</option>
          <option value="30" ${
            itemsPerPage === 30 ? "selected" : ""
          }>30 rows</option>
          <option value="40" ${
            itemsPerPage === 40 ? "selected" : ""
          }>40 rows</option>
          <option value="50" ${
            itemsPerPage === 50 ? "selected" : ""
          }>50 rows</option>
        </select>`;

        const selectElement = selectByRows.querySelector("select");
        selectElement.addEventListener("change", (e) => {
          itemsPerPage = parseInt(e.target.value);
          currentPage = 1;
          totalPages = Math.ceil(data.length / itemsPerPage);
          renderTable();
          renderPagination();
          highlightCurrentPage();
        });

        paginationContainer.appendChild(paginationList);
        paginationContainer.appendChild(selectByRows);
      }

      function highlightCurrentPage() {
        const paginationItems = document.querySelectorAll("ul li");
        paginationItems.forEach((item, index) => {
          item.className = index + 1 === currentPage ? "active" : "inactive"; // Highlight current page
        });
      }

      // Append the table to the container
      container.appendChild(desktopTableDiv);
      container.appendChild(mobileTableDiv);
      container.appendChild(paginationContainer);

      //   Sorting Functionality
      function sortData(filterBySearch) {
        // Filter function
        const tableHeaders = document.querySelectorAll("th");
        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down-alt" viewBox="0 0 16 16">
            <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"/>
            </svg>`;
        tableHeaders.forEach((tableHeader) => {
          tableHeader.addEventListener("mouseenter", () => {
            if (!tableHeader.querySelector("svg")) {
              tableHeader.innerHTML += svgIcon; // Directly appending the SVG
            }
          });
          tableHeader.addEventListener("mouseleave", () => {
            // Remove the SVG when the mouse leaves
            const svg = tableHeader.querySelector("svg");
            if (svg) {
              svg.remove();
            }
          });

          tableHeader.addEventListener("click", () => {
            const column = tableHeader.getAttribute("data-column");
            let order = tableHeader.getAttribute("data-order");

            // Toggle sort order
            order = order === "asc" ? "desc" : "asc";
            tableHeader.setAttribute("data-order", order);

            // Sort filterBySearch based on the clicked column and order
            filterBySearch.sort((a, b) => {
              const aValue = a[column]?.toString().toLowerCase();
              const bValue = b[column]?.toString().toLowerCase();

              if (order === "asc") {
                return aValue > bValue ? 1 : -1;
              } else {
                return aValue < bValue ? 1 : -1;
              }
            });

            // Re-render the table with sorted data
            renderTable();
          });
        });
      }
      sortData();

      renderTable();
      renderPagination();
      highlightCurrentPage();
    });

  const hamburger = document.querySelector(".hamburgers");
  const close_hamburger = document.querySelector(".hamburgers svg");
  const bar_hamburger = document.querySelector(".hamburgers img");
  const mobileNavDiv = document.querySelector(".mobile_navbar");
  const body = document.querySelector("body");

  function toggleNavBar() {
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        // Toggle the display property of the mobile navbar
        if (mediaQuery.matches) {
          // console.log(mobileNavDiv.style.display)
          if (mobileNavDiv.style.display === "block") {
            mobileNavDiv.style.display = "none";
            close_hamburger.style.display = "none";
            bar_hamburger.style.display = "block";
            body.style.overflow = "";
          } else {
            mobileNavDiv.style.display = "block";
            close_hamburger.style.display = "block";
            body.style.overflow = "hidden";
            bar_hamburger.style.display = "none";
          }
        }
      });
    }
  }

  function handleResize() {
    if (mediaQuery.matches) {
      // Mobile screen adjustments
      layoutMainDiv.style.marginLeft = "20px";
    } else {
      // Desktop screen adjustments
      layoutMainDiv.style.marginLeft = sidebarContainer.classList.contains(
        "bar_collapse"
      )
        ? "100px"
        : "250px";
    }
    if (!mediaQuery.matches) {
      if (mobileNavDiv) {
        // If the screen is larger than 700px, reset the mobile navbar display
        mobileNavDiv.style.display = "none";
        close_hamburger.style.display = "none";
        bar_hamburger.style.display = "block";
        body.style.overflow = ""; // Reset the body's overflow
      }
    }
  }

  // Listen for changes in screen size
  mediaQuery.addEventListener("change", handleResize);

  // Initial check on page load
  handleResize();
  toggleNavBar();

});
