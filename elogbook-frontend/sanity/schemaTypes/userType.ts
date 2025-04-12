import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
      description: "Unique ID from authentication system",
    }),

    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "User Role",
      type: "string",
      options: {
        list: [
          { title: "Student", value: "student" },
          { title: "Institute Supervisor", value: "instituteSupervisor" },
          { title: "Industry Supervisor", value: "industrySupervisor" },
          { title: "ITF Personnel", value: "itfPersonnel" },
          { title: "Admin", value: "admin" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.email().required(),
        }),
        defineField({
          name: "phoneNumber",
          title: "Phone Number",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // Student-specific fields
    defineField({
      name: "studentDetails",
      title: "Student Details",
      type: "object",
      hidden: ({ parent }) => parent?.role !== "student",
      fields: [
        defineField({
          name: "registrationNumber",
          title: "Registration Number",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "faculty",
          title: "Faculty",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "department",
          title: "Department",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "level",
          title: "Level",
          type: "string",
          options: {
            list: ["100", "200", "300", "400", "500"].map((level) => ({
              title: `${level} Level`,
              value: level,
            })),
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // Staff-specific fields (for non-students)
    defineField({
      name: "staffDetails",
      title: "Staff Details",
      type: "object",
      hidden: ({ parent }) => parent?.role === "student",
      fields: [
        defineField({
          name: "idNumber",
          title: "ID Number",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "position",
          title: "Position",
          type: "string",
          hidden: ({ parent }) => parent?.role === "admin",
        }),
      ],
    }),

    defineField({
      name: "authStatus",
      title: "Authentication Status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Verified", value: "verified" },
          { title: "Pending Verification", value: "pending" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "fullName",
      role: "role",
      status: "authStatus",
      media: "image",
      studentId: "studentDetails.registrationNumber",
      staffId: "staffDetails.idNumber",
    },
    prepare(selection) {
      const { title, role, status, media, studentId, staffId } = selection;
      const id = studentId || staffId || 'No ID';
      const roleFormatted = role.charAt(0).toUpperCase() + role.slice(1);
      const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);

      return {
        title: title,
        subtitle: `${roleFormatted} • ${statusFormatted} • ${id}`,
        media: media,
      };
    },
  },
});