# StackLab — Stack Data Structure Application

StackLab is an interactive browser app demonstrating the stack data structure through Undo and Redo in a text editor.

## Files
- `index.html` — app structure
- `style.css` — visual styling and responsive layout
- `script.js` — stack logic and interactive controls

## Run the app
1. Extract `StackLab.zip`.
2. Open the `StackLab` folder.
3. Double-click `index.html` to launch it in a modern browser.
4. Type text, then use Undo and Redo to see the stack operations.

No installation or build process is required. Internet access is optional and is only used for Google Fonts.

## Stack operations demonstrated
- **Push:** a previous text state is added to the Undo stack after editing.
- **Pop:** Undo removes the most recent state from the Undo stack.
- **Redo:** the current state is pushed to Undo and the latest state is popped from Redo.
- **LIFO:** the last state pushed is the first one removed.

A new edit clears the Redo stack, as common text editors do.
