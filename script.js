(() => {
  const editor = document.querySelector('#editor');
  const undoBtn = document.querySelector('#undoBtn');
  const redoBtn = document.querySelector('#redoBtn');
  const undoView = document.querySelector('#undoStack');
  const redoView = document.querySelector('#redoStack');
  const undoCount = document.querySelector('#undoCount');
  const redoCount = document.querySelector('#redoCount');
  const charCount = document.querySelector('#charCount');
  const stateLabel = document.querySelector('#stateLabel');
  const historyList = document.querySelector('#historyList');
  let undoStack = [], redoStack = [], lastSavedText = editor.value, timer;

  const preview = text => {
    const value = text.replace(/\s+/g, ' ').trim();
    return value ? (value.length > 36 ? value.slice(0, 36) + '…' : value) : '(empty text)';
  };
  function renderStack(element, stack) {
    element.innerHTML = '';
    if (!stack.length) {
      const empty = document.createElement('div'); empty.className = 'empty-stack'; empty.textContent = 'Stack is empty'; element.appendChild(empty); return;
    }
    stack.slice(-5).forEach((value, index, shown) => {
      const item = document.createElement('div');
      item.className = 'stack-item' + (index === shown.length - 1 ? ' top' : '');
      item.textContent = (index === shown.length - 1 ? 'TOP · ' : '') + preview(value);
      item.title = value || '(empty text)'; element.appendChild(item);
    });
    if (stack.length > 5) { const extra = document.createElement('div'); extra.className = 'stack-foot'; extra.textContent = `+ ${stack.length - 5} older states`; element.appendChild(extra); }
  }
  function updateUI(message = 'Ready for your next edit') {
    renderStack(undoView, undoStack); renderStack(redoView, redoStack);
    undoCount.textContent = `${undoStack.length} item${undoStack.length === 1 ? '' : 's'}`;
    redoCount.textContent = `${redoStack.length} item${redoStack.length === 1 ? '' : 's'}`;
    undoBtn.disabled = !undoStack.length; redoBtn.disabled = !redoStack.length;
    charCount.textContent = `${editor.value.length} character${editor.value.length === 1 ? '' : 's'}`;
    stateLabel.textContent = message;
  }
  function log(type, message) {
    historyList.querySelector('.empty')?.remove();
    const row = document.createElement('li'), time = document.createElement('span'), tag = document.createElement('span'), detail = document.createElement('span');
    time.className = 'history-time'; time.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    tag.className = `history-type ${type.toLowerCase()}`; tag.textContent = type.toUpperCase(); detail.textContent = message;
    row.append(time, tag, detail); historyList.prepend(row);
    while (historyList.children.length > 12) historyList.lastElementChild.remove();
  }
  function saveEdit() {
    if (editor.value === lastSavedText) return;
    undoStack.push(lastSavedText); redoStack = []; lastSavedText = editor.value;
    updateUI('Edit saved to undo stack'); log('Push', 'Saved a text state to the undo stack.');
  }
  editor.addEventListener('input', () => {
    charCount.textContent = `${editor.value.length} characters`; stateLabel.textContent = 'Typing…';
    clearTimeout(timer); timer = setTimeout(saveEdit, 400);
  });
  function undo() {
    clearTimeout(timer); saveEdit(); if (!undoStack.length) return;
    redoStack.push(editor.value); editor.value = undoStack.pop(); lastSavedText = editor.value;
    updateUI('Undo complete — top state popped'); log('Undo', 'Popped the latest state and moved it to the redo stack.');
  }
  function redo() {
    clearTimeout(timer); saveEdit(); if (!redoStack.length) return;
    undoStack.push(editor.value); editor.value = redoStack.pop(); lastSavedText = editor.value;
    updateUI('Redo complete — state restored'); log('Redo', 'Restored a state from the redo stack.');
  }
  undoBtn.addEventListener('click', undo); redoBtn.addEventListener('click', redo);
  editor.addEventListener('keydown', event => {
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === 'z' && !event.shiftKey) { event.preventDefault(); undo(); }
    else if (mod && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))) { event.preventDefault(); redo(); }
  });
  document.querySelector('#clearHistoryBtn').addEventListener('click', () => { historyList.innerHTML = '<li class="empty">Your actions will appear here.</li>'; });
  updateUI('Initial state saved');
})();
