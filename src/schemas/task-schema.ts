import {extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as yaml from 'yaml';
import * as fs from 'fs';
import path from "node:path";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

/*
  - GET /api/tasks - タスク取得
 */
const TaskResponseSchema = z
.object({
  id: z.string().openapi({ example: '1212121' }),
  name: z.string().openapi({ example: 'Example Task' }),
  completed: z.boolean().openapi({ example: false }),
})
.openapi('Task');

registry.registerPath({
  method: "get",
  path: "/api/tasks",
  tags: ["task"],
  summary: "タスク取得",
  description: "登録されているタスクを返却します",
  request: {},
  responses: {
    200: {
      description: "タスクの取得成功",
      content: {
        "application/json": {
          schema: TaskResponseSchema,
        },
      },
    },
  },
});

/*
 - POST /api/tasks - タスク登録
 */
const CreateTaskSchema = z
.object({
  name: z.string().openapi({ example: 'Example Task' }),
}).openapi('Task');

registry.registerPath({
  method: "post",
  path: "/api/tasks",
  tags: ["task"],
  summary: "タスク登録",
  description: "タスクを登録します",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "タスクの取得成功",
      content: {
        "application/json": {
          schema: TaskResponseSchema,
        },
      },
    },
  },
});

function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
      description: 'This is the API',
    },
    servers: [{ url: 'v1' }],
  });
}

function writeDocumentation() {
  // OpenAPI JSON
  const docs = getOpenApiDocumentation();

  // YAML equivalent
  const fileContent = yaml.stringify(docs);

  const outPath = path.resolve(process.cwd(), "public/openapi-docs.yml");

  fs.writeFileSync(outPath, fileContent, {
    encoding: 'utf-8',
  });
}

writeDocumentation();
