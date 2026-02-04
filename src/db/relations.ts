//DOCS: https://orm.drizzle.team/docs/relations-v2
import { defineRelations } from "drizzle-orm";
import * as schema from "@/db/schema";

export const relations = defineRelations(schema, (r) => ({
  resources: {
    module: r.one.modules({
      from: r.resources.moduleId,
      to: r.modules.id,
    }),
  },
  assignments: {
    module: r.one.modules({
      from: r.assignments.moduleId,
      to: r.modules.id,
    }),
    grades: r.many.gradebook({
      from: r.assignments.id,
      to: r.gradebook.assignmentId,
    }),
  },
  modules: {
    resources: r.many.resources(),
    assignments: r.many.assignments(),
    course: r.one.courses({
      from: r.modules.courseId,
      to: r.courses.id,
    }),
  },
  courses: {
    modules: r.many.modules({
      where: {
        isActive: true,
      },
    }),
    students: r.many.students(),
  },
  students: {
    courses: r.many.courses({
      from: r.students.id.through(r.enrollments.studentId),
      to: r.courses.id.through(r.enrollments.courseId),
    }),
    grades: r.many.gradebook({
      from: r.students.id,
      to: r.gradebook.studentId,
    }),
  },
}));
