"use client";
import { Todo } from "@prisma/client";
import {
  addTodoAction,
  getTodoListAction,
  updateTodoAction,
  deleteTodoAction,
} from "@/app/actions";
import { useEffect, useState, useRef, MouseEvent, FormEvent } from "react";

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * TODOの追加
   * @param formData フォームデータ
   * @returns
   */
  const addTodo = async (formData: FormData) => {
    const todoTitle = `${formData.get("title")}`;
    if (!todoTitle) return;
    if (!todoTitle.trim()) return;
    await addTodoAction(todoTitle);
    if (formRef.current) formRef.current.reset();
    await getTodoList();
  };

  /**
   * TODOリストの取得
   */
  const getTodoList = async () => {
    const res = await getTodoListAction();
    setTodoList(res);
  };

  /**
   * TODOの更新
   * @param todo TODO
   */
  const updateTodo = async (todo: Todo) => {
    await updateTodoAction(todo);
    await getTodoList();
  };

  /**
   * TODOの削除
   * @param e マウスイベント
   * @param todo TODO
   */
  const deleteTodo = async (todo: Todo) => {
    await deleteTodoAction(todo);
    await getTodoList();
  };

  /**
   * TODOリストの初期表示
   */
  useEffect(() => {
    getTodoList();
  }, []);

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
            onClick={() => deleteTodo(todo)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            削除
          </button>
        </div>
      ))}
      <form action={addTodo} ref={formRef} className="flex items-center mt-4">
        <input
          name="title"
          type="text"
          className="border border-gray-400 px-4 py-2 mr-2 rounded text-black"
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
