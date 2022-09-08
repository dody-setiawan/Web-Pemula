let savedInputs = [];
let searchResult = [];
let manyClick;
const savedItems = 'SAVED_ITEMS';
const addNewBookButton = document.getElementById('addNewBookButton');
const formToAdd = document.getElementById('formToAdd');
const newInputUser = document.getElementById('formAdd');
const mark = document.getElementById('mark');
const notFinishedReading = document.getElementById('notFinishedReading');
const finishedReading = document.getElementById('finishedReading');
const closeButtons = document.querySelectorAll('.close');
const inputsSearch = document.querySelectorAll('.search');
const editBook = document.getElementById('editBook');
let inputTitleFromEdit = document.getElementById('inputTitleFromEdit');
let inputAuthorFromEdit = document.getElementById('inputAuthorFromEdit');
let inputYearFromEdit = document.getElementById('inputYearFromEdit');

window.addEventListener('load', function () {
  if (typeof(Storage) != undefined) {
    if (localStorage.getItem(savedItems) != null) {
      manyClick = 0;
      updateDisplay();
    } else {
      localStorage.setItem(savedItems, '')
    }
  } else {
    alert('Browser does not support local storage');
  }
});

addNewBookButton.addEventListener('click', function () {
  formToAdd.removeAttribute('hidden');
  addNewBookButton.setAttribute('hidden', '');
});

newInputUser.addEventListener('submit', function () {
  const inputId = +new Date();
  const inputTitle = document.getElementById('inputTitleFromAdd').value;
  const inputAuthor = document.getElementById('inputAuthorFromAdd').value;
  const inputYear = Number(document.getElementById('inputYearFromAdd').value);
  const inputCheckbox = getCheck();
  const newInput = {
    id: inputId,
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isComplete: inputCheckbox,
  };
  savedInputs.push(newInput);
  toSave();
});

for (const close of closeButtons) {
  close.addEventListener('click', function () {
    if (close.getAttribute('id') === 'closeOfAdd') {
      formToAdd.setAttribute('hidden', '');
      addNewBookButton.removeAttribute('hidden');
    } else {
      editBook.setAttribute('hidden', '');
    }
  });
}

for (const search of inputsSearch) {
  search.addEventListener('input', function () {
    searchResult = [];
    const inputFromSearch = search.value;
    const inputForSearch = new RegExp(inputFromSearch, 'gi');
    for (const input of savedInputs) {
      if (input.title.match(inputForSearch) !== null) {
        searchResult.push(input);
        displaySearch();
      }
      if (searchResult.length === 0) {
        clearBookList();
        const textForNotFinishedReading = document.createElement('p');
        textForNotFinishedReading.innerHTML = `No results found for \"<b>${inputFromSearch}</b>\"`;
        const textForFinishedReading = document.createElement('p');
        textForFinishedReading.innerHTML = `No results found for \"<b>${inputFromSearch}</b>\"`;
        notFinishedReading.append(textForNotFinishedReading);
        finishedReading.append(textForFinishedReading);
      }
    }
  });
}

function setCheck (numberOfClicks) {
  manyClick += numberOfClicks;
  if (manyClick % 2 === 0) {
    mark.classList.remove('checked');
  } else {
    mark.classList.add('checked');
  }
}

function getCheck () {
  if (mark.getAttribute('class') === 'checked') {
    return true;
  } else {
    return false;
  }
}

function updateDisplay () {
  savedInputs = JSON.parse(localStorage.getItem(savedItems));
  clearBookList();
  let index = 0 ;
  for (const input of savedInputs) {
    makeList(input, index);
    index++;
  }
}

function displaySearch () {
  clearBookList();
  let index = 0 ;
  for (const input of searchResult) {
    makeList(input, index);
    index++;
  }
}

function clearBookList () {
  notFinishedReading.innerHTML = '';
  finishedReading.innerHTML = '';
}

