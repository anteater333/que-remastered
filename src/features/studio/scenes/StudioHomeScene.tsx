import styles from "./StudioHomeScene.module.scss";

import { useLoaderData } from "@tanstack/react-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { Profile } from "../../../components/Profile/Profile";
import { IcoPersonAdd } from "../../../components/common/icon/IcoPersonAdd";
import { useUserCountQuery } from "../../../hooks/queries/useUserCountQuery";
import { formatCount } from "../../../utils/formatter";
import { QUE_USER_ROLE } from "@shared/role";
import { StudioScoreGraph } from "../components/StudioScoreGraph";

const StudioHomeScene = () => {
  const { studio } = useLoaderData({
    from: "/_appLayout/_studioLayout/studio/$handle",
  });

  const isOwnerStudio = studio.user.role === QUE_USER_ROLE.OWNER;
  const { data: userCount } = useUserCountQuery(isOwnerStudio);

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
              {isOwnerStudio && userCount !== undefined && (
                <span className={styles.memberCounterContainer}>
                  <IcoPersonAdd />
                  <p className={styles.memberCounter}>
                    {formatCount(userCount)}
                  </p>
                </span>
              )}
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

      <section aria-label="스튜디오 정보" className={styles.summary}>
        <dl>
          <dt>총점</dt>
          <dd>{studio.totalScore}</dd>

          <dt>받은 ♥️ 수</dt>
          <dd>{studio.totalLikes}</dd>

          <dt>전체 시청 수</dt>
          <dd>{studio.totalViews}</dd>
        </dl>
        <div className={styles.graphContainer}>
          <span>점수 통계</span>
          <div className={styles.graph}>
            <StudioScoreGraph
              // vocalScore={studio.avgVocalScore}
              // visualScore={studio.avgVisualScore}
              // vibeScore={studio.avgVibeScore}
              vibeScore={7}
              visualScore={3}
              vocalScore={8}
            />
          </div>
        </div>
      </section>
    </article>
  );
};

export default StudioHomeScene;
