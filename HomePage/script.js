const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");
const chartCanvas = document.getElementById("expenseChart");
const incomeInput = document.getElementById("income-input");
const taxesEstimateElement = document.getElementById("taxes-estimate");
const deductionsAndCreditsElement = document.getElementById("deductions-credits");
const taxGuideElement = document.getElementById("tax-guide");

let expenses = [];
let chart;
let chartType = "bar";
let income = 0;
let lastRequestTime = 0;
const requestInterval = 2000;
let retrying = false;

async function askFinancialAI() {
  const now = Date.now();

  if (now - lastRequestTime < requestInterval || isRetrying) {
    alert("You are sending requests too quickly. Please wait a moment and try again.");
    return;
  }
  lastRequestTime = now;

  const userInput = document.getElementById("user-input").value;
  console.log("User input:", userInput);

  if (!userInput) return alert("Please enter a question!");

  const chatWindow = document.getElementById("chat-window");

  chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

  const loaderMessage = document.createElement("p");
  loaderMessage.innerHTML = `<strong>AI:</strong> <span class="dots">...</span>`;
  chatWindow.appendChild(loaderMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  const apiKey = "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";
  const apiUrl = `https://api.openai.com/v1/chat/completions`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
       body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
      }),
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") || 2; 
      alert(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
      retrying = true;

      setTimeout(() => {
        retrying = false; 
      }, retryAfter * 1000);

      loaderMessage.remove();
      return;
    }

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "No response from AI.";
    
    loaderMessage.remove();

    chatWindow.innerHTML += `<p><strong>AI:</strong> ${aiResponse}</p>`;
    document.getElementById("user-input").value = "";
  } catch (error) {
    console.error("Error fetching AI response:", error);

    loaderMessage.remove();

    chatWindow.innerHTML += `<p><strong>AI:</strong> Sorry, I couldn't fetch an answer. Please try again later.</p>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}


function addExpense(event) {
  event.preventDefault();

  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  if (!name || !amount || !category || !date) return alert("Please fill out all fields!");

  const expense = { 
    name, 
    amount, 
    category, 
    date 
  };
  expenses.push({ name, amount, category, date });

  updateExpenseTable();
  updateTotalAmount();
  updateChart();
  checkBudget();
  generateAIAdvice();
  expenseForm.reset();
}

function updateExpenseTable() {
  expenseList.innerHTML = "";

  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.name}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button onclick="deleteExpense(${index})"><i class="fas fa-trash"></i></button>
      </td>
    `;

    expenseList.appendChild(row);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateExpenseTable();
  updateTotalAmount();
  updateChart();
}

function updateTotalAmount() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmountElement.textContent = total.toFixed(2);
}
function setBudget() {
  const budgetLimit = parseFloat(document.getElementById("budget-limit").value);

  if (isNaN(budgetLimit) || budgetLimit <= 0) {
    alert("Please enter a valid budget amount.");
    return;
  }

  generateAIAdvice();
  checkBudget();
}

function checkBudget() {
  const budgetLimit = parseFloat(document.getElementById("budget-limit").value);
  const totalAmount = parseFloat(totalAmountElement.textContent);
  const budgetAlert = document.getElementById("budget-alert");

  if (budgetLimit && totalAmount > budgetLimit) {
    budgetAlert.textContent = "Warning: You've exceeded your budget!";
  } else {
    budgetAlert.textContent = "";
  }
}



function updateChart(type = chartType) {
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type,
    data: {
      labels,
      datasets: [{
        label: "Expenses by Category",
        data,
        backgroundColor: ["#e57373", "#81c784", "#64b5f6", "#ffd54f"],
      }],
    },
  });
}

document.getElementById("barChart").addEventListener("click", () => updateChart("bar"));
document.getElementById("pieChart").addEventListener("click", () => updateChart("pie"));
document.getElementById("lineChart").addEventListener("click", () => updateChart("line"));
document.getElementById("doughnutChart").addEventListener("click", () => updateChart("doughnut"));

expenseForm.addEventListener("submit", addExpense);

// ** Taxes Calculator and Tour Guide Logic **

incomeInput.addEventListener("input", () => {
  income = parseFloat(incomeInput.value);
  updateTaxGuide();
});

function calculateTaxes() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const taxableIncome = income - totalExpenses;
  let estimatedTaxes = 0;

  if (taxableIncome > 0) {
    estimatedTaxes = taxableIncome * 0.25;
  }

  return estimatedTaxes;
}

function updateTaxGuide() {
  const estimatedTaxes = calculateTaxes();
  taxesEstimateElement.textContent = `Estimated Annual Taxes: $${estimatedTaxes.toFixed(2)}`;

  const deductionsAndCredits = getDeductionsAndCredits();
  deductionsAndCreditsElement.textContent = `Possible Deductions/Credits: ${deductionsAndCredits}`;

  showTaxGuide(estimatedTaxes);
}

function getDeductionsAndCredits() {

  let deductions = [];

  if (expenses.some(exp => exp.category === "Medical")) {
    deductions.push("Medical Expenses");
  }
  if (expenses.some(exp => exp.category === "Donations")) {
    deductions.push("Charitable Donations");
  }

  if (deductions.length === 0) {
    return "None. Keep tracking your expenses for potential deductions.";
  }
  return deductions.join(", ");
}

function showTaxGuide(estimatedTaxes) {
  const taxGuideMessages = [
    "Review your expenses to identify potential tax deductions like medical expenses, education costs, or donations.",
    "Consider contributing to retirement accounts or investing in tax-saving instruments.",
    `You should prepare to pay approximately $${estimatedTaxes.toFixed(2)} in taxes this year, based on your current income and expenses.`
  ];

  taxGuideElement.innerHTML = taxGuideMessages.join("<br>");
}