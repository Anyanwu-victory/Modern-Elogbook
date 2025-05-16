import { groq } from "next-sanity";
import { getClient } from "@/sanity/lib/sanity.client";
import { readToken } from "@/sanity/lib/sanity.api";

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`;

// export const settingsQuery = groq`*[_type == "settings"][0]`;

export const facultyQuery = groq`
*[_type == "faculty"] | order(_updatedAt desc)`;

export const departmentQuery = groq`
*[_type == "department"] | order(_updatedAt desc)`;

// sanity.queries.ts

// queries.ts
export const getStudentLogsQuery = (userId: string) => `
  *[_type == "log" && studentId._ref == "user-${userId}"] | order(_createdAt desc) {
    _id,
    _type,
    day,
    date,
    activities,
    status,
    industrySupervisorFeedback,
    institutionSupervisorFeedback,
    industrySupervisorSignature {
      asset->{_id, url}
    }
  }
`;

export const UserRoleQuery = `
  *[_type == "user" && userId == $clerkUserId][0].role
`;

export const AllUsersQuery = groq`
*[_type == "user"] | order(_createdAt desc) {
  _id,
  userId,
  firstName,
  lastName,
  role,
  contact,
  image,
  authStatus,
  createdAt,
  lastLogin,
  studentDetails,
  staffDetails
}
`

export const SubmissionsQuery = groq`*[_type == "log" && industrySupervisor->userId == $userId] | order(_createdAt desc)[0...5] {
  _id,
  title,
  date,
  status,
  student-> {
    name: firstName + " " + lastName,
    matricNumber: studentDetails.matricNo
  }
}`

export const CompanyQuery = groq`
*[_type == "user" && userId == $userId][0] {
  staffDetails {
    organizationName,
    organizationAddress,
    department,
  }
}
`;

export const AssignedStudentsQuery = `
  *[_type == "user" && role == "student" && industrySupervisor._ref == $userId] {
    _id,
    firstName,
    lastName,
    matricNumber,
    level,
    email,
    institutionSupervisor->{
      firstName,
      lastName
    }
  }
`;

export async function getAllFaculties() {
  const client = getClient({ token: readToken });
  const query = `*[_type == "faculty"] | order(name asc) {
    _id,
    name
  }`;
  return await client.fetch(query);
}

export async function getAllDepartments() {
  const client = getClient({ token: readToken });
  const query = `*[_type == "department"] | order(name asc) {
    _id,
    name,
    "facultyName": faculty->name
  }`;
  return await client.fetch(query);
}

// export const indexQuery = groq`
// *[_type == "post"] | order(date desc, _updatedAt desc) {
//   ${postFields}
// }`;

// export const postAndMoreStoriesQuery = groq`
// {
//   "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
//     content,
//     ${postFields}
//   },
//   "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
//     content,
//     ${postFields}
//   }
// }`;

// export const postSlugsQuery = groq`
// *[_type == "post" && defined(slug.current)][].slug.current
// `;

// export const postBySlugQuery = groq`
// *[_type == "post" && slug.current == $slug][0] {
//   ${postFields}
// }
// `;

// export interface Author {
//   name?: string;
//   picture?: any;
// }

// export interface Post {
//   _id: string;
//   title?: string;
//   coverImage?: any;
//   date?: string;
//   _updatedAt?: string;
//   excerpt?: string;
//   author?: Author;
//   slug?: string;
//   content?: any;
// }

// export interface Settings {
//   title?: string;
//   description?: any[];
//   ogImage?: {
//     title?: string;
//   };
// }

export interface Department {
  _id: string;
  name?: string;
  code?: string;
  faculty?: string;
}

export interface Faculty {
  _id: string;
  name?: string;
  code?: string;
}