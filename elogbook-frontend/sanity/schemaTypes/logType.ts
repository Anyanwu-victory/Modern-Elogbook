import { defineField, defineType } from "sanity";

export default defineType({
  name: "log",
  title: "Log",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studentId",
      title: "Student",
      type: "reference",
      to: [{ type: "student" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "activities",
      title: "Activities",
      type: "text",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "skills",
      title: "Skills Learned",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "challenges",
      title: "Challenges Faced",
      type: "text",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "institutionSupervisorFeedback",
      title: "Institution Supervisor Feedback",
      type: "text",
    }),
    defineField({
      name: "industrySupervisorFeedback",
      title: "Industry Supervisor Feedback",
      type: "text",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      student: "studentId.name",
    },
    prepare({ title, subtitle, student }) {
      return {
        title,
        subtitle: `${new Date(subtitle).toLocaleDateString()} - ${student || "Unknown Student"}`,
      };
    },
  },
});