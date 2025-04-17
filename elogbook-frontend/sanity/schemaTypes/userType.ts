import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    // Clerk UID
    defineField({
      name: "userId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),

    // Split full name
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "User Role",
      type: "string",
      validation: (Rule) => Rule.required(),
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
    }),

    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),

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

    defineField({
      name: "studentDetails",
      title: "Student Details",
      type: "object",
      hidden: ({ parent }) => parent?.role !== "student",
      fields: [
        defineField({ name: "registrationNumber", title: "Registration Number", type: "string", validation: Rule => Rule.required() }),
        defineField({ name: "faculty", title: "Faculty", type: "string", validation: Rule => Rule.required() }),
        defineField({ name: "department", title: "Department", type: "string", validation: Rule => Rule.required() }),
        defineField({
          name: "level",
          title: "Level",
          type: "string",
          options: {
            list: ["100", "200", "300", "400", "500"].map((l) => ({
              title: `${l} Level`,
              value: l,
            })),
          },
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "staffDetails",
      title: "Staff Details",
      type: "object",
      hidden: ({ parent }) => parent?.role === "student",
      fields: [
        defineField({ name: "idNumber", title: "ID Number", type: "string", validation: Rule => Rule.required() }),
        defineField({
          name: "position",
          title: "Position",
          type: "string",
          hidden: ({ parent }) => parent?.role === "admin", // no position for admin
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
});
