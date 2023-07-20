//Nav Bar
let $blocks = $('.block-card');

$('.filter-btn').on('click', e => {
  let $btn = $(e.target).addClass('active');
  $btn.siblings().removeClass('active');

  let selector = $btn.data('target');
  $blocks.removeClass('active').filter(selector).addClass('active');
});



//Necessary Functions
//Function to calculate the total of the category i.e income to be displayed
function calculateCategory(category) {
  if (getStorageItem(category + 'Categories')) {
    const categories = getStorageItem(category + 'Categories');
    //This returns the total of the category i.e income to be displayed, acc is used as the accumulator
    return categories.reduce((acc, curr) => (acc += parseInt(curr[category])), 0);
  } else {
    return
  }
}
//Function to set key,value in localStorage
function setStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
//Function to get key,value from localStorage
function getStorageItem(item) {
  const localStorageItem = localStorage.getItem(item);
  if (localStorageItem !== null) {
    return JSON.parse(localStorageItem);
  } else {
    return undefined;
  }
}
//Function to get categories from localStorage
function Categories(category) {
  if (getStorageItem(category + 'Categories'))
    return getStorageItem(category + 'Categories');
  return [];
}
//Function to get month from month number
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

//Income Page
totalIncome = calculateCategory('income');
localStorage.setItem('totalIncome', totalIncome);
newIncomeForm = document.getElementById("newIncomeForm");
newIncomeForm.addEventListener("submit", IncomeEvent);
p = document.getElementById("incomeValue");
p.append(totalIncome);

//Function to add income
function addIncome(newIncome, source) {
  const income = getStorageItem('incomeCategories');
  const newIncomeObj = {
    income: newIncome,
    source: source
  };
  if (income !== undefined) {
    income.push(newIncomeObj);
    setStorageItem('incomeCategories', income);
  } else {
    setStorageItem('incomeCategories', [newIncomeObj]);

  }
  location.reload()
}

function deleteIncome(newIncome, source) {
  const income = getStorageItem('incomeCategories');
  const newIncomeObj = {
    income: newIncome,
    source: source
  };
  income.pop([newIncomeObj]);
  setStorageItem('incomeCategories', income);
  location.reload()
}


