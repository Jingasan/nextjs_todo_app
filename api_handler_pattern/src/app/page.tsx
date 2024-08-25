"use client";
import { Todo } from "@prisma/client";
import { useEffect, useState, MouseEvent, FormEvent } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);

  /**
   * TODOリストの初期表示
   */
  useEffect(() => {
    const getTodo = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`);
      const todoList = await response.json();
      setTodoList(todoList);
    };
    getTodo();
  }, []);

  /**
   * TODOの追加
   * @param event FormEvent
   */
  const addTodo = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputValue) alert("入力してください");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: inputValue }),
    });
    const newTodo = await response.json();

    setTodoList([...todoList, newTodo]);
    setInputValue(null);
  };

  /**
   * TODOの更新
   * @param todo TODO
   */
  const updateTodo = async (todo: Todo) => {
    try {
      const response = await (
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo/${todo.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: todo.completed }),
        })
      ).json();
      setTodoList(
        todoList.map((todo) => {
          if (todo.id === response.id) {
            return response;
          } else {
            return todo;
          }
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * TODOの削除
   * @param e マウスイベント
   * @param todo TODO
   */
  const deleteTodo = async (e: MouseEvent, todo: Todo) => {
    e.preventDefault();
    const response = await (
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo/${todo.id}`, {
        method: "DELETE",
      })
    ).json();
    setTodoList(todoList.filter((todo) => todo.id !== response.id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo</h1>
      {todoList.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between bg-gray-200 p-2 rounded mb-2"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo(todo)}
              className="mr-2"
            />
            <p className={`text-black ${todo.completed ? "line-through" : ""}`}>
              {todo.title}
            </p>
          </div>
          <button
            onClick={(event) => deleteTodo(event, todo)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        </div>
      ))}
      <form
        onSubmit={(event) => addTodo(event)}
        className="flex items-center mt-4"
      >
        <input
          type="text"
          className="border border-gray-400 px-4 py-2 mr-2 rounded text-black"
          value={inputValue || ""}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Todoを入力してください"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </form>
    </div>
  );
}
