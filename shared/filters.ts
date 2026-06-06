export const STAGE_SORT = {
  LATEST: "latest",
  POPULAR: "popular",
} as const;

export type StageSort = (typeof STAGE_SORT)[keyof typeof STAGE_SORT];
