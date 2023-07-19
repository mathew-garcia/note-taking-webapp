// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', function () {
  // Retrieve notebooks from local storage or initialize an empty array
  var notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];

  // Iterate through each notebook
  notebooks.forEach(function (notebook) {
    // Add a notebook dropdown to the UI
    var notebookDropdown = addNotebookDropdown(notebook.name);

    // Iterate through each note in the notebook and add it to the UI
    notebook.notes.forEach(function (note) {
      addNoteToList(note, notebookDropdown.querySelector('.note-list'));
    });
  });

  // Store the currently selected note
  var selectedNote = '';

  // Function to add a notebook dropdown to the UI
  function addNotebookDropdown(notebookName) {
    var notebookDropdown = document.createElement('li');
    notebookDropdown.classList.add('notebook');

    var notebookLink = document.createElement('a');
    notebookLink.textContent = notebookName;
    notebookLink.href = '#';

    var noteList = document.createElement('ul');
    noteList.classList.add('note-list');

    var addNoteBtn = document.createElement('button');
    addNoteBtn.innerHTML = '+';
    addNoteBtn.classList.add('add-note-btn');
    addNoteBtn.addEventListener('click', function (event) {
      showNoteInput(noteList);
    });

    notebookLink.addEventListener('click', function (event) {
      event.preventDefault();
      noteList.classList.toggle('hidden');
    });

    var deleteNotebookBtn = document.createElement('button');
    deleteNotebookBtn.innerHTML = 'Delete';
    deleteNotebookBtn.classList.add('delete-notebook-btn');
    deleteNotebookBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteNotebook(notebookDropdown);
      saveNotebooks();
    });

    var editNotebookBtn = document.createElement('button');
    editNotebookBtn.innerHTML = 'Edit';
    editNotebookBtn.classList.add('edit-notebook-btn');
    editNotebookBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      editNotebook(notebookLink);
      saveNotebooks();
    });

    notebookDropdown.appendChild(notebookLink);
    notebookDropdown.appendChild(noteList);
    notebookDropdown.appendChild(addNoteBtn);
    notebookDropdown.appendChild(deleteNotebookBtn);
    notebookDropdown.appendChild(editNotebookBtn);

    document.querySelector('.notebook-list').appendChild(notebookDropdown);

    return notebookDropdown;
  }

  // Function to add a note to the note list
  function addNoteToList(noteName, noteList) {
    var noteItem = document.createElement('li');
    var noteLink = document.createElement('a');
    noteLink.textContent = noteName;
    noteLink.href = '#';

    noteLink.addEventListener('click', function (event) {
      event.preventDefault();
      updateNoteName(noteName);
    });

    var deleteNoteBtn = document.createElement('button');
    deleteNoteBtn.innerHTML = 'Delete';
    deleteNoteBtn.classList.add('delete-note-btn');
    deleteNoteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteNote(noteItem);
      saveNotebooks();
    });

    var editNoteBtn = document.createElement('button');
    editNoteBtn.innerHTML = 'Edit';
    editNoteBtn.classList.add('edit-note-btn');
    editNoteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      editNote(noteLink);
      saveNotebooks();
    });

    noteItem.appendChild(noteLink);
    noteItem.appendChild(deleteNoteBtn);
    noteItem.appendChild(editNoteBtn);

    noteList.appendChild(noteItem);
  }

  // Function to delete a notebook
  function deleteNotebook(notebookDropdown) {
    var notebookName = notebookDropdown.querySelector('a').textContent;
    var notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];
    var updatedNotebooks = notebooks.filter(function (notebook) {
      return notebook.name !== notebookName;
    });

    // Remove notes associated with the deleted notebook
    updatedNotebooks.forEach(function (notebook) {
      notebook.notes = notebook.notes.filter(function (note) {
        return note.notebook !== notebookName;
      });
    });

    localStorage.setItem('notebooks', JSON.stringify(updatedNotebooks));
    notebookDropdown.remove();
  }

  // Function to edit a notebook name
  function editNotebook(notebookLink) {
    var currentName = notebookLink.textContent;
    var newName = prompt('Enter the new notebook name:', currentName);

    if (newName && newName.trim() !== '') {
      notebookLink.textContent = newName;
    }
  }

  // Function to delete a note
  function deleteNote(noteItem) {
    var noteName = noteItem.querySelector('a').textContent;
    var notebookDropdown = noteItem.closest('.notebook');
    var notebookName = notebookDropdown.querySelector('a').textContent;
    var notebooks = JSON.parse(localStorage.getItem('notebooks')) || [];

    // Remove the note from the corresponding notebook
    notebooks.forEach(function (notebook) {
      if (notebook.name === notebookName) {
        notebook.notes = notebook.notes.filter(function (note) {
          return note !== noteName;
        });
      }
    });

    localStorage.setItem('notebooks', JSON.stringify(notebooks));
    noteItem.remove();

    // Delete the note's data from the text editor
    localStorage.removeItem(noteName);
  }

  // Function to edit a note
  function editNote(noteLink) {
    var currentName = noteLink.textContent;
    var newName = prompt('Enter the new note name:', currentName);

    if (newName && newName.trim() !== '') {
      noteLink.textContent = newName;
    }
  }

  // Function to get the content of a note
  function getNoteContent(noteName) {
    return localStorage.getItem(noteName) || '';
  }

  // Function to update the current note name and load its content
  function updateNoteName(noteName) {
    var noteNameElement = document.getElementById('note-name');
    noteNameElement.textContent = noteName;
    selectedNote = noteName;
    loadNoteContent(noteName);
  }

  // Function to load the content of a note
  function loadNoteContent(noteName) {
    var noteContent = getNoteContent(noteName);
    var editorContent = document.querySelector('.editor-content');
    editorContent.innerHTML = noteContent;
  }

  // Function to show the note input field when adding a new note
  function showNoteInput(noteList) {
    var noteInput = document.createElement('input');
    var noteSubmitBtn = document.createElement('button');
    noteSubmitBtn.textContent = 'Submit';

    function submitForm() {
      if (noteInput.value.trim() !== '') {
        addNoteToList(noteInput.value, noteList);
        noteInput.remove();
        noteSubmitBtn.remove();
        saveNotebooks();
      }
    }

    noteSubmitBtn.addEventListener('click', function (event) {
      event.preventDefault();
      submitForm();
    });

    noteInput.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        submitForm();
      }
    });

    noteList.appendChild(noteInput);
    noteList.appendChild(noteSubmitBtn);

    noteInput.focus();
  }

  // Function to save the notebooks to local storage
  function saveNotebooks() {
    var notebookList = Array.from(document.querySelectorAll('.notebook'));
    var notebooks = notebookList.map(function (notebookDropdown) {
      var notebookName = notebookDropdown.querySelector('a').textContent;
      var noteList = Array.from(
        notebookDropdown.querySelectorAll('.note-list li')
      );
      var notes = noteList.map(function (noteItem) {
        return noteItem.querySelector('a').textContent;
      });
      return { name: notebookName, notes: notes };
    });
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }

  document
    .getElementById('save-note-button')
    .addEventListener('click', function () {
      var editorContent = document.querySelector('.editor-content');
      var noteContent = editorContent.innerHTML;
      saveNoteContent(selectedNote, noteContent);
    });

  // Function to save the content of a note to local storage
  function saveNoteContent(noteName, noteContent) {
    var editorContent = document.createElement('div');
    editorContent.innerHTML = noteContent;

    var buttons = editorContent.querySelectorAll('.editorButton');
    buttons.forEach((button) => {
      var cmd = button.getAttribute('data-cmd');
      button.setAttribute('data-cmd', cmd);
    });

    var updatedNoteContent = editorContent.innerHTML;
    localStorage.setItem(noteName, updatedNoteContent);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (target.matches('.note-list a')) {
      var noteName = target.textContent;
      updateNoteName(noteName);
    }
  });

  document
    .getElementById('add-notebook-btn')
    .addEventListener('click', function () {
      var notebookInput = document.getElementById('notebook-input');
      var notebookName = notebookInput.value.trim();
      if (notebookName) {
        addNotebookDropdown(notebookName);
        notebookInput.value = '';
        saveNotebooks();
      }
    });

  document
    .getElementById('notebook-input')
    .addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        var notebookInput = document.getElementById('notebook-input');
        var notebookName = notebookInput.value.trim();
        if (notebookName) {
          addNotebookDropdown(notebookName);
          notebookInput.value = '';
          saveNotebooks();
        }
      }
    });

  (function () {
    // Function to create the editor
    function createEditor(parentElement) {
      const editorContainer = parentElement;
      editorContainer.classList.add('editor-container');

      const form = editorContainer.querySelector('.editor-form');

      const buttons = editorContainer.querySelectorAll('.editorButton');
      const editorContent = editorContainer.querySelector('.editor-content');

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          let cmd = button.getAttribute('data-cmd');

          if (cmd === 'showCode') {
            if (editorContent.dataset.showCode) {
              editorContent.innerHTML = editorContent.dataset.originalContent;
              editorContent.removeAttribute('data-show-code');
            } else {
              editorContent.dataset.originalContent = editorContent.innerHTML;
              editorContent.textContent = editorContent.innerHTML;
              editorContent.dataset.showCode = true;
            }
          } else {
            document.execCommand(cmd, false, null);
            updateButtonState();
          }
        });
      });

      document.addEventListener('selectionchange', () => {
        updateButtonState();
      });

      function updateButtonState() {
        buttons.forEach((button) => {
          const dataCmd = button.getAttribute('data-cmd');
          if (
            dataCmd !== 'showCode' &&
            document.queryCommandSupported(dataCmd) &&
            document.queryCommandState(dataCmd) &&
            editorContent.innerHTML !== ''
          ) {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        });
      }
    }

    const parentElement = document.getElementById('editor-container');
    createEditor(parentElement);
  })();
});
