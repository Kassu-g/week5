document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name')    as HTMLInputElement;
  const todoInput = document.getElementById('newTodo') as HTMLInputElement;
  const addBtn    = document.getElementById('addBtn')  as HTMLButtonElement;
  const status    = document.getElementById('status') as HTMLElement;

  const searchName = document.getElementById('searchName') as HTMLInputElement;
  const searchBtn  = document.getElementById('searchBtn')  as HTMLButtonElement;
  const list       = document.getElementById('todoList')  as HTMLUListElement;

  addBtn.addEventListener('click', async () => {
    const res = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value, todo: todoInput.value })
    });
    if (res.ok) {
      status.innerText = 'Todo added successfully.';
      todoInput.value = '';
    }
  });

  searchBtn.addEventListener('click', async () => {
    const res = await fetch(`/todos/${searchName.value}`);
    if (!res.ok) return;
    const todos: { todo: string; checked: boolean }[] = await res.json();
    list.innerHTML = '';
    todos.forEach(t => {
      const li    = document.createElement('li');
      const label = document.createElement('label');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'checkBoxes';
      cb.checked = t.checked;
      cb.id = 'myCheckbox';
      cb.addEventListener('change', async () => {
        await fetch('/updateTodo', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: searchName.value, todo: t.todo, checked: cb.checked })
        });
      });

      const span = document.createElement('span');
      const a    = document.createElement('a');
      a.href = '#';
      a.className = 'delete-task';
      a.innerText = t.todo;
      a.addEventListener('click', async () => {
        await fetch('/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: searchName.value, todo: t.todo })
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
