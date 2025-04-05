import {
  orderBy,
  getDocs,
  getDoc,
  query,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
  setDoc,
  increment,
  deleteField,
  deleteDoc,
  where,
  QueryConstraint,
} from "firebase/firestore";

import { VideoCollection, UserCollection } from "./collections";

import VideoType from "../../../types/Video";
import UserType from "../../../types/User";
import {
  QueResourceResponse,
  QueResourceResponseErrorType,
  MAX_VIDEO_LIKE_LIMIT,
} from "../../interfaces";
import firebaseConfig from "../config";
import LikeType, { LikeTypeSelector } from "../../../types/Like";
import { getCurrentUID } from "../auth/auth";
import { genSimpleUUID } from "../../../utils/generator";

/** 페이지네이션에 사용할 마지막 문서 메모 */
let lastDocument: QueryDocumentSnapshot<VideoType>;

// TBD ID로 비디오 정보 불러오는 API

export async function getVideoCardDataByUserIdFromFirestore(
  userId: string,
  per: number,
  page: number
) {
  /** Building queries */
  const queryConstraintsArray: QueryConstraint[] = [
    orderBy("uploadedAt", "desc"),
    limit(per),
  ];

  if (page == 1) {
    queryConstraintsArray.push(startAfter(lastDocument));
  }
  if (userId) {
    const userDocRef = doc(UserCollection, userId);
    queryConstraintsArray.push(where("uploader", "==", userDocRef));
  }

  const videoCardQuery = query(VideoCollection, ...queryConstraintsArray);

  try {
    // 쿼리를 통해 문서 스냅샷 생성
    const querySnapshot = await getDocs(videoCardQuery);
    if (querySnapshot.docs.length)
      lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1]; // 마지막 문서 업데이트

    // 반환할 데이터셋 제작
    const rtDataset: VideoType[] = [];
    for await (const doc of querySnapshot.docs) {
      const wholeData = doc.data();

      /** 비디오 카드에 필요한 데이터만 추출 */
      const filteredData: VideoType = {
        ...doc.data(),
        uploadedAt: timestampToDate(wholeData.uploadedAt),
      };
      filteredData.videoId = doc.id;

      // 사용자 데이터 생성
      if (filteredData.uploader) {
        const uploaderData = await getDoc<UserType>(filteredData.uploader);
        filteredData.uploader = uploaderData.data();
        (filteredData.uploader as Partial<UserType>).userId = uploaderData.id;
      }

      // // 리액션 관련 데이터 생성 (TBD)
      // filteredData.viewed = false;
      // filteredData.likedData = [];
      // filteredData.starredData = {};

      // 정제한 데이터 추가
      rtDataset.push(filteredData);
    }

    return rtDataset;
  } catch (error) {
    console.error(error);

    return [];
  }
}

/**
 * 파이어스토어에 접근해 비디오 카드에 사용할 데이터를 가져옴.
 * Firestore Client side SDK는 offset 기능을 지원하지 않기 때문에 page 변수는 제대로 작동하지 않습니다.
 * @param per 한 번에 가저올 데이터 수
 * @param page 페이지 수(0일 경우 초기화, 1일 경우 다음 페이지)
 * @returns
 */
export async function getVideoCardDataFromFirestore(
  per: number,
  page: number
): Promise<VideoType[]> {
  return await getVideoCardDataByUserIdFromFirestore("", per, page);
}

/**
 * userId를 입력받아 특정 유저에 대한 프로필 데이터를 가져옴
 * @param userId
 * @returns
 */
export async function getUserProfile(
  userId: string
): Promise<QueResourceResponse<UserType>> {
  try {
    const userDataSnap = await getDoc<UserType>(doc(UserCollection, userId));

    if (!userDataSnap.exists()) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.NotFound,
      };
    } else {
      return {
        success: true,
        payload: { userId: userId, ...userDataSnap.data() },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorType: QueResourceResponseErrorType.UndefinedError,
    };
  }
}

/**
 * 현재 유저의 프로필을 업데이트
 * 어차피 사용자가 수정할 수 있는 유저 프로필은 자기 자신밖에 없습니다.
 */
