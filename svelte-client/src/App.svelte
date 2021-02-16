<script lang="ts">
  import TodoItem from './components/TodoItem.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let message = '';
  let todos = [];
  let todoText = '';
  const categories = ['work', 'errand', 'personal'];
  let category = '';
  onMount(async () => {
    try {
      const { data } = await axios('http://localhost:4000/api/todos');

      message = data.message;
      todos = data.todos;
    } catch (e) {
      message = e.message;
    }
  });
  const changeHandler = (e) => {
    category = e.target.value;
  };
</script>

<!-- svelte-ignore a11y-no-onchange -->
<main>
  <h1>YANTD :/</h1>
  {#each todos as todo, i}
    <TodoItem {todo} {i} />
  {:else}
    {#if message}
      <p style="font-size: 2.5rem">No Tasks. Start adding items below</p>
    {:else}
      <p>loading...</p>
    {/if}
  {/each}
  <form
    on:submit|preventDefault={async () => {
      try {
        const { data } = await axios.post('http://localhost:4000/api/todos', {
          category,
          todo: todoText,
        });
        todos = data.todos;
        message = data.message;
      } catch (e) {
        message = e.message;
      }
    }}
  >
    <div class="form-group">
      <input
        class="text-input"
        type="text"
        bind:value={todoText}
        placeholder="write a new task"
      />
      <select on:change={(e) => changeHandler(e)}>
        <option>No list</option>
        {#each categories as category}
          <option value={category}> {category}</option>
        {/each}
      </select>
    </div>
    <button class="submit" type="submit">Add Task</button>
  </form>
</main>

<!-- svelte-ignore a11y-no-onchange -->
<style>
  h1 {
    font-size: 4rem;
  }
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  form {
    margin-top: 3rem;
    display: flex;
  }
  .form-group {
    position: relative;
  }
  .text-input {
    font-family: inherit;
    padding: 1rem 3rem;
    border-radius: 0.6rem;
    width: 30rem;
  }
  .text-input:focus + select {
    opacity: 1;
  }
  select:focus {
    opacity: 1;
  }
  select {
    position: absolute;
    left: 20rem;
    top: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.4rem;
    font-family: inherit;
    opacity: 0;
    transition: all 0.2s;
  }
  .submit {
    padding: 1rem 3rem;
    border: none;
    color: var(--white);
    background-color: var(--red);
    font-size: 1.5rem;
    border-radius: 3px;
    font-family: inherit;
    cursor: pointer;
    margin-left: 1rem;
  }
</style>
