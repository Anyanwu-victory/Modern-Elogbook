import { defineField, defineType } from "sanity";

export const logType= defineType({
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
      to: [
        {
          type: "user",
          // Filter to only show users with role "student"
          options: {
            filter: 'role == $role',
            filterParams: { role: 'student' },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField(
      {
        name: 'day',
        title: 'Day of Week',
        type: 'string',
        options: {
          list: [
            {title: 'Monday', value: 'Monday'},
            {title: 'Tuesday', value: 'Tuesday'},
            {title: 'Wednesday', value: 'Wednesday'},
            {title: 'Thursday', value: 'Thursday'},
            {title: 'Friday', value: 'Friday'},
            {title: 'Saturday', value: 'Saturday'}
            // ... other days
          ],
        },
        validation: Rule => Rule.required(),
      },
    ),    
    // In your logType schema
    defineField({
      name: "weekNumber",
      title: "Week Number",
      type: "number",
      description: "Week of the year (1-52)",
      validation: (Rule) => Rule.required().min(1).max(52),
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
      name: "image",
      title: "Image",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            accept: 'image/*',
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
          { title: "Reviewed", value: "reviewed" },
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
      name: "industrySupervisorSignature",
      title: "Industry Supervisor Signature",
      type: "image",
      options: {
        hotspot: true,
      },
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