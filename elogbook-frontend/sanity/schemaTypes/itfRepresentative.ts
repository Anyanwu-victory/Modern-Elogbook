export default {
    name: "itfRepresentative",
    title: "ITF Representative",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "email",
        title: "Email",
        type: "string",
        validation: (Rule) => Rule.required().email(),
      },
      {
        name: "clerkId",
        title: "Clerk ID",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "officeLocation",
        title: "Office Location",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "position",
        title: "Position",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "profileImage",
        title: "Profile Image",
        type: "image",
        options: {
          hotspot: true,
        },
      },
      {
        name: "phoneNumber",
        title: "Phone Number",
        type: "string",
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
        readOnly: true,
      },
      {
        name: "updatedAt",
        title: "Updated At",
        type: "datetime",
        readOnly: true,
      },
    ],
    initialValue: {
      createdAt: new Date().toISOString(),
    },
    preview: {
      select: {
        title: "name",
        subtitle: "position",
      },
    },
  }
  