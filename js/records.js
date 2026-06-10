let allRecords = [];
let currentFilteredRecords = [];
let currentPage = 1;
const DISPLAY_PAGE_SIZE = 20;
const PAGE_SIZE = 1000;

const searchInput = document.getElementById("searchInput");
const projectFilter = document.getElementById("projectFilter");
const yearFilter = document.getElementById("yearFilter");

// Check Login First
(async () => {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location = "login.html";
        return;
    }

    await loadRecords();

})();


// Load Records

async function loadRecords() {

    const { data, error } = await loadAllRecords();

    if (error) {
        console.error(error);
        renderRecords([]);
        return;
    }

    allRecords = data || [];
    populateFilters(allRecords);
    applyFilters();
}


async function loadAllRecords() {

    const records = [];
    let from = 0;

    while (true) {

        const { data, error } =
            await supabaseClient
                .from("beneficiaries")
                .select("*")
                .order("name")
                .order("id")
                .range(from, from + PAGE_SIZE - 1);

        if (error) {
            return { error };
        }

        const batch = data || [];
        records.push(...batch);

        if (batch.length < PAGE_SIZE) {
            break;
        }

        from += PAGE_SIZE;
    }

    return { data: records };
}


// Filters

function populateFilters(records) {

    populateSelect(
        projectFilter,
        getUniqueValues(records, record => record.project),
        "All Projects"
    );

    populateSelect(
        yearFilter,
        getUniqueValues(records, record => record.year),
        "All Years"
    );
}


function populateSelect(select, values, defaultLabel) {

    if (!select) {
        return;
    }

    const currentValue = select.value;
    select.replaceChildren(new Option(defaultLabel, ""));

    values.forEach(value => {
        select.add(new Option(value, value));
    });

    if (values.includes(currentValue)) {
        select.value = currentValue;
    }
}


function getUniqueValues(records, getValue) {

    return [
        ...new Set(
            records
                .map(record => String(getValue(record) || "").trim())
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}


function applyFilters() {

    const keyword = normalize(searchInput ? searchInput.value : "");
    const project = projectFilter ? projectFilter.value : "";
    const year = yearFilter ? yearFilter.value : "";

    const filteredRecords = allRecords.filter(record => {

        const matchesKeyword =
            keyword === "" ||
            [
                record.name,
                record.address,
                record.project,
                record.extension_worker
            ].some(value => normalize(value).includes(keyword));

        const matchesProject =
            project === "" ||
            String(record.project || "").trim() === project;

        const matchesYear =
            year === "" ||
            String(record.year || "").trim() === year;

        return matchesKeyword && matchesProject && matchesYear;
    });

    currentFilteredRecords = filteredRecords;
    currentPage = 1;
    renderRecords(currentFilteredRecords);
}


function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase();
}


// Render Records

function renderRecords(records) {

    const container =
        document.getElementById(
            "recordsContainer"
        );
    const totalPages = Math.max(1, Math.ceil(records.length / DISPLAY_PAGE_SIZE));
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (currentPage - 1) * DISPLAY_PAGE_SIZE;
    const visibleRecords = records.slice(startIndex, startIndex + DISPLAY_PAGE_SIZE);

    container.replaceChildren();

    const counter =
        document.getElementById(
            "recordCount"
        );

    if (counter) {
        counter.textContent =
            records.length.toLocaleString();
    }

    if (records.length === 0) {

        const emptyState = document.createElement("div");
        emptyState.className = "record-empty";
        emptyState.textContent = "No Records Found";
        container.append(emptyState);

        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "records-table-wrap";

    const table = document.createElement("table");
    table.className = "records-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    ["Name", "Address", "Project", "Year", "Details"].forEach(label => {
        const th = document.createElement("th");
        th.textContent = label;
        headRow.append(th);
    });

    thead.append(headRow);

    const tbody = document.createElement("tbody");

    visibleRecords.forEach(record => {
        const row = document.createElement("tr");

        row.append(
            createCell(record.name || ""),
            createCell(record.address || ""),
            createCell(record.project || ""),
            createCell(record.year || "")
        );

        const actionCell = document.createElement("td");
        actionCell.className = "records-table-action";

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "View Details";
        button.addEventListener("click", () => {
            viewDetails(record.id);
        });

        actionCell.append(button);
        row.append(actionCell);
        tbody.append(row);
    });

    table.append(thead, tbody);
    wrapper.append(table);
    container.append(wrapper);

    if (records.length > DISPLAY_PAGE_SIZE) {
        const pager = document.createElement("div");
        pager.className = "table-pagination";

        const previousButton = document.createElement("button");
        previousButton.type = "button";
        previousButton.className = "pager-btn";
        previousButton.textContent = "Previous";
        previousButton.disabled = currentPage === 1;
        previousButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage -= 1;
                renderRecords(currentFilteredRecords);
            }
        });

        const pageInfo = document.createElement("span");
        pageInfo.className = "pager-info";
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.className = "pager-btn";
        nextButton.textContent = "Next";
        nextButton.disabled = currentPage >= totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage += 1;
                renderRecords(currentFilteredRecords);
            }
        });

        pager.append(previousButton, pageInfo, nextButton);
        container.append(pager);
    }
}


function createCell(value) {

    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}


// Search and Filter Events

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

if (projectFilter) {
    projectFilter.addEventListener("change", applyFilters);
}

if (yearFilter) {
    yearFilter.addEventListener("change", applyFilters);
}


// View Details

function viewDetails(id) {

    window.location =
        `details.html?id=${encodeURIComponent(id)}`;

}
