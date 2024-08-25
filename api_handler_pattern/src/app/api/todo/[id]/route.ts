import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

/**
 * 更新
 * @param request
 * @param params
 * @returns
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { completed }: { completed: boolean } = await request.json();
  // リクエストのidを元にcompletedを反転させる
  const response = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      completed: !completed,
    },
  });
  return Response.json(response);
}

/**
 * 削除
 * @param request
 * @param params
 * @returns
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  // リクエストのidを元に削除
  const response = await prisma.todo.delete({
    where: {
      id,
    },
  });
  return Response.json(response);
}
