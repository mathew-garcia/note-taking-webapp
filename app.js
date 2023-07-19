// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Function to add a notebook dropdown to the sidebar
  function addNotebookDropdown(notebookName) {
    // Create the notebook dropdown element
    var notebookDropdown = document.createElement('li');
    notebookDropdown.classList.add('notebook');

    // Create the notebook link element
    var notebookLink = document.createElement('a');
    notebookLink.textContent = notebookName;
    notebookLink.href = '#'; // Add a placeholder href

    // Create the note list element
    var noteList = document.createElement('ul');
    noteList.classList.add('note-list');

    // Create the "Add Note" button
    var addNoteBtn = document.createElement('button');
    addNoteBtn.innerHTML = '+';
    addNoteBtn.classList.add('add-note-btn');
    addNoteBtn.addEventListener('click', function (event) {
      showNoteInput(noteList);
    });

    // Toggle visibility of notes when clicking the notebook link
    notebookLink.addEventListener('click', function (event) {
      event.preventDefault();
      noteList.classList.toggle('hidden');
    });

    // Create the "Delete Notebook" button
    var deleteNotebookBtn = document.createElement('button');
    deleteNotebookBtn.innerHTML = 'Delete';
    deleteNotebookBtn.classList.add('delete-notebook-btn');
    deleteNotebookBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteNotebook(notebookDropdown);
    });

    // Create the "Edit Notebook" button
    var editNotebookBtn = document.createElement('button');
    editNotebookBtn.innerHTML = 'Edit';
    editNotebookBtn.classList.add('edit-notebook-btn');
    editNotebookBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      editNotebook(notebookLink);
    });

    // Append the elements to the notebook dropdown
    notebookDropdown.appendChild(notebookLink);
    notebookDropdown.appendChild(noteList);
    notebookDropdown.appendChild(addNoteBtn);
    notebookDropdown.appendChild(deleteNotebookBtn);
    notebookDropdown.appendChild(editNotebookBtn);

    // Append the notebook dropdown to the sidebar
    document.querySelector('.notebook-list').appendChild(notebookDropdown);
  }

  // Function to show the note input field when adding a new note
  function showNoteInput(noteList) {
    // Create the note input field
    var noteInput = document.createElement('input');
    var noteSubmitBtn = document.createElement('button');
    noteSubmitBtn.textContent = 'Submit';

    // Function to handle form submission
    function submitForm() {
      if (noteInput.value.trim() !== '') {
        addNoteToList(noteInput.value, noteList);
        noteInput.remove();
        noteSubmitBtn.remove();
      }
    }

    // Event listener for submit button click
    noteSubmitBtn.addEventListener('click', function (event) {
      event.preventDefault();
      submitForm();
    });

    // Event listener for Enter key press
    noteInput.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        submitForm();
      }
    });

    // Append the elements to the note list
    noteList.appendChild(noteInput);
    noteList.appendChild(noteSubmitBtn);

    // Set focus on the note input field
    noteInput.focus();
  }

  // Function to add a new note to the note list
  function addNoteToList(noteName, noteList) {
    // Create the note item element
    var noteItem = document.createElement('li');
    var noteLink = document.createElement('a');
    noteLink.textContent = noteName;
    noteLink.href = '#'; // Add a placeholder href

    // Create the "Delete Note" button
    var deleteNoteBtn = document.createElement('button');
    deleteNoteBtn.innerHTML = 'Delete';
    deleteNoteBtn.classList.add('delete-note-btn');
    deleteNoteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteNote(noteItem);
    });

    // Create the "Edit Note" button
    var editNoteBtn = document.createElement('button');
    editNoteBtn.innerHTML = 'Edit';
    editNoteBtn.classList.add('edit-note-btn');
    editNoteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      editNote(noteLink);
    });

    // Event listener for note link click
    noteLink.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Note link clicked:', noteName);
    });

    // Append the elements to the note item
    noteItem.appendChild(noteLink);
    noteItem.appendChild(deleteNoteBtn);
    noteItem.appendChild(editNoteBtn);

    // Append the note item to the note list
    noteList.appendChild(noteItem);
  }

  // Function to handle the deletion of a notebook
  function deleteNotebook(notebookDropdown) {
    notebookDropdown.remove();
  }

  // Function to handle the editing of a notebook name
  function editNotebook(notebookLink) {
    var currentName = notebookLink.textContent;
    var newName = prompt('Enter the new notebook name:', currentName);

    // Update the notebook name if a valid new name is provided
    if (newName && newName.trim() !== '') {
      notebookLink.textContent = newName;
    }
  }

  // Function to handle the deletion of a note
  function deleteNote(noteItem) {
    noteItem.remove();
  }

  // Function to handle the editing of a note
  function editNote(noteLink) {
    var currentName = noteLink.textContent;
    var newName = prompt('Enter the new note name:', currentName);

    // Update the note name if a valid new name is provided
    if (newName && newName.trim() !== '') {
      noteLink.textContent = newName;
    }
  }

  // Event listener for adding a new notebook
  document
    .getElementById('add-notebook-btn')
    .addEventListener('click', function () {
      var notebookInput = document.getElementById('notebook-input');
      var notebookName = notebookInput.value.trim();
      if (notebookName) {
        addNotebookDropdown(notebookName);
        notebookInput.value = '';
      }
    });

  // Event listener for pressing Enter to add a new notebook
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
        }
      }
    });
});
