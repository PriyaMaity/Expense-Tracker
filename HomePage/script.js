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

const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const sendButton = document.getElementById("send-button");

const predefinedResponses = {
  "hello": "Hi there! How can I assist you today?",
  "how are you": "I'm just a bot, but I'm doing great! How about you?",
  "what is your name": "I am your friendly assistant bot.",
  "bye": "Goodbye! Have a great day!",
  "budgeting": "A good budget helps you track your income and expenses. Start by listing your monthly expenses and income, then allocate funds to savings and discretionary spending. Make sure to stick to it.",
  "saving tips": "To start saving, set a goal and automate your savings. Even small amounts add up over time. Consider creating an emergency fund, saving at least 3-6 months of living expenses.",
  "investing": "Investing can help you grow your wealth. Consider starting with low-cost index funds or exchange-traded funds (ETFs). Remember to diversify your investments to reduce risk.",
  "taxes": "To optimize your tax situation, keep track of your expenses and look for potential deductions. Consider contributing to tax-advantaged accounts like IRAs or 401(k)s. Tax preparation software or a professional tax advisor can help you get the best outcome.",
  "debt": "If you have debt, focus on paying off high-interest debt first, like credit cards. Consider consolidating loans or refinancing to lower your interest rates. Aim to pay off your debt systematically.",
  "emergency fund": "Building an emergency fund is essential. It’s recommended to save 3 to 6 months of living expenses in an easily accessible savings account for unexpected situations like medical emergencies or job loss.",
  "default": "Sorry, I didn't understand that. Can you rephrase?"
};

function getChatbotResponse(input) {
  const lowercasedInput = input.toLowerCase().trim();
  if (predefinedResponses[lowercasedInput]) {
    return predefinedResponses[lowercasedInput];
  }
    return predefinedResponses["default"];
  }

function handleChat() {
  const userInput = chatInput.value;
  if (!userInput.trim()) {
    return;
  }

const userMessageElement = document.createElement("div");
  userMessageElement.classList.add("user-message");
  userMessageElement.textContent = `You: ${userInput}`;
  chatOutput.appendChild(userMessageElement);

const botResponse = getChatbotResponse(userInput);

const botMessageElement = document.createElement("div");
botMessageElement.classList.add("bot-message");
botMessageElement.textContent = `Bot: ${botResponse}`;
chatOutput.appendChild(botMessageElement);

chatOutput.scrollTop = chatOutput.scrollHeight;
chatInput.value = "";
}

sendButton.addEventListener("click", handleChat);

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleChat();
  }
});
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