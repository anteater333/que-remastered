import { create } from "zustand";

export type UploadStatus = "idle" | "uploading" | "encoding" | "done" | "error";

export interface UploadSceneState {
  stageId: string | null;
  file: File | null;
  thumbnail: string | null;
  status: UploadStatus;
  progress: number;
  error: string | null;
}

interface UploadSceneActions {
  setFile: (file: File) => void;
  startUpload: (stageId: string, file: File, thumbnail: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: UploadStatus) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState: UploadSceneState = {
  stageId: null,
  file: null,
  thumbnail: null,
  status: "idle",
  progress: 0,
  error: null,
};

export const useUploadSceneStore = create<
  UploadSceneState & UploadSceneActions
>((set) => ({
  ...initialState,
  setFile: (file) => set({ file }),
  startUpload: (stageId, file, thumbnail) =>
    set({
      stageId,
      file,
      thumbnail: thumbnail,
      status: "uploading",
      progress: 0,
      error: null,
    }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ status: "error", error }),
  reset: () => set(initialState),
}));
