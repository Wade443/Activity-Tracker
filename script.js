const entryForm = document.getElementById("entryForm");
const dateInput = document.getElementById("dateInput");
const moodSelect = document.getElementById("moodSelect");
const activity1 = document.getElementById("activity1");
const activity2 = document.getElementById("activity2");
const activity3 = document.getElementById("activity3");

const searchInput = document.getElementById("searchInput");
const filterMood = document.getElementById("filterMood");

const entriesList = document.getElementById("entriesList");

const totalEntries = document.getElementById("totalEntries");
const commonMood = document.getElementById("commonMood");
const avgActivities = document.getElementById("avgActivities");

let entries = [];

function loadEntries() {
    const savedEntries = localStorage.getItem("entries");

    if (savedEntries) {
        entries = JSON.parse(savedEntries);
    } else {
        entries = [];
    }

    renderEntries();
    updateStats();
}

function saveEntries() {
    localStorage.setItem("entries", JSON.stringify(entries));
}

entryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const dateValue = dateInput.value;
    const moodValue = moodSelect.value;

    const activities = [
        activity1.value.trim(),
        activity2.value.trim(),
        activity3.value.trim()
    ].filter(function (activity) {
        return activity !== "";
    });

    if (dateValue === "" || moodValue === "") {
        alert("Please select a date and mood.");
        return;
    }

    if (activities.length === 0) {
        alert("Please add at least one activity.");
        return;
    }

    const newEntry = {
        id: Date.now(),
        date: dateValue,
        mood: moodValue,
        activities: activities
    };

    entries.unshift(newEntry);

    saveEntries();
    renderEntries();
    updateStats();

    entryForm.reset();
});

function renderEntries() {
    entriesList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedMood = filterMood.value;

    const filteredEntries = entries.filter(function (entry) {
        const matchesMood = selectedMood === "all" || entry.mood === selectedMood;

        const activityText = entry.activities.join(" ").toLowerCase();
        const matchesSearch =
            activityText.includes(searchText) ||
            entry.mood.toLowerCase().includes(searchText) ||
            entry.date.includes(searchText);

        return matchesMood && matchesSearch;
    });

    if (filteredEntries.length === 0) {
        entriesList.innerHTML = "<p>No entries found.</p>";
        return;
    }

    filteredEntries.forEach(function (entry) {
        const entryCard = document.createElement("div");
        entryCard.classList.add("entry-card");

        const title = document.createElement("h3");
        title.textContent = `${entry.date} | ${capitalizeMood(entry.mood)}`;

        const activityTitle = document.createElement("p");
        activityTitle.textContent = "Activities:";

        const activityList = document.createElement("ul");

        entry.activities.forEach(function (activity) {
            const listItem = document.createElement("li");
            listItem.textContent = activity;
            activityList.appendChild(listItem);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteEntry(entry.id);
        });

        entryCard.appendChild(title);
        entryCard.appendChild(activityTitle);
        entryCard.appendChild(activityList);
        entryCard.appendChild(deleteButton);

        entriesList.appendChild(entryCard);
    });
}

function deleteEntry(id) {
    entries = entries.filter(function (entry) {
        return entry.id !== id;
    });

    saveEntries();
    renderEntries();
    updateStats();
}

function updateStats() {
    totalEntries.textContent = entries.length;

    if (entries.length === 0) {
        commonMood.textContent = "None";
        avgActivities.textContent = "0";
        return;
    }

    const moodCounts = {};

    entries.forEach(function (entry) {
        if (moodCounts[entry.mood]) {
            moodCounts[entry.mood]++;
        } else {
            moodCounts[entry.mood] = 1;
        }
    });

    let mostCommon = "";
    let highestCount = 0;

    for (let mood in moodCounts) {
        if (moodCounts[mood] > highestCount) {
            highestCount = moodCounts[mood];
            mostCommon = mood;
        }
    }

    commonMood.textContent = capitalizeMood(mostCommon);

    let totalActivitiesCount = 0;

    entries.forEach(function (entry) {
        totalActivitiesCount += entry.activities.length;
    });

    const average = totalActivitiesCount / entries.length;
    avgActivities.textContent = average.toFixed(1);
}

searchInput.addEventListener("input", function () {
    renderEntries();
});

filterMood.addEventListener("change", function () {
    renderEntries();
});

function capitalizeMood(mood) {
    return mood.charAt(0).toUpperCase() + mood.slice(1);
}

loadEntries();