import { QueResourceAPI } from "../interfaces";
import mockVideoCardData from "../../../potato/mockData/VideoCardData";

let lastIndex = 0;

const getTestVideoCardData = async (per: number, page: number) => {
  let start = 0;
  if (page == 0) {
    lastIndex = 0;
  } else {
    start = lastIndex;
  }
  lastIndex += per;
  return mockVideoCardData.slice(start, lastIndex);
};

const TestApiClient = {
  getVideoDownloadURL: async (storageURL: string) => {
    return "https://firebasestorage.googleapis.com/v0/b/que-backend-dev.appspot.com/o/testvideo.mp4?alt=media&token=92554770-0ef5-4e1f-8ee8-21b70f29dc53";
  },
  getImageDownloadURL: async (storageURL: string) => {
    return "https://firebasestorage.googleapis.com/v0/b/que-backend-dev.appspot.com/o/users%2FD6aaATPLmub8NMZGVcd9KrHEGzU2%2Fvideos%2Fpha8C9I05D3ifOYEpGdT%2Fthumbnail?alt=media&token=f2d4da20-ff9d-481e-a060-129cc421645b";
  },
  getVideoCardData: getTestVideoCardData,
};

export default TestApiClient;