//Function to make donut chart for income
function addIncomeChart() {
  const labels = []
  const data = []
  const tableBody = document.getElementById("Incometablebody");
  const incomeCategories = Categories('income')
  const incomeChart = document.getElementById("incomeChart").getContext('2d')

  incomeCategories.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<tr><td>-${item.source}</td><td>${item.income}</td><td><button class="btn btn-danger" id="deletetheincome">Delete</button></td></tr>`;
    tableBody.insertAdjacentElement('beforeend', tr)
    tr.addEventListener("click", (e) => {
      const targetBtn = e.target;
      deleteIncome(tr.children[1], tr.children[0]);
    });
    labels.push(item.source)
    data.push(item.income)
  });
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [

          '#000900',
          '#003630',
          '#006360',
          '#00CFC0',
          '#00F3F0',
          '#07BEB8',
          '#3DCCC7',
          '#68D8D6',
          '#9CEAEF',
          '#C4FFF9',

        ],
      }
    ]
  }
  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 17
            }
          },
        },
        title: {
          display: true,
          text: 'Income Sources',
          font: {
            size: 20
          }
        },
      },
    },
  };

  const chart1 = new Chart(incomeChart, config)
}

function IncomeEvent(e) {
  e.preventDefault();

  const IncomeSourceInput = document.getElementById('IncomeSourceInput').value;
  const newIncomeSourceInput = document.getElementById('newIncomeSourceInput').value;
  const IncomeAmount = document.getElementById('incomeAmount').value;

  const Source = newIncomeSourceInput || IncomeSourceInput;
  if (IncomeAmount !== '') {
    addIncome(IncomeAmount, Source);
  }

}
addIncomeChart()


//Budget Page
const budgetInput = document.getElementById("budget-input");
budgetInput.max = parseFloat(localStorage.getItem('totalIncome'));
const expensesInput = document.getElementById("expenseAmount");
expensesInput.max = parseFloat(localStorage.getItem('budget'));
const budgetForm = document.getElementById("budget-form-element");
const budgetMessage = document.getElementById("budget-message");
const budgetInfo = document.getElementById("budget-info");
const editBudgetButton = document.getElementById("edit-budget");

budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const budgetInput = document.getElementById("budget-input");
  const budget = budgetInput.value;
  const monthInput = document.getElementById("month-select");
  const month = monthInput.value;
  // Save the budget to localStorage
  localStorage.setItem("budget", budget);
  localStorage.setItem("month", month);
  // Hide the budget form
  budgetForm.style.display = "none";
  budgetMessage.style.display = "block";
  budgetInfo.textContent = `Budget has been set to: ₹${budget} for the month of ${getMonthName(localStorage.getItem("month"))}`;
  location.reload()
});

editBudgetButton.addEventListener("click", function () {
  // Hide the budget message
  budgetMessage.style.display = "none";
  budgetForm.style.display = "block";
});

// Check if budget is already set in localStorage
const storedBudget = localStorage.getItem("budget");
if (storedBudget) {
  // Hide the budget form
  budgetForm.style.display = "none";
  budgetMessage.style.display = "block";
  budgetInfo.textContent = `Budget has been set to: ₹${storedBudget} for the month of ${getMonthName(localStorage.getItem("month"))}`;
}

//Date Constraint
const ebtn = document.getElementById("navExpense");
ebtn.addEventListener("click", function () {
  const dateInput = document.getElementById("expenseDate");
  const storedMonth = localStorage.getItem("month");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const selectedDate = new Date(currentYear, storedMonth - 1, 1);

  const flatpickrOptions = {
    dateFormat: "Y-m-d",
    minDate: new Date(currentYear, storedMonth - 1, 1),
    maxDate: new Date(currentYear, storedMonth, 0),
    defaultDate: selectedDate,
    disableMobile: true
  };
  flatpickr(dateInput, flatpickrOptions);
})


//Expense Page
//totalExpense= calculateCategory('expense');
newExpenseForm = document.getElementById("newExpenseForm");
newExpenseForm.addEventListener("submit", ExpenseEvent);
ep = document.getElementById("expenseValue");
ep.append(localStorage.getItem('totalExpense'));

function addExpense(newExpense, source, date) {
  const expense = getStorageItem('expenseCategories');
  const newExpenseObj = {
    expense: newExpense,
    source: source,
    date: date
  };
  if (expense !== undefined) {
    expense.push(newExpenseObj);
    setStorageItem('expenseCategories', expense);
  } else {
    setStorageItem('expenseCategories', [newExpenseObj]);
  }
  location.reload()
}
function deleteExpense(newExpense, source, date) {
  const expense = getStorageItem('expenseCategories');
  const totalExpense = localStorage.getItem('totalExpense');
  newtotalExpense = totalExpense - newExpense;
  localStorage.setItem('totalExpense', newtotalExpense);
  const newExpenseObj = {
    expense: newExpense,
    source: source,
    date: date
  };
  expense.pop([newExpenseObj]);
  setStorageItem('expenseCategories', expense);
  location.reload()
}

//Function to make donut chart for expense
function addExpenseChart() {
  const labels = []
  const data = []
  const tableBody = document.getElementById("Expensetablebody");
  const expenseCategories = Categories('expense')
  const expenseChart = document.getElementById("expenseChart").getContext('2d')
  let totalExpense = 0;

  expenseCategories.forEach(item => {
    const date = new Date(item.date);
    const month = date.getMonth() + 1;
    if (month == localStorage.getItem("month")) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<tr><td>-${item.source}</td><td>${item.expense}</td><td>${item.date}</td><td><button class="btn btn-danger" id="deleteit">Delete</button></td></tr>`;
      tableBody.insertAdjacentElement('beforeend', tr)
      tr.addEventListener("click", (e) => {
        const targetBtn = e.target;
        deleteExpense(tr.children[1], tr.children[0], tr.children[2]);
      });
      labels.push(item.source)
      data.push(item.expense)
      totalExpense += parseFloat(item.expense);
      localStorage.setItem('totalExpense', totalExpense);
    }
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#000900',
          '#003630',
          '#006360',
          '#00CFC0',
          '#00F3F0',
          '#07BEB8',
          '#3DCCC7',
          '#68D8D6',
          '#9CEAEF',
          '#C4FFF9',
        ],
      }
    ]
  }
  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 17
            }
          },

        },
        title: {
          display: true,
          text: 'Expense Sources',
          font: {
            size: 20
          }
        },
      },
    },
  };

  const chart1 = new Chart(expenseChart, config)
}

function ExpenseEvent(e) {
  e.preventDefault();
  const newExpenseSourceInput = document.getElementById('newExpenseSourceInput').value;
  const ExpenseAmount = document.getElementById('expenseAmount').value;
  const ExpenseDate = document.getElementById('expenseDate').value;

  if (ExpenseAmount !== '') {
    addExpense(ExpenseAmount, newExpenseSourceInput, ExpenseDate);
  }
}

addExpenseChart()

//Finiancial Summary Page
incomep = document.getElementById("incomeValuep");
incomep.append(localStorage.getItem('totalIncome'));
budgetp = document.getElementById("budgetValue");
budgetp.append(localStorage.getItem('budget'));
expensep = document.getElementById("expenseValuep");
expensep.append(localStorage.getItem('totalExpense'));
savingsp = document.getElementById("savings");
savingsp.append(localStorage.getItem('Savings'));

function addSummaryChart() {

  const summaryChart = document.getElementById("SummaryChart").getContext('2d')
  const Savings = parseFloat(localStorage.getItem('totalIncome')) - parseFloat(localStorage.getItem('totalExpense'));
  localStorage.setItem('Savings', Savings);
  const labels = ["TotalIncome", "Budget", "TotalExpense", "Savings"];
  const data = {
    labels: labels,
    datasets: [{
      label: `Financial Summary for the month of ${getMonthName(localStorage.getItem("month"))}`,
      data: [parseFloat(localStorage.getItem('totalIncome')), parseFloat(localStorage.getItem('budget')), parseFloat(localStorage.getItem('totalExpense')), Savings],
      backgroundColor: [


        '#b8f2e6',
        '#00CFC0',
        '#aed9e0',
        '#07BEB8',

      ],
      borderColor: [


        '#b8f2e6',
        '#00CFC0',
        '#aed9e0',
        '#07BEB8',

      ],
      borderWidth: 3
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            font: {
              size: 20,

            }
          }
        }
      },

    },
  };
  const chart1 = new Chart(summaryChart, config)
}

addSummaryChart()