import APIInstance from "../../../lib/axios";

export const requestPostOnBoardingProfile = async (
  nickname: string,
  description: string,
) => {
  return (
    await APIInstance.post("/users/onboarding/profile", {
      nickname,
      description,
    })
  ).data;
};

export const requestPostOnBoardingProfileImage = async (profileImage: File) => {
  const formData = new FormData();
  formData.append("file", profileImage);

  return (
    await APIInstance.post("/users/onboarding/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};
