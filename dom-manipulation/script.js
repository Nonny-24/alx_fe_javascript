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
setInterval(async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); 
        const data = await response.json();

        syncWithLocalStorage(data);
    } catch (error) {
        console.error('Failed to fetch data from the server:', error);
    }
}, 300000); 

function syncWithLocalStorage(serverData) {
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];
    const updatedData = serverData; 
    localStorage.setItem('quotes', JSON.stringify(updatedData));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000); 
}

if (isConflictDetected) {
    showNotification('Conflict detected! Server data has been applied.');
}

