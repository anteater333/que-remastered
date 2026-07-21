import { useLoaderData } from "@tanstack/react-router";

const StudioHomeScene = () => {
  const { studio } = useLoaderData({
    from: "/_appLayout/_studioLayout/studio/$handle",
  });

  return (
    <div>
      <h1>{studio.user.nickname}</h1>
      <p>@{studio.user.handle}</p>
      <p>{studio.user.description}</p>
      <img src={studio.user.profilePictureUrl} alt="" width={80} />
      <p>가입일: {String(studio.user.registeredAt)}</p>
      <p>권한: {studio.user.role}</p>

      <ul>
        <li>선호 장르: {studio.preferredGenres.join(", ")}</li>
        <li>선호 아티스트: {studio.preferredArtists.join(", ")}</li>
        <li>
          추천곡: {studio.recommendedTrackArtist} -{" "}
          {studio.recommendedTrackTitle} ({studio.recommendedTrackLink})
        </li>
        <li>보컬 평균 점수: {studio.avgVocalScore}</li>
        <li>비주얼 평균 점수: {studio.avgVisualScore}</li>
        <li>바이브 평균 점수: {studio.avgVibeScore}</li>
        <li>총점: {studio.totalScore}</li>
        <li>좋아요 수: {studio.totalLikes}</li>
        <li>조회수: {studio.totalViews}</li>
      </ul>
    </div>
  );
};

export default StudioHomeScene;