export async function updateCurrentUserProfile(
  updateData: UserType
): Promise<QueResourceResponse> {
  const currentUid = getCurrentUID();
  if (!currentUid) {
    // 로그인 해주세요
    return {
      success: false,
      errorType: QueResourceResponseErrorType.SignInRequired,
    };
  }

  try {
    let savedDoc: UserType = {};
    if (
      !updateData.description ||
      !updateData.nickname ||
      !updateData.profilePictureUrl
    ) {
      const docResult = await getUserProfile(currentUid);
      savedDoc = docResult.payload ? docResult.payload : {};
    }

    await updateDoc<UserType>(doc(UserCollection, currentUid), {
      description: updateData.description
        ? updateData.description
        : savedDoc.description
        ? savedDoc.description
        : "",
      nickname: updateData.nickname
        ? updateData.nickname
        : savedDoc.nickname
        ? savedDoc.nickname
        : "",
      profilePictureUrl: updateData.profilePictureUrl
        ? updateData.profilePictureUrl
        : savedDoc.profilePictureUrl
        ? savedDoc.profilePictureUrl
        : "",
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorType: QueResourceResponseErrorType.UndefinedError,
    };
  }

  return { success: true };
}

/**
 * 새 사용자 가입 시 Document를 직접 생성합니다.
 * 본디 firebase blaze 요금제 사용 시 function으로 구현한 기능이었는데,
 * spark 요금제 사용함으로써 여기서 구현해 사용합니다.
 */
export async function setUserDocument(
  uid: string,
  email: string,
  registeredAt: string,
  nickname: string | null
) {
  try {
    await setDoc<UserType>(doc(UserCollection, uid), {
      email: email,
      registeredAt: new Date(registeredAt),
      nickname: nickname ? nickname : "",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 비디오 메타 정보를 입력합니다.
 * TBD 필요하지 않은 데이터가 초기에 생성되는지 파악하기
 * @param videoData 비디오 정보
 * @param videoId 비디오 아이디, 비디오 아이디가 전달되지 않으면 새 문서 생성
 */
export async function setVideoDocument(
  videoData: VideoType,
  videoId?: string
): Promise<string> {
  try {
    if (!videoId) {
      const currentUid = getCurrentUID();
      const videoDocRef = doc(VideoCollection);
      const videoId = videoDocRef.id;

      const storagePathPrefix = "gs://" + firebaseConfig.storageBucket + "/";
      await setDoc<VideoType>(videoDocRef, {
        ...videoData,
        sourceUrl:
          storagePathPrefix + `users/${currentUid}/videos/${videoId}/video`,
        thumbnailUrl:
          storagePathPrefix + `users/${currentUid}/videos/${videoId}/thumbnail`,
        uploadedAt: new Date(),
        uploadDone: false,
        uploader: doc(UserCollection, currentUid),
      });

      return videoDocRef.id;
    } else {
      // TBD 인증 blocking, 내 영상만 수정할 수 있도록 하기
      const videoDocRef = doc(VideoCollection, videoId);
      await setDoc<VideoType>(videoDocRef, videoData, { merge: true });

      return videoDocRef.id;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** 별 큰 의미 없는 래핑 함수 */
export async function updateVideoDocument(
  videoId: string,
  newVideoData: VideoType
): Promise<QueResourceResponse> {
  const currentUid = getCurrentUID();
  if (!currentUid) {
    return {
      success: false,
      errorType: QueResourceResponseErrorType.SignInRequired,
    };
  }

  try {
    await setVideoDocument(newVideoData, videoId);
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorType: QueResourceResponseErrorType.UndefinedError,
    };
  }
}

export async function getVideoDocument(
  videoId: string
): Promise<QueResourceResponse<VideoType>> {
  try {
    const videoDataSnap = await getDoc<VideoType>(
      doc(VideoCollection, videoId)
    );

    if (!videoDataSnap.exists()) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.NotFound,
      };
    } else {
      const snapData = videoDataSnap.data();
      const uploaderDataSnap = await getDoc<UserType>(snapData.uploader);
      const uploaderData = uploaderDataSnap.data();
      const uploadedAtDate = timestampToDate(snapData.uploadedAt);
      const rtVideoData: VideoType = {
        videoId: videoId,
        ...snapData,
        uploadedAt: uploadedAtDate,
        uploader: {
          userId: uploaderDataSnap.id,
          nickname: uploaderData?.nickname,
          profilePictureUrl: uploaderData?.profilePictureUrl,
        } as UserType,
      };
      return {
        success: true,
        payload: rtVideoData,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errorType: QueResourceResponseErrorType.UndefinedError,
    };
  }
}

/** 비디오 문서를 삭제합니다. */
export async function deleteVideoDocument(
  videoId: string
): Promise<QueResourceResponse> {
  try {
    /** 비디오 도큐먼트 레퍼런스 */
    const videoDocRef = doc(VideoCollection, videoId);
    /** 비디오 도큐먼트 스냅샷 */
    const videoDocSnap = await getDoc<VideoType>(videoDocRef);
    if (!videoDocSnap.exists()) {
      // 해당 영상 정보 없음
      return {
        success: false,
        errorType: QueResourceResponseErrorType.NotFound,
      };
    }
    /** 스냅샷으로부터 추출한 데이터 */
    const snapData = videoDocSnap.data();

    const currentUid = getCurrentUID();
    if (!currentUid) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.SignInRequired,
      };
    }

    // 사용자의 영상이 맞는지 판단
    const uploaderDataSnap = await getDoc<UserType>(snapData.uploader);
    if (currentUid !== uploaderDataSnap.id) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.Wrong, // Not my video
      };
    }

    await deleteDoc(videoDocRef);

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
}

/** 비디오 업로드 완료 여부를 업데이트합니다. */
export async function updateVideoUploaded(videoId: string, isDone: boolean) {
  try {
    await updateDoc(doc(VideoCollection, videoId), {
      uploadDone: isDone,
    });
  } catch (error) {
    throw error;
  }
}

/** 해당 대상에 대한 사용자의 좋아요 목록을 가져옵니다. */
export async function getMyLikeReactions(
  likeType: LikeTypeSelector,
  targetId: string
): Promise<QueResourceResponse<LikeType[]>> {
  try {
    const currentUid = getCurrentUID();
    if (!currentUid) {
      return {
        success: false,
        errorType: QueResourceResponseErrorType.SignInRequired,
      };
    }

    const userDoc = doc(UserCollection, currentUid);
    const userDocSnapshot = await getDoc(userDoc);
    const selectedData = userDocSnapshot.get(
      `reactions.likes.${likeType}.${targetId}`
    ) as {
      [likeId: string]: LikeType;
    };

    if (!selectedData) {
      // 전달 받은 likeType + targetId 조합에 대한 좋아요 정보가 없음
      return {
        success: true,
        payload: [],
      };
    }

    /** 정제된 좋아요 데이터 배열. 함수의 결과로 반환용도 */
    const rtLikeData: LikeType[] = [];

    // 데이터 배열로 정제
    for (let likeId in selectedData) {
      rtLikeData.push({
        likeType: "video",
        userId: currentUid,
        targetId: targetId,
        likeId: likeId,
        ...selectedData[likeId],
      });
    }

    return { success: true, payload: rtLikeData };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** 영상 시청수를 증가시키는 함수 */
export async function increaseVideoViewCount(
  targetVideoId: string
): Promise<QueResourceResponse> {
  const videoDocSnap = await getDoc<VideoType>(
    doc(VideoCollection, targetVideoId)
  );

  if (!videoDocSnap.exists()) {
    // 그런 비디오 없습니다.
    return { success: false, errorType: QueResourceResponseErrorType.NotFound };
  }

  await updateDoc(videoDocSnap.ref, {
    viewCount: increment(1),
  });

  return { success: true };
}

/** 영상에 대해 좋아요를 기록하는 함수, users, videos 컬렉션 모두 수정함 */
export async function likeVideo(
  targetVideoId: string,
  likedAt: number
): Promise<QueResourceResponse<LikeType[]>> {
  const currentUid = getCurrentUID();
  if (!currentUid) {
    return {
      success: false,
      errorType: QueResourceResponseErrorType.SignInRequired,
    };
  }

  /** 기존 좋아요 가져오기 */
  const getLikeRequest = await getMyLikeReactions("video", targetVideoId);
  if (!getLikeRequest.success) {
    return {
      success: false,
      errorType: getLikeRequest.errorType,
    };
  }

  const likedData = getLikeRequest.payload!;
  if (likedData.length >= MAX_VIDEO_LIKE_LIMIT) {
    // 좋아요 개수 상한 도달
    return {
      success: false,
      errorType: QueResourceResponseErrorType.TooManyRequest,
    };
  }

  // 좋아요 가능한 조건 만족하였으니 좋아요 추가하기

  try {
    /** 새로 추가할 좋아요 데이터의 ID */
    const newLikeId = genSimpleUUID();
    /** 추가할 데이터 */
    const newLikeData: LikeType = {
      likeType: "video",
      likeId: newLikeId,
      targetId: targetVideoId,
      userId: currentUid,
      likePosition: likedAt,
      likedAt: new Date(),
    };

    /** 사용자 컬렉션에 대해 동적 생성을 위한 객체 */
    const newVideoLikeObject: {
      [targetId: string]: { [likeId: string]: LikeType };
    } = {};
    newVideoLikeObject[targetVideoId] = {};
    newVideoLikeObject[targetVideoId][newLikeId] = newLikeData;

    /** 사용자 collection에 등록 */
    const userDocRef = doc(UserCollection, currentUid);
    await setDoc(
      userDocRef,
      {
        reactions: {
          likes: {
            video: newVideoLikeObject,
          },
        },
      },
      { merge: true }
    );

    /** 비디오 컬렉션에 대해 동적 생성을 위한 객체 */
    const newVideoUserLikeObject: {
      [userId: string]: { [likeId: string]: LikeType };
    } = {};
    newVideoUserLikeObject[currentUid] = {};
    newVideoUserLikeObject[currentUid][newLikeId] = newLikeData;

    /** 비디오 collection에 등록 */
    const videoDocRef = doc(VideoCollection, targetVideoId);
    await setDoc(
      videoDocRef,
      {
        likeCount: increment(1),
        likedList: newVideoUserLikeObject,
      },
      { merge: true }
    );

    /** 좋아요 이후 상태 */
    const rtLikedData = [...likedData, newLikeData];

    return {
      success: true,
      payload: rtLikedData,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** 영상에 대해 좋아요를 취소하는 함수, users, videos 컬렉션 모두 수정함 */
export async function dislikeVideo(
  targetVideoId: string,
  likeId: string
): Promise<QueResourceResponse<LikeType[]>> {
  const currentUid = getCurrentUID();
  if (!currentUid) {
    return {
      success: false,
      errorType: QueResourceResponseErrorType.SignInRequired,
    };
  }

  // 내 좋아요 맞는지 확인하기
  /** 비디오 도큐먼트 레퍼런스 */
  const videoDocRef = doc(VideoCollection, targetVideoId);
  /** 비디오 도큐먼트 스냅샷 */
  const videoDocSnap = await getDoc<VideoType>(videoDocRef);
  if (!videoDocSnap.exists()) {
    // 해당 영상(이 없으니까 당연히 좋아요 정보도 없음) 정보 없음
    return {
      success: false,
      errorType: QueResourceResponseErrorType.NotFound,
    };
  }

  const videoDocData = videoDocSnap.data();
  if (
    !videoDocData.likedList || // 좋아요 목록 자체가 없음
    !videoDocData.likedList[currentUid] || // 이 사용자가 좋아요 한 적 자체가 없음
    !videoDocData.likedList[currentUid][likeId] // 해당 좋아요 정보가 없음
  ) {
    return {
      // 해당 좋아요 정보가 없음
      success: false,
      errorType: QueResourceResponseErrorType.NotFound,
    };
  } else {
    try {
      // user 문서에서 삭제
      const userDocRef = doc(UserCollection, currentUid);

      /** 이 조건 만족 시 좋아요가 모두 사라지는 것으로 판단합니다. */
      const deleteParentField =
        Object.keys(videoDocData.likedList[currentUid]).length == 1;
      if (deleteParentField) {
        await setDoc(
          userDocRef,
          {
            reactions: {
              likes: {
                video: {
                  [targetVideoId]: deleteField(),
                },
              },
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(
          userDocRef,
          {
            reactions: {
              likes: {
                video: {
                  [targetVideoId]: {
                    [likeId]: deleteField(),
                  },
                },
              },
            },
          },
          { merge: true }
        );
      }

      // video 문서에서 삭제
      if (deleteParentField) {
        await setDoc(
          videoDocRef,
          {
            likeCount: increment(-1),
            likedList: {
              [currentUid]: deleteField(),
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(
          videoDocRef,
          {
            likeCount: increment(-1),
            likedList: {
              [currentUid]: {
                [likeId]: deleteField(),
              },
            },
          },
          { merge: true }
        );
      }

      /** 반환용 데이터 정제 */
      const rtLikeData = [];
      for (let itrLikeId in videoDocData.likedList[currentUid]) {
        if (itrLikeId === likeId) {
          // 제외
        } else {
          rtLikeData.push(videoDocData.likedList[currentUid][itrLikeId]);
        }
      }

      return {
        success: true,
        payload: rtLikeData,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

/** Firestore에 저장된 timestamp 형식을 date로 변환하는 함수 */
function timestampToDate(timestamp: any): Date {
  return new Date(timestamp.toDate());
}
