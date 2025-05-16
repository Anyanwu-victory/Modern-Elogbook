import {defineField, defineType} from "sanity";

export const visitType = defineType ({

        name: "visit",
        title: "Visit",
        type: "document",
        fields: [
          defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "startDateTime",
            title: "Start Date & Time",
            type: "datetime",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "endDateTime",
            title: "End Date & Time",
            type: "datetime",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "visitType",
            title: "Visit Type",
            type: "string",
            options: {
              list: [
                { title: "Institution Visit", value: "institution" },
                { title: "Industry Visit", value: "industry" },
                { title: "ITF Visit", value: "itf" },
              ],
            },
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "location",
            title: "Location",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "company",
            title: "Company",
            type: "reference",
            to: [{ type: "company" }],
          }),
          defineField({
            name: "supervisor",
            title: "Institution Supervisor",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) =>
              Rule.custom((supervisor, context) => {
                // Only validate if we have a supervisor
                if (!supervisor) return true
      
                // Check if the referenced user is an institution supervisor
                // This would need to be implemented based on your data structure
                return true
              }),
          }),
          defineField({
            name: "students",
            title: "Students",
            type: "array",
            of: [
              {
                type: "reference",
                to: [{ type: "user" }],
                validation: (Rule) =>
                  Rule.custom((student, context) => {
                    // Only validate if we have a student
                    if (!student) return true
      
                    // Check if the referenced user is a student
                    // This would need to be implemented based on your data structure
                    return true
                  }),
              },
            ],
            validation: (Rule) => Rule.required().min(1),
          }),
          defineField({
            name: "notes",
            title: "Notes",
            type: "text",
          }),
          defineField({
            name: "createdBy",
            title: "Created By",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            readOnly: true,
          }),
          defineField({
            name: "updatedAt",
            title: "Updated At",
            type: "datetime",
            readOnly: true,
          }),
        ],
        initialValue: {
          createdAt: new Date().toISOString(),
        },
        preview: {
          select: {
            title: "title",
            subtitle: "visitType",
            date: "startDateTime",
          },
          prepare({ title, subtitle, date }) {
            return {
              title,
              subtitle: `${subtitle} - ${new Date(date).toLocaleDateString()}`,
            }
          },
        },
      
}) 
  