<script lang="ts">
  import { categoryClasses } from '../helpers/categoriesClasses';
  import type { TodoFields } from '../types/todo';
  import axios from 'axios';
  export let todo: TodoFields;
  export let i: number;
  const { category, todo: todoItem, finished } = todo;
  const toggleHandler = async (event, i) => {
    event.target.checked
      ? axios
          .put(`http://localhost:4000/api/todos/${todo.id}`, { finished: true })
          .then((_) => {
            document.getElementById(`${i.toString()}`).style.textDecoration =
              'line-through';
          })
          .catch((e) => alert(e.message))
      : axios
          .put(`http://localhost:4000/api/todos/${todo.id}`, {
            finished: false,
          })
          .then((_) => {
            document.getElementById(`${i.toString()}`).style.textDecoration =
              'none';
          })
          .catch((e) => alert(e.message));
  };
</script>

<div class="todo-item">
  <div class="check-text">
    <input
      type="checkbox"
      checked={finished}
      on:input={(event) => toggleHandler(event, i)}
      class="checkbox"
    />

    <p
      style={finished ? 'text-decoration: line-through' : ''}
      id={i.toString()}
    >
      {todoItem}
    </p>
  </div>
  <span
    class="todoicon"
    style="border: .3rem solid {categoryClasses(category.toLowerCase())}"
  />
</div>

<style>
  .todo-item {
    margin-top: 1.5rem;
    width: 60%;
    padding: 2rem;
    background-color: var(--white);
    display: grid;
    align-items: center;
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
    font-family: 'Caveat', cursive;
    border-radius: 0.8rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.4);
  }
  .checkbox {
    margin-top: 1rem;
  }
  p {
    font-size: 2.5rem;
    white-space: nowrap;
    margin-left: 1rem;
    /* text-decoration: line-through; */
  }
  .check-text {
    display: flex;
  }
  .todoicon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.5rem;
    grid-column: -1;
  }
</style>
