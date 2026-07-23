import styles from "./StudioHomeScene.module.scss";

import { useLoaderData } from "@tanstack/react-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { Profile } from "../../../components/Profile/Profile";
import { IcoPersonAdd } from "../../../components/common/icon/IcoPersonAdd";

const StudioHomeScene = () => {
  const { studio } = useLoaderData({
    from: "/_appLayout/_studioLayout/studio/$handle",
  });

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("스튜디오 주소가 복사되었습니다.");
  }, []);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (!el) return;
    setIsDescriptionClamped(el.scrollHeight > el.clientHeight);
  }, [studio.user.description]);

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.profileContainer}>
          <Profile
            className={styles.profileImage}
            profilePictureUrl={studio.user.profilePictureUrl}
            userHandle={studio.user.handle}
          />
        </div>
        <div className={styles.bioContainer}>
          <div className={styles.nameContainer}>
            <div className={styles.nameContainerUpper}>
              <h1 onClick={handleCopyLink}>{studio.user.nickname}</h1>
              <span className={styles.memberCounterContainer}>
                <IcoPersonAdd />
                {/* TODO: OWNER에 한해서 회원 수 표시 */}
                <p className={styles.memberCounter}>{"4.5k"}</p>
              </span>
            </div>
            <button
              type="button"
              className={styles.handle}
              onClick={handleCopyLink}
            >
              @{studio.user.handle}
            </button>
          </div>
          <div className={styles.descriptionContainer}>
            <p
              ref={descriptionRef}
              className={clsx(
                styles.description,
                isDescriptionExpanded && styles.descriptionExpanded,
              )}
            >
              {studio.user.description}
            </p>
            {isDescriptionClamped && (
              <button
                type="button"
                className={styles.descriptionToggle}
                onClick={() => setIsDescriptionExpanded((prev) => !prev)}
              >
                {isDescriptionExpanded ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </div>
      </header>

      <section aria-label="스튜디오 정보">
        <dl>
          <dt>선호 장르</dt>
          <dd>{studio.preferredGenres.join(", ")}</dd>

          <dt>선호 아티스트</dt>
          <dd>{studio.preferredArtists.join(", ")}</dd>

          <dt>추천곡</dt>
          <dd>
            {studio.recommendedTrackArtist} - {studio.recommendedTrackTitle} (
            {studio.recommendedTrackLink})
          </dd>

          <dt>보컬 평균 점수</dt>
          <dd>{studio.avgVocalScore}</dd>

          <dt>비주얼 평균 점수</dt>
          <dd>{studio.avgVisualScore}</dd>

          <dt>바이브 평균 점수</dt>
          <dd>{studio.avgVibeScore}</dd>

          <dt>총점</dt>
          <dd>{studio.totalScore}</dd>

          <dt>좋아요 수</dt>
          <dd>{studio.totalLikes}</dd>

          <dt>조회수</dt>
          <dd>{studio.totalViews}</dd>
        </dl>
      </section>
    </article>
  );
};

export default StudioHomeScene;
