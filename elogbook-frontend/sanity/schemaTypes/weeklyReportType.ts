import { defineField, defineType } from "sanity";


// schemas/weeklyReport.ts
export const weeklyReportType = defineType({
    name: "weeklyReport",
    title: "Weekly Report",
    type: "document",
    fields: [
      defineField({
        name: "student",
        type: "reference",
        to: [{ type: "user" }],
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "matriNo",
        type: "reference",
        to: [{ type: "user" }],
        options: {
          filter: 'role == "student"',
        },
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "weekNumber",
        type: "number",
        validation: (Rule) => Rule.required().min(1).max(52),
      }),
      defineField({
        name: "year",
        type: "number",
        initialValue: new Date().getFullYear(),
      }),
      defineField({
        name: "logs",
        type: "array",
        of: [{ type: "reference", to: [{ type: "log" }] }],
      }),
      defineField({
        name: "summary",
        type: "text",
        description: "Weekly summary of activities",
      }),
      defineField({
        name: "industrySupervisorFeedback",
        type: "text",
      }),
      defineField({
        name: "institutionSupervisorFeedback",
        type: "text",
      }),
      defineField({
        name: "status",
        type: "string",
        options: {
          list: [
            { title: "Draft", value: "draft" },
            { title: "Submitted", value: "submitted" },
            { title: "Approved", value: "approved" },
          ],
        },
        initialValue: "draft",
      }),
    ],
  });