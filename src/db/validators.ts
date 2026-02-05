import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import * as schema from "@/db/schema";
import { Table } from "drizzle-orm";

type Validators = {
  [K in keyof typeof schema]: (typeof schema)[K] extends Table
    ? {
        insert: ReturnType<
          typeof createInsertSchema<(typeof schema)[K]>
        >;
        update: ReturnType<
          typeof createUpdateSchema<(typeof schema)[K]>
        >;
      }
    : never;
};

const validators = Object.keys(schema).reduce((acc, key) => {
  const table = (schema as any)[key];

  if (table instanceof Table) {
    acc[key] = {
      insert: createInsertSchema(table),
      update: createUpdateSchema(table),
    };
  }

  return acc;
}, {} as any) as Validators;

export { validators };
