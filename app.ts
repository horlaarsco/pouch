import { addRxPlugin } from "rxdb";
import { createRxDatabase } from "rxdb";
import { RxDBServerPlugin } from "rxdb/plugins/server";
import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as dotenv from "dotenv";
import * as express from "express";
addRxPlugin(RxDBServerPlugin);
addRxPlugin(MemoryAdapter);

dotenv.config();

const mySchema = {
  version: 0,
  type: "object",
  properties: {
    key: {
      type: "string",
      primary: true,
    },
    value: {
      type: "string",
    },
  },
};

(async () => {
  const db = await createRxDatabase({
    name: "mydb",
    adapter: "memory",
  });

  await db.collection({
    name: "messages",
    schema: mySchema,
  });

  await db.messages.insert({
    key: "foo",
    value: "bar",
  });

  const { app, server } = db.server({
    startServer: false,
    cors: true,
  });

  const mainApp = express();

  mainApp.use("/", app);
  mainApp.listen(process.env.PORT, () =>
    console.log(`Server listening on port 3000`)
  );

  console.log("Server should run now..." + process.env.PORT);
})().catch((e) => {
  console.error("error on custom code", e);
});
