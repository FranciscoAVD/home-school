import {
  students,
  courses,
  modules,
  assignments,
  resources,
  gradebook,
  enrollments,
} from "@/db/schema";

export namespace Schema {
  export namespace Students {
    export type Select = typeof students.$inferSelect;
    export type Insert = typeof students.$inferInsert;
  }
  export namespace Courses {
    export type Select = typeof courses.$inferSelect;
    export type Insert = typeof courses.$inferInsert;
  }
  export namespace Modules {
    export type Select = typeof modules.$inferSelect;
    export type Insert = typeof modules.$inferInsert;
  }
  export namespace Assignments {
    export type Select = typeof assignments.$inferSelect;
    export type Insert = typeof assignments.$inferInsert;
  }
  export namespace Resources {
    export type Select = typeof resources.$inferSelect;
    export type Insert = typeof resources.$inferInsert;
  }
  export namespace Enrollments {
    export type Select = typeof enrollments.$inferSelect;
    export type Insert = typeof enrollments.$inferInsert;
  }
  export namespace Grades {
    export type Select = typeof gradebook.$inferSelect;
    export type Insert = typeof gradebook.$inferInsert;
  }
}
