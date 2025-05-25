import { createContext, Dispatch, SetStateAction } from "react";
import SongType from "../../../types/Song";
import PlaceType from "../../../types/Place";

type UploadContextType = {
  /** 상단 바 버튼 활성화 여부 */
  buttonEnabled: boolean;
  setButtonEnabled: Dispatch<SetStateAction<boolean>>;
  /** 상단 바 버튼 표시 여부 */
  buttonHidden: boolean;
  setButtonHidden: Dispatch<SetStateAction<boolean>>;
  /** 사용자가 업로드 하려는 영상의 메모리 상 경로 */
  videoPath: string;
  setVideoPath: Dispatch<SetStateAction<string>>;
  /** 영상애서 추출한 썸네일의 메모리 상 경로 */
  thumbnailPath: string;
  setThumbnailPath: Dispatch<SetStateAction<string>>;
  /** 영상 제목 */
  videoTitle: string;
  setVideoTitle: Dispatch<SetStateAction<string>>;
  /** 영상 설명 */
  videoDescription: string;
  setVideoDescription: Dispatch<SetStateAction<string>>;
  /** 영상 길이 */
  videoLength: number;
  setVideoLength: Dispatch<SetStateAction<number>>;
  /** 노래 정보 */
  songInfo: SongType;
  setSongInfo: Dispatch<SetStateAction<SongType>>;
  /** 장소 정보 */
  placeInfo: PlaceType;
  setPlaceInfo: Dispatch<SetStateAction<PlaceType>>;
};

const defaultUploadContext: UploadContextType = {
  buttonEnabled: false,
  setButtonEnabled: function (value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  buttonHidden: false,
  setButtonHidden: function (value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  videoTitle: "",
  setVideoTitle: function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  videoDescription: "",
  setVideoDescription: function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  songInfo: {},
  setSongInfo: function (value: SetStateAction<SongType>): void {
    throw new Error("Function not implemented.");
  },
  placeInfo: {},
  setPlaceInfo: function (value: SetStateAction<PlaceType>): void {
    throw new Error("Function not implemented.");
  },
  videoPath: "",
  setVideoPath: function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  thumbnailPath: "",
  setThumbnailPath: function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  videoLength: 0,
  setVideoLength: function (value: SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
};

/**
 * 비디오 업로드 흐름에 한정되어 사용할 Context
 */
export const UploadContext =
  createContext<UploadContextType>(defaultUploadContext);
