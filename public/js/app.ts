document.addEventListener('DOMContentLoaded', () => {
  const nameInput   = document.getElementById('userInput')   as HTMLInputElement;
  const todoInput   = document.getElementById('todoInput')   as HTMLInputElement;
  const addBtn      = document.getElementById('submit-data') as HTMLButtonElement;
  const status      = document.getElementById('status')      as HTMLElement;

  const searchForm  = document.getElementById('search')      as HTMLFormElement;
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const list        = document.getElementById('todoList')    as HTMLUListElement;

  addBtn.addEventListener('click', async () => {
    const res = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameInput.value,
        todo: todoInput.value
      })
    });
    if (res.ok) {
      status.innerText = 'Todo added successfully.';
      todoInput.value = '';
    }
  });

  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const res = await fetch(`/todos/${searchInput.value}`);
    if (!res.ok) return;
    const todos: { todo: string; checked: boolean }[] = await res.json();
    list.innerHTML = '';
    todos.forEach(t => {
      const li    = document.createElement('li');
      const label = document.createElement('label');

      const cb = document.createElement('input');
      cb.type      = 'checkbox';
      cb.className = 'checkBoxes';
      cb.id        = 'myCheckbox';
      cb.checked   = t.checked;
      cb.addEventListener('change', async () => {
        await fetch('/updateTodo', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: searchInput.value,
            todo: t.todo,
            checked: cb.checked
          })
        });
      });

      const span = document.createElement('span');
      const a    = document.createElement('a');
      a.href      = '#';
      a.className = 'delete-task';
      a.innerText = t.todo;
      a.addEventListener('click', async () => {
        await fetch('/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: searchInput.value,
            todo: t.todo
          })
        });
        li.remove();
      });

      span.appendChild(a);
      label.appendChild(cb);
      label.appendChild(span);
      li.appendChild(label);
      list.appendChild(li);
    });
  });
});
