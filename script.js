window.onload = () => {
    // Initialize localStorage for incomes and expenses if not already set
    if (!localStorage.getItem("incomes")) {
        localStorage.setItem("incomes", JSON.stringify([]));
    }
    if (!localStorage.getItem("expenses")) {
        localStorage.setItem("expenses", JSON.stringify([]));
    }
    renderData();
};

// Function to handle form submissions for both income and expense
function handleFormSubmit(formId, type) 
{
    document.getElementById(formId).addEventListener("submit", function(e) {
        e.preventDefault();
        const title = this.querySelector("input[type='text']").value;
        const amount = this.querySelector("input[type='number']").value;

        // Validate input
        if (!title || !amount || amount <= 0) 
        {
            displayError("Enter valid details");
            return;
        }

        const entry = { id: Date.now(), title, amount: Number(amount) };
        const entries = JSON.parse(localStorage.getItem(type)) || [];
        entries.push(entry);
        localStorage.setItem(type, JSON.stringify(entries));
        this.reset();
        renderData();
    });
}

// Add event listeners for both forms
handleFormSubmit("incomeForm", "incomes");
handleFormSubmit("expenseForm", "expenses");

// Function to render data and calculate totals
function renderData() {
    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const incomeList = document.getElementById("incomeList");
    incomeList.innerHTML = "";
    let totalIncome = 0;
    incomes.forEach(item => {
        totalIncome += item.amount;
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="item-title">${item.title}</span>
            <span class="item-amount">₹${item.amount}</span>
            <button class="delete-btn" onclick="deleteItem(${item.id}, 'incomes')">Delete</button>
        `;
        li.classList.add("list-item");
        incomeList.appendChild(li);
    });

    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";
    let totalExpense = 0;
    expenses.forEach(item => {
        totalExpense += item.amount;
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="item-title">${item.title}</span>
            <span class="item-amount">₹${item.amount}</span>
            <button class="delete-btn" onclick="deleteItem(${item.id}, 'expenses')">Delete</button>
        `;
        li.classList.add("list-item");
        expenseList.appendChild(li);
    });

    document.getElementById("totalIncome").innerText = "₹" + totalIncome;
    document.getElementById("totalExpense").innerText = "₹" + totalExpense;
    document.getElementById("totalBalance").innerText = "₹" + (totalIncome - totalExpense);
}

// Function to delete income/expense
function deleteItem(id, type) 
{
    let data = JSON.parse(localStorage.getItem(type)) || [];
    data = data.filter(item => item.id !== id);
    localStorage.setItem(type, JSON.stringify(data));
    renderData();
}

// Function to display error messages
function displayError(message) 
{
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerText = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