function makeList (input, index) {
  const newListBook = document.createElement('li');
    newListBook.classList.add('book');
  
    const bookData = document.createElement('div');
    bookData.classList.add('bookData');
  
    const bookTitle = document.createElement('p');
    bookTitle.classList.add('bookTitle');
    bookTitle.innerText = input.title;
  
    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('bookAuthor');
    bookAuthor.innerText = input.author;
    bookData.append(bookTitle, bookAuthor);
    
    const features = document.createElement('div');
    features.classList.add('features');

    const trashIcon = document.createElement('img');
    trashIcon.setAttribute('src', 'img/trash.svg');
    trashIcon.setAttribute('alt', 'trash');
    trashIcon.setAttribute('onclick', `toTrash(${input.id}, ${index})`);
    trashIcon.classList.add('icon');

    if (input.isComplete === true) {
      const checkIcon = document.createElement('img');
      checkIcon.setAttribute('src', 'img/checked.svg');
      checkIcon.setAttribute('alt', 'checked');
      checkIcon.setAttribute('onclick', `toCheck(${input.id}, ${index})`);
      checkIcon.classList.add('icon');

      features.append(checkIcon, trashIcon);
      newListBook.append(bookData, features);
      finishedReading.append(newListBook);
    } else {
      const editIcon = document.createElement('img');
      editIcon.setAttribute('src', 'img/edit.svg');
      editIcon.setAttribute('alt', 'edit');
      editIcon.setAttribute('onclick', `toEdit(${input.id}, \'${input.title}\', \'${input.author}\', ${input.year}, ${input.isComplete}, ${index})`);
      editIcon.classList.add('icon');

      const uncheckIcon = document.createElement('img');
      uncheckIcon.setAttribute('src', 'img/unchecked.svg');
      uncheckIcon.setAttribute('alt', 'unchecked');
      uncheckIcon.setAttribute('onclick', `toUncheck(${input.id}, ${index})`);
      uncheckIcon.classList.add('icon');

      features.append(editIcon, uncheckIcon, trashIcon);
      newListBook.append(bookData, features);
      notFinishedReading.append(newListBook);
    };
}

function toTrash (inputId, index) {
  for (const input of savedInputs) {
    if (inputId === input.id) {
      savedInputs.splice(index, 1);
      toSave();
      updateDisplay();
    }
  }
}

function toCheck (inputId, index) {
  for (const input of savedInputs) {
    if (inputId === input.id) {
      savedInputs[index].isComplete = false;
      toSave();
      updateDisplay();
    }
  }
}

function toEdit (inputId, inputTitle, inputAuthor, inputYear, inputIsComplete, index) {
  const inputData = [inputId, inputTitle, inputAuthor, inputYear, inputIsComplete];
  editBook.removeAttribute('hidden');
  inputTitleFromEdit.setAttribute('value', `${inputData[1]}`);
  inputAuthorFromEdit.setAttribute('value', `${inputData[2]}`);
  inputYearFromEdit.setAttribute('value', `${inputData[3]}`);
  const editInputUser = document.getElementById('formToEdit');
  editInputUser.addEventListener('submit', function () {
    const editInput = getEditInput(inputData);
    for (const input of savedInputs) {
      if (inputData[0] === input.id) {
        savedInputs[index] = editInput;
        toSave();
        updateDisplay();
      }
    }
  });
}

function getEditInput (inputData) {
  const editInput = {
    id: inputData[0],
    title: inputTitleFromEdit.value,
    author: inputAuthorFromEdit.value,
    year: inputYearFromEdit.value,
    isComplete: inputData[4],
  };
  return editInput;
}

function toUncheck (inputId, index) {
  for (const input of savedInputs) {
    if (inputId === input.id) {
      savedInputs[index].isComplete = true;
      toSave();
      updateDisplay();
    }
  }
}

function toSave () {
  localStorage.setItem(savedItems, JSON.stringify(savedInputs))
}