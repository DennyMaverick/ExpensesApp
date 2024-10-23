let LIMIT;
const STORAGE_LABEL_LIMIT = 'limit';
const limitFromStorage = localStorage.getItem(STORAGE_LABEL_LIMIT);

let expenses = [];

const currency = 'RUB.';
const STATUS_IN_LIMIT = 'Everything is okey';
const STATUS_OUT_OF_LIMIT = 'Everything is bad';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'expense__status--unsuccess';

const STORAGE_LABEL_EXPENSES = 'expenses';

setExpensesToStorage();

function setExpensesToStorage() {
  let expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
  if (expensesFromStorageString === null) {
    expenses = [];
    return;
  }
  let expensesFromStorage = JSON.parse(expensesFromStorageString);

  if (Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
  }
}

function removeExpensesFromStorage() {
  let expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
  if (expensesFromStorageString) {
    localStorage.setItem(STORAGE_LABEL_EXPENSES, null);
  }
}

function setLimitFromStorage() {
  const currentLimit = localStorage.getItem(STORAGE_LABEL_LIMIT);
  if (!currentLimit) {
    LIMIT = 10000;
    limitElement.innerText = LIMIT;
  } else {
    LIMIT = localStorage.getItem(STORAGE_LABEL_LIMIT);

    limitElement.innerText = localStorage.getItem(STORAGE_LABEL_LIMIT);
  }
  return LIMIT;
}

const bodyEl = document.querySelector('body');

const inputElement = document.querySelector('.js-expense-input');

const buttonElement = document.querySelector('.js-btn');

const historyElement = document.querySelector('.js-history');

const sumElement = document.querySelector('.js-total');

const limitElement = document.querySelector('.js-limit');

const statusElement = document.querySelector('.js-status');

const resetBtn = document.querySelector('.js-reset-btn');

const expenseCategoryElem = document.querySelector('.js-expense-category');

const errorPopup = document.querySelector('.js-expense__error-popup');

const editLimitBtn = document.querySelector('.js-expense-limit-btn-edit');

const modalLimitWindow = document.querySelector('.js-modal-limit');

const modalLimitInput = document.querySelector('.js-modal-limit-input');

const modalLimitBtn = document.querySelector('.js-modal-limit-set-btn');

const modalCloseBtn = document.querySelector('.js-modal-close-btn');

init(expenses);

buttonElement.addEventListener('click', function () {
  trackExpense();
  setExpensesToStorage();
  render(expenses);
});

function init(expenses) {
  setLimitFromStorage();
  statusElement.innerText = STATUS_IN_LIMIT;
  sumElement.innerText = calculateExpanses(expenses);

  render(expenses);
}

function saveExpensesToStorage() {
  const expensesString = JSON.stringify(expenses);

  localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
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

  saveExpensesToStorage();
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
  setLimitFromStorage();
  if (sum <= LIMIT) {
    statusElement.innerText = STATUS_IN_LIMIT;
    statusElement.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
  } else {
    statusElement.innerText = `${STATUS_OUT_OF_LIMIT} (${
      LIMIT - totalSum
    } ${currency})`;
    statusElement.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

inputElement.addEventListener('keypress', function (e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    trackExpense();
    setExpensesToStorage();
    render(expenses);
  }
});

function resetMinusInput(input) {
  if (input.value < 0) {
    input.value = '';
  }
}

function clearButtonHandler() {
  expenses = [];
  removeExpensesFromStorage();
  render(expenses);
}

function getCategory() {
  let categoryName = expenseCategoryElem.value;

  return categoryName;
}

function setLimitHandler() {
  const newLimit = parseInt(modalLimitInput.value);
  if (!newLimit) {
    return;
  }
}

function openModalEditLimit() {
  bodyEl.classList.add('overlay');
  modalLimitWindow.classList.add('modal-limit--active');
}

function setLimit() {
  const newLimit = parseInt(modalLimitInput.value);

  if (!newLimit) {
    return;
  }

  limitElement.innerText = newLimit;

  LIMIT = newLimit;

  localStorage.setItem(STORAGE_LABEL_LIMIT, newLimit);

  render(expenses);

  closeModalLimit();
}

function closeModalLimit() {
  bodyEl.classList.remove('overlay');
  modalLimitWindow.classList.remove('modal-limit--active');
}

modalLimitInput.addEventListener('keypress', function (e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    setLimitHandler();

    setLimit();

    closeModalLimit();
  }
});

modalCloseBtn.addEventListener('click', closeModalLimit);
modalLimitBtn.addEventListener('click', setLimit);
editLimitBtn.addEventListener('click', openModalEditLimit);
modalLimitInput.addEventListener('change', setLimitHandler);
resetBtn.addEventListener('click', clearButtonHandler);

inputElement.addEventListener('input', function () {
  resetMinusInput(inputElement);
});

modalLimitInput.addEventListener('input', function () {
  resetMinusInput(modalLimitInput);
});
