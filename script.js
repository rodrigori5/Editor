// Get necessary DOM elements
let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");
let imageButton = document.getElementById("insertImage");

// List of font options
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

// Initialize editor
const initializer = () => {
  // Attach button highlights
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  // Create font options dynamically
  fontList.forEach((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  // Create font size options (1 to 7)
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  // Set default font size
  fontSizeRef.value = 3;
};

// Function to modify text using document.execCommand
const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

// Attach event listeners for buttons that don't require value parameters
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

// Attach event listeners for buttons that require a value parameter (like color, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

// Handle link creation
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

// Function to save and restore the cursor position
const saveSelection = () => {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
  return null;
};

const restoreSelection = (range) => {
  if (range) {
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

// Event listener for input in the writing area
writingArea.addEventListener("input", () => {
  // Save the current cursor position
  let selectionRange = saveSelection();

  // Check if the content is not already inside a <p> tag
  if (writingArea.children.length === 0 || writingArea.firstChild.tagName !== "P") {
    let text = writingArea.innerHTML;

    // Create a <p> tag and move the content inside it
    let para = document.createElement("p");
    para.innerHTML = text;
    para.contentEditable = true;

    // Clear the writing area and replace it with the new paragraph
    writingArea.innerHTML = "";
    writingArea.appendChild(para);
  }

  // Restore the cursor position after modifying the DOM
  restoreSelection(selectionRange);
});

// Handle image insertion
imageButton.addEventListener("click", () => {
  let imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";

  // File handling for image upload
  imageInput.addEventListener("change", () => {
    let file = imageInput.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        let divImage = document.createElement("p");
        divImage.style.resize = "both";
        divImage.style.overflow = "hidden";
        divImage.style.maxWidth = "100%"
        let img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "100%";
        img.style.minHeight = "33px";
        img.style.minWidth = "80px";
        img.style.height = "100%";
        img.style.resize = "both";
        img.style.overflow = "auto";
         // Ensure image fits within editor
        
        divImage.appendChild(img);
        writingArea.appendChild(divImage);
      };
      reader.readAsDataURL(file);
    }
  });

  // Trigger file input dialog
  imageInput.click();
});

// Function to handle button highlights
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      if (needsRemoval) {
        let alreadyActive = button.classList.contains("active");

        // Remove highlight from other buttons
        highlighterRemover(className);

        // If not active, highlight clicked button
        if (!alreadyActive) {
          button.classList.add("active");
        }
      } else {
        // Toggle active state
        button.classList.toggle("active");
      }
    });
  });
};

// Function to remove active highlight from buttons
const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

// Ensure initializer is only called when the window is fully loaded
window.onload = () => initializer();
