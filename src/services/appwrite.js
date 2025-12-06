import { Client, Account, Databases, Functions } from "appwrite";

const config = {
  stub: 'eck_ben',          // fake1, eck_ben, or false
  stubPause: 1,         // 2000 or 1
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  functionId: import.meta.env.VITE_APPWRITE_FUNCTION_ID,
  dbId: import.meta.env.VITE_APPWRITE_DB_ID,
  collIds: {
    users: import.meta.env.VITE_APPWRITE_COL_USERS,
    scanners: import.meta.env.VITE_APPWRITE_COL_SCANNERS,
    samples: import.meta.env.VITE_APPWRITE_COL_SAMPLES,
    fields: import.meta.env.VITE_APPWRITE_COL_FIELDS,
    plants: import.meta.env.VITE_APPWRITE_COL_PLANTS
  },
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const database = new Databases(client);
const functions = new Functions(client);

export { account, client, config, database, functions };