const LIMIT = 10000;
const currency = 'rub.';
const STATUS_IN_LIMIT = 'Everything is okey';
const STATUS_OUT_OF_LIMIT = 'Everything is bad';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'expense__status--unsuccess';

let expenses = [];

const inputElement = document.querySelector('.js-expense-input');

const buttonElement = document.querySelector('.js-btn');

const historyElement = document.querySelector('.js-history');

const sumElement = document.querySelector('.js-total');

const limitElement = document.querySelector('.js-limit');

const statusElement = document.querySelector('.js-status');

const resetBtn = document.querySelector('.js-reset-btn');

const expenseCategoryElem = document.querySelector('.js-expense-category');

const errorPopup = document.querySelector('.js-expense__error-popup');

init(expenses);

buttonElement.addEventListener('click', function () {
  trackExpense();

  render(expenses);
});

function init(expenses) {
  limitElement.innerText = LIMIT;
  statusElement.innerText = STATUS_IN_LIMIT;
  sumElement.innerText = calculateExpanses(expenses);
}

function trackExpense() {
  const currentAmount = getExpenseFromUser();

  const currentCategory = getCategory();

  if (currentCategory === 'Category' || !currentAmount) {
    errorPopup.classList.remove('hide');

    setTimeout(() => {
      errorPopup.classList.add('hide');
    }, 3000);
    return;
  }

  if (!currentAmount) {
    return;
  }

  const newExpense = {amount: currentAmount, category: currentCategory};

  expenses.push(newExpense);
}

function getExpenseFromUser() {
  if (!inputElement.value) {
    return null;
  }

  const expense = parseInt(inputElement.value);

  clearInput();

  return expense;
}

function clearInput() {
  inputElement.value = '';
}

function calculateExpanses(expenses) {
  let sum = 0;
  expenses.forEach(expense => {
    sum += expense.amount;
  });

  return sum;
}

function render(expenses) {
  const sum = calculateExpanses(expenses);
  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
}

function renderHistory(expenses) {
  let expensesListHTML = '';

  expenses.forEach(expense => {
    const elementHTML = `<li>${expense.category} - ${expense.amount} ${currency}</li>`;
    expensesListHTML += elementHTML;
  });

  const html = `<ol>
                  ${expensesListHTML}
                </ol>`;
  historyElement.innerHTML = html;
}

function renderSum(sum) {
  sumElement.innerText = sum;
}

function renderStatus(sum) {
  const totalSum = calculateExpanses(expenses);
  if (sum <= LIMIT) {
    statusElement.innerText = STATUS_IN_LIMIT;
    statusElement.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  } else {
    statusElement.innerText = `${STATUS_OUT_OF_LIMIT} (${
      LIMIT - totalSum
    } rub.)`;
    statusElement.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

inputElement.addEventListener('keypress', function (e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    trackExpense();

    render(expenses);
  }
});

inputElement.addEventListener('input', resetMinusInput);

function resetMinusInput() {
  if (inputElement.value < 0) {
    inputElement.value = '';
  }
}

resetBtn.addEventListener('click', clearButtonHandler);

function clearButtonHandler() {
  expenses = [];
  render(expenses);
}

function getCategory() {
  let categoryName = expenseCategoryElem.value;

  return categoryName;
}
