import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  /* Notes: {id} === id: id, name of variable and key in object are the same so we can use 
  shorthand here. The delete method in this context expects to receive an object as its argument. This object
  is typically used to specify which item or items you want to delete from the database.
  Since a "Todo" item is identified by its id, you pass an object with the "id" as the key 
  and the actual ID value as the value. The method looks at the object and uses the "id" to find
  the exact item to remove. Using an object makes your code more flexible. If later on, you need to delete
  based on multiple criteria like "id" and "userId" you can just add more properties to the object .delete({id, userId}) */
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          {/* We're mapping over the array of todos from the todos state, which is an array of objects
      where each object is a todo item, as defined by the Schema */}
          <ul>
            {/*NOTES: map returns a shallow copy of an array. For each "Todo" object in the todos array...
        we display a list of the todo's content from the object in the array and if its clicked on delete it.
        If you go onto the database you can see "content" is one of the keys in the object. 
        Side note: a property in an object is the entire key-value pair. The key is just the name/identifier */}

            {todos.map((todo) => (
              <li onClick={() => deleteTodo(todo.id)} key={todo.id}>
                {todo.content}
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
