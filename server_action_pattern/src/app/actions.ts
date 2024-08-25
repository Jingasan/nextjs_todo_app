"use server";

import { PrismaClient, Todo } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * TODO追加のServerAction
 * @param todoTitle 追加対象のTODOタイトル
 * @returns true:成功/false:失敗
 */
export const addTodoAction = async (todoTitle: string): Promise<boolean> => {
  try {
    await prisma.todo.create({
      data: { title: todoTitle },
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

/**
 * TODOリスト取得のServerAction
 * @returns TODOリスト
 */
export async function getTodoListAction(): Promise<Todo[]> {
  try {
    const todoList: Todo[] = await prisma.todo.findMany();
    return todoList;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * TODO状態更新のServerAction
 * @param todo 更新対象のTODO
 * @returns true:成功/false:失敗
 */
export async function updateTodoAction(todo: Todo): Promise<boolean> {
  try {
    await prisma.todo.update({
      where: { id: todo.id },
      data: { completed: !todo.completed },
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * TODO削除のServerAction
 * @param todo 削除対象のTODO
 * @returns true:成功/false:失敗
 */
export async function deleteTodoAction(todo: Todo): Promise<boolean> {
  try {
    await prisma.todo.delete({ where: { id: todo.id } });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
