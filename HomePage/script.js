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

async function fetchFinancialAdvice(totalAmount, budgetLimit) {
  const apiUrl = "https://api.openai.com/v1/completions"; 
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      totalAmount: totalAmount,
      budgetLimit: budgetLimit,
      expenses: expenses
    })
  });

  const data = await response.json();
  return data.advice;  
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

  // Display the budget set and generate advice
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

async function generateAIAdvice() {
  const totalAmount = parseFloat(totalAmountElement.textContent);
  const budgetLimit = parseFloat(document.getElementById("budget-limit").value);
  const aiAdviceElement = document.getElementById("ai-advice");

  if (totalAmount > budgetLimit) {
    const advice = await fetchFinancialAdvice(totalAmount, budgetLimit);
    aiAdviceElement.textContent = advice || "You have exceeded your budget. Consider cutting down on non-essential expenses.";
  } else {
    aiAdviceElement.textContent = "You're within budget. Keep up the good work!";
  }
}

// ** Taxes Calculator and Tour Guide Logic **

incomeInput.addEventListener("input", () => {
  income = parseFloat(incomeInput.value);
  updateTaxGuide();
});

function calculateTaxes() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const taxableIncome = income - totalExpenses;
  let estimatedTaxes = 0;

  // Assuming a simple tax rate of 25% for the example (modify as needed)
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
  // Add possible deductions or credits based on user expenses, income, etc.
  // For example, medical expenses, donations, education credits, etc.
  // You can modify this logic as needed.

  let deductions = [];

  // Example deductions (modify with real-life logic as needed)
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