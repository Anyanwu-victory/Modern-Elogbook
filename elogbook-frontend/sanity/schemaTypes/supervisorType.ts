import { defineField, defineType } from "sanity";

export const supervisorType = defineType({
  name: "supervisor",
  title: "Supervisor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Supervisor Type",
      type: "string",
      options: {
        list: [
          { title: "Institution Supervisor", value: "institution" },
          { title: "Industry Supervisor", value: "industry" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle === "institution" ? "Institution Supervisor" : "Industry Supervisor",
      };
    },
  },
});