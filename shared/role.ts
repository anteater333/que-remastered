export const QUE_USER_ROLE = {
  OWNER: "OWNER",
  USER: "USER",
} as const;

export type QueUserRole = (typeof QUE_USER_ROLE)[keyof typeof QUE_USER_ROLE];
