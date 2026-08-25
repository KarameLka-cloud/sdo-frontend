export type EmployeeDirectoryAttributeKey =
  | "cn"
  | "description"
  | "department"
  | "l"
  | "streetaddress"
  | "telephonenumber"
  | "mail";

export interface EmployeeDirectoryEntry {
  cn?: string;
  description?: string;
  department?: string;
  l?: string;
  streetaddress?: string;
  telephonenumber?: string;
  mail?: string;
  thumbnailphoto?: string;
}

export type EmployeeDirectoryAttributes = Record<
  EmployeeDirectoryAttributeKey,
  string
>;

export interface EmployeeDirectorySearchResponse {
  data: EmployeeDirectoryEntry[];
  attributes: EmployeeDirectoryAttributes;
}
