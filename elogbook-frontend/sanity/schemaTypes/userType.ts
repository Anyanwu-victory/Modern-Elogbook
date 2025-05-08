import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import type { Rule } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "userId",
      title: "Clerk User ID",
      type: "string",
      description: "Unique identifier from Clerk authentication",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),

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

    defineField({
      name: "role",
      title: "User Role",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Student", value: "student" },
          { title: "Institution Supervisor", value: "institution_supervisor" },
          { title: "Industry Supervisor", value: "industry_supervisor" },
          { title: "ITF Personnel", value: "itf" },
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

    // Student-specific details
    defineField({
      name: "studentDetails",
      title: "Student Details",
      type: "object",
      hidden: ({ parent }) => parent?.role !== "student",
      fields: [
        defineField({ name: "faculty", title: "Faculty", type: "string" }),
        defineField({ name: "department", title: "Department", type: "string" }),
        defineField({ name: "course", title: "Course", type: "string" }),
        defineField({ name: "level", title: "Level", type: "string" }),
        defineField({ name: "matricNo", title: "Matric Number", type: "string" }),
        defineField({ name: "organizationName", title: "Organization Name", type: "string" }),
        defineField({ name: "organizationAddress", title: "Organization Address", type: "string" }),
        defineField({ name: "supervisorName", title: "Supervisor Name", type: "string" }),
        defineField({ name: "supervisorEmail", title: "Supervisor Email", type: "string" }),
        defineField({ name: "startDate", title: "Start Date", type: "date" }),
        defineField({ name: "endDate", title: "End Date", type: "date" }),
      ],
    }),

    // Staff-related details (industry, institution, ITF, admin)
    defineField({
      name: "staffDetails",
      title: "Staff Details",
      type: "object",
      hidden: ({ parent }) => !['industry_supervisor', 'institution_supervisor', 'itf', 'admin'].includes(parent?.role),
      fields: [
        defineField({ name: "staffId", title: "Staff ID", type: "string" }),
        defineField({ name: "organizationName", title: "Organization Name", type: "string", hidden: ({ parent }) => parent?.role === "institution_supervisor" }),
        defineField({ name: "department", title: "Department", type: "string", hidden: ({ parent }) => parent?.role === "admin" }),
        defineField({ name: "section", title: "Section", type: "string", hidden: ({ parent }) => parent?.role !== "industry_supervisor" }),
        defineField({ name: "position", title: "Position", type: "string", hidden: ({ parent }) => parent?.role !== "institution_supervisor" }),
        defineField({ name: "officeLocation", title: "Office Location", type: "string", hidden: ({ parent }) => parent?.role !== "itf" }),
        defineField({ name: "faculty", title: "Faculty", type: "string", hidden: ({ parent }) => parent?.role !== "admin" }),
        defineField({ name: "signature", title: "Signature", type: "image", hidden: ({ parent }) => parent?.role === "student" }),
      ],
    }),

    defineField({
      name: "authStatus",
      title: "Authentication Status",
      type: "string",
      readOnly: true,
      hidden: ({ parent }) => parent?.role === "admin",
      initialValue: ({ parent }) => parent?.role === "admin" ? "verified" : "pending",
      options: {
        list: [
          { title: "Verified", value: "verified" },
          { title: "Pending Verification", value: "pending" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "dropdown",
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
