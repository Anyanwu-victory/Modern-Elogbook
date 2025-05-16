import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { facultyType } from "./facultyType";
import { departmentType } from "./departmentType";
import { logType } from "./logType";
import { userType } from "./userType";
import { supervisorType } from "./supervisorType";
import {weeklyReportType} from "./weeklyReportType";
import {visitType} from "./visitType";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    logType,
    facultyType,
    weeklyReportType,
    departmentType,
    userType,
    supervisorType,
    
  ],
};
