import * as dotenv from "dotenv";
import express from "express";
import { createRxDatabase, addRxPlugin } from "rxdb";
import { RxDBServerPlugin } from "rxdb/plugins/server";
import * as MemoryAdapter from "pouchdb-adapter-memory";

addRxPlugin(RxDBServerPlugin);
addRxPlugin(MemoryAdapter);
dotenv.config();

const mySchema = {
  version: 0,
  type: "object",
  properties: {
    todo: {
      type: "string",
    },
    status: {
      type: "boolean",
    },
  },
};

(async () => {
  const db = await createRxDatabase({
    name: "mydb",
    adapter: "memory",
  });

  await db.collection({
    name: "todo",
    schema: mySchema,
  });

  await db.todo.insert({
    todo: "Eat",
    status: true,
  });

  const { app, server } = db.server({
    startServer: false,
    cors: true,
    pouchdbExpressOptions: {
      inMemoryConfig: true,
    },
  });

  const mainApp = express();

  mainApp.use("/", app);
  mainApp.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`)
  );
})().catch((e) => {
  console.error("error on custom code", e);
});
