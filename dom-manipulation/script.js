let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  ];

  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
  }
  
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  function createAddQuoteForm() {
    const formDiv = document.createElement("div");
  
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";
    
    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";
  
    const addButton = document.createElement("button");
    addButton.innerText = "Add Quote";
    addButton.onclick = addQuote; 
  
    formDiv.appendChild(quoteInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
  
    document.body.appendChild(formDiv);
  }

  window.onload = function() {
    createAddQuoteForm();
  };

  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both quote text and category.");
    }
  }

  // Implementing Web Storage and JSON Handling
  let quote = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  ];
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both quote text and category.");
    }
  }
  
  window.onload = function() {
    showRandomQuote(); 
  };

  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote(); 
    };
    fileReader.readAsText(event.target.files[0]);
  }

//Creating a Dynamic Content Filtering System Using Web Storage and JSON
const quotess = [
    { text: "Quote 1", category: "Inspiration" },
    { text: "Quote 2", category: "Motivation" },
    { text: "Quote 3", category: "Happiness" },
];

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
}

window.onload = populateCategories;

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteContainer = document.getElementById("quoteContainer");
    quoteContainer.innerHTML = ""; 

    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("p");
        quoteElement.textContent = quote.text;
        quoteContainer.appendChild(quoteElement);
    });

    localStorage.setItem("selectedCategory", selectedCategory);
}

function addQuote(text, category) {
    quotes.push({ text, category });
    const categoryFilter = document.getElementById("categoryFilter");

    if (!Array.from(categoryFilter.options).some(option => option.value === category)) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    }

    localStorage.setItem("quotes", JSON.stringify(quotes));

    filterQuotes();
}

// Syncing Data with Server and Implementing Conflict Resolution
const serverUrl = "https://jsonplaceholder.typicode.com/posts";
let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

function fetchQuotesFromServer() {
    fetch(serverUrl)
        .then(response => response.json())
        .then(serverQuotes => {
    
            const formattedServerQuotes = serverQuotes.map(post => ({
                text: post.body,
                category: "General",
                id: post.id
            }));

            syncQuotes(formattedServerQuotes);
        })
        .catch(error => console.error("Error fetching from server:", error));
}

setInterval(fetchQuotesFromServer, 60000);

function syncQuotes(serverQuotes) {
    const localQuotesMap = new Map(localQuotes.map(quote => [quote.id, quote]));

    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotesMap.get(serverQuote.id);

        if (!localQuote || localQuote.text !== serverQuote.text) {
            localQuotesMap.set(serverQuote.id, serverQuote);
            notifyUserOfUpdate(serverQuote);
        }
    });

    localQuotes = Array.from(localQuotesMap.values());
    localStorage.setItem("quotes", JSON.stringify(localQuotes));

    filterQuotes();
}

function notifyUserOfUpdate(updatedQuote) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = `Quote updated: "${updatedQuote.text}"`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000); 
}

function resolveConflict(manualResolutionCallback) {
    const conflictModal = document.createElement("div");
    conflictModal.className = "conflict-modal";
    conflictModal.innerHTML = `
        <p>Conflict detected! Choose which version to keep:</p>
        <button id="keepLocal">Keep Local Version</button>
        <button id="keepServer">Keep Server Version</button>
    `;
    document.body.appendChild(conflictModal);

    document.getElementById("keepLocal").onclick = () => {
        manualResolutionCallback("local");
        document.body.removeChild(conflictModal);
    };

    document.getElementById("keepServer").onclick = () => {
        manualResolutionCallback("server");
        document.body.removeChild(conflictModal);
    };
}