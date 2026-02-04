import { eq, sql } from "drizzle-orm";
import {
  pgTable,
  numeric,
  integer,
  bigint,
  boolean,
  timestamp,
  varchar,
  text,
  index,
  pgEnum,
  date,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

//-------------Reusable-------------
const id = integer("id")
  .primaryKey()
  .generatedAlwaysAsIdentity();
const createdAt = timestamp("created_at", {
  withTimezone: true,
  mode: "string",
})
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", {
  withTimezone: true,
  mode: "string",
})
  .notNull()
  .defaultNow()
  .$onUpdate(() => sql`now()`);

const courseTypes = ["core", "elective"] as const;

//-------------Tables-------------
const students = pgTable(
  "students",
  {
    id,
    first: varchar("first_name", { length: 100 }).notNull(),
    last: varchar("last_name", { length: 100 }).notNull(),
    parentId: varchar("parent_id", {
      length: 255,
    }).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [index("students_parent_idx").on(t.parentId)],
);

/*
--------------IMPORTANT--------------
Since courses are reusable, modules and 
assignments must persist since they might 
be referenced in the gradebook. However, 
the system will allow a user to delete 
them after several warnings. Hence the 
'onDelete: "cascade"' on foreign keys.
*/
const courses = pgTable(
  "courses",
  {
    id,
    name: varchar("name", {
      length: 100,
    }).notNull(),
    description: text("description").notNull(),
    subject: varchar("subject", { length: 100 }).notNull(),
    type: pgEnum("type", courseTypes)()
      .notNull()
      .default("core"),
    credits: integer("credits").notNull().default(1),
    parentId: varchar("parent_id", {
      length: 255,
    }).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [index("courses_parent_idx").on(t.parentId)],
);

const modules = pgTable(
  "modules",
  {
    id,
    name: varchar("name", {
      length: 100,
    }).notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id")
      .references(() => courses.id, { onDelete: "cascade" })
      .notNull(),
    isVisible: boolean("is_visible")
      .notNull()
      .default(true),
    isActive: boolean("is_active").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (t) => [index("modules_course_idx").on(t.courseId)],
);

const assignments = pgTable(
  "assignments",
  {
    id,
    name: varchar("name", {
      length: 100,
    }).notNull(),
    description: text("description").notNull(),
    totalPoints: integer("total_points").notNull(),
    type: varchar("type", { length: 50 })
      .notNull()
      .default("homework"),
    moduleId: integer("module_id")
      .references(() => modules.id, { onDelete: "cascade" })
      .notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (t) => [index("assignments_module_idx").on(t.moduleId)],
);

const resources = pgTable(
  "resources",
  {
    id,
    name: varchar("name", { length: 100 }).notNull(),
    bucketKey: text("bucket_key").notNull(),
    fileType: varchar("fileType", { length: 50 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", {
      mode: "number",
    }).notNull(),
    moduleId: integer("module_id")
      .references(() => modules.id, { onDelete: "cascade" })
      .notNull(),
    createdAt,
  },
  (t) => [index("resources_module_idx").on(t.moduleId)],
);

const enrollments = pgTable(
  "enrollments",
  {
    id,
    studentId: integer("student_id")
      .references(() => students.id, {
        onDelete: "cascade",
      })
      .notNull(),
    courseId: integer("course_id")
      .references(() => courses.id, { onDelete: "cascade" })
      .notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (t) => [
    uniqueIndex("enrollments_student_idx")
      .on(t.studentId, t.courseId)
      .where(eq(t.isActive, true)),
    index("enrollments_course_idx")
      .on(t.courseId)
      .where(eq(t.isActive, true)),
  ],
);

const gradebook = pgTable(
  "gradebook",
  {
    id,
    studentId: integer("student_id")
      .references(() => students.id, {
        onDelete: "cascade",
      })
      .notNull(),
    assignmentId: integer("assignment_id")
      .references(() => assignments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    earned: numeric({ precision: 5, scale: 2 }).notNull(),
    possible: integer("possible").notNull(),
    feedback: text("feedback"),
    createdAt,
    updatedAt,
  },
  (t) => [
    unique("gradebook_unique_studentAssignment").on(
      t.studentId,
      t.assignmentId,
    ),
  ],
);

export {
  students,
  courses,
  modules,
  assignments,
  resources,
  gradebook,
  enrollments,
};
