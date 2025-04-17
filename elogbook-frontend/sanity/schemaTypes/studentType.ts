import { defineField, defineType } from "sanity";

export const studentType = defineType({
  name: "student",
  title: "Student",
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
      name: "matricNumber",
      title: "Matriculation Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "100 Level", value: "100" },
          { title: "200 Level", value: "200" },
          { title: "300 Level", value: "300" },
          { title: "400 Level", value: "400" },
          { title: "500 Level", value: "500" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "matricNumber",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `Matric No: ${subtitle || "N/A"}`,
      };
    },
  },
});