import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import * as schema from "@/db/schema";
import { Table } from "drizzle-orm";

type Validators = {
  [K in keyof typeof schema as (typeof schema)[K] extends Table
    ? K
    : never]: {
    insert: ReturnType<
      typeof createInsertSchema<(typeof schema)[K]>
    >;
    update: ReturnType<
      typeof createUpdateSchema<(typeof schema)[K]>
    >;
  };
};

const tmp: Record<string, any> = {};

for (const [key, table] of Object.entries(schema)) {
  if (table instanceof Table) {
    tmp[key] = {
      insert: createInsertSchema(table),
      update: createUpdateSchema(table),
    };
  }
}

const validators = tmp as Validators;

export { validators };
