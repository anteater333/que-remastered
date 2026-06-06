const domains = {
  WWW: process.env.WWW_HOST ?? "",
  MEDIA: (process.env.WWW_HOST ?? "") + "media",
};

export default domains;
