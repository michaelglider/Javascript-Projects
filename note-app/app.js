// Add an event listener to the window object that triggers when the page loads.
window.addEventListener("load", function () {
    // Retrieve saved notes from local storage, or initialize an empty array if none exist.
    const saveNotes = JSON.parse(localStorage.getItem("notes")) || [];
    // Get the element with the ID 'noteList' from the DOM.
    const noteList = document.getElementById("noteList");

    // Iterate over each saved note and add it to the note list in the DOM.
    saveNotes.forEach(function (saveNote) {
        const noteItem = createNoteItem(saveNote);
        noteList.appendChild(noteItem);
    })
});

// Function to create a new note.
function createNote() {
    // Get the value of the note input field.
    const noteText = document.getElementById("note").value;

    // Check if the note text is empty, and return early if it is.
    if (noteText.trim() === "") {
        return;
    }

    // Get values for font size, bold status, italic status, and text color from the DOM.
    const fontSize = document.getElementById("fontSize").value + "px";
    const isBold = document.getElementById("bold").checked;
    const isItalic = document.getElementById("italic").checked;
    const textColor = document.getElementById("color").value;

    // Create a new note item with the above values.
    const noteItem = createNoteItem({
        text: noteText,
        fontSize: fontSize,
        isBold: isBold,
        isItalic: isItalic,
        textColor: textColor,
    });

    // Append the new note item to the note list in the DOM.
    const noteList = document.getElementById("noteList");
    noteList.appendChild(noteItem);

    // Reset the input fields to their default values.
    document.getElementById("note").value = "";
    document.getElementById("fontSize").value = "16";
    document.getElementById("bold").checked = false;
    document.getElementById("italic").checked = false;
    document.getElementById("color").value = "#000000";

    // Save the new note to local storage.
    saveNoteToLocalStorage(noteItem);
}

// Function to create a note item element with given note data.
function createNoteItem(noteData) {
    // Create a new div element and add the 'note' class to it.
    const noteItem = document.createElement("div");
    noteItem.classList.add("note");
    noteItem.style.fontSize = noteData.fontSize;

    // Set the font weight to bold and font style to italic based on the note data.
    if (noteData.isBold) {
        noteItem.style.fontWeight = "bold";
    }
    if (noteData.isItalic) {
        noteItem.style.fontStyle = "italic";
    }

    // Set the text color of the note.
    noteItem.style.color = noteData.textColor;

    // Create a timestamp for the note.
    const timeStamp = new Date().toLocaleString();

    // Set the inner HTML of the note item, including the note text and timestamp.
    noteItem.innerHTML = `<p>${noteData.text}</p>
    <p class="timestamp">Posted on: ${timeStamp}</p>`;

    // Create a div for edit controls and add buttons for editing and deleting the note.
    const editControls = document.createElement("div");
    editControls.classList.add("edit-controls");
    editControls.innerHTML = `
    <button onClick="editNote(this)">Edit</button>
    <button onClick="deleteNote(this)">Delete</button>
    `;

    // Append the edit controls to the note item.
    noteItem.appendChild(editControls);

    // Return the fully constructed note item.
    return noteItem;
}

// Function to edit a note.
function editNote(editButton) {
    // Get the parent note item of the clicked edit button.
    const noteItem = editButton.parentElement.parentElement;

    // Get the text of the note and set it as the value of the note input field.
    const noteText = noteItem.querySelector("p:first-child").textContent;
    document.getElementById("note").value = noteText;

    // Delete the note from the DOM and local storage.
    deleteNote(editButton);
}

// Function to delete a note.
function deleteNote(deleteButton) {
    // Get the parent note item of the clicked delete button and remove it from the DOM.
    const noteItem = deleteButton.parentElement.parentElement;
    noteItem.remove();

    // Remove the note from local storage.
    removeNoteFromLocalStroage(noteItem);
}

// Function to save a note to local storage.
function saveNoteToLocalStorage(noteItem) {
    // Retrieve saved notes from local storage, or initialize an empty array if none exist.
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    // Extract note details from the note item.
    const noteText = noteItem.querySelector("p:first-child").textContent;
    const fontSize = noteItem.style.fontSize;
    const isBold = noteItem.style.fontWeight === "bold";
    const isItalic = noteItem.style.fontStyle === "italic";
    const textColor = noteItem.style.color;

    // Create a new note object with the above details.
    const newNote = {
        text: noteText,
        fontSize: fontSize,
        isBold: isBold,
        isItalic: isItalic,
        textColor: textColor,
    };

    // Add the new note to the saved notes array and update local storage.
    savedNotes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
}

// Function to remove a note from local storage.
function removeNoteFromLocalStroage(noteItem) {
    // Retrieve saved notes from local storage, or initialize an empty array if none exist.
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    // Extract the text of the note to be removed.
    const noteText = noteItem.querySelector("p:first-child").textContent;

    // Find the index of the note to be removed in the saved notes array.
    const index = savedNotes.findIndex((note) => note.text === noteText);

    // If the note is found, remove it from the array and update local storage.
    if (index !== -1) {
        savedNotes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(savedNotes));
    }
}

// Add a click event listener to the element with ID 'postNote' to trigger the createNote function.
document.getElementById("postNote").addEventListener("click", createNote);
