import clsx from "clsx";
import type { ComponentType } from "react";
import styles from "./BiasCard.module.scss";

/** 데코/텍스트 레이어가 공유하는 고정 좌표계. 카드 디자인은 자유, 좌표계만 고정한다. */
export const BIAS_CARD_VIEWBOX = "0 0 200 200";
/** 카드 실제 렌더 사이즈 (px). viewBox 200과 0.8 비율로 맞춰, bleed px ↔ viewBox 단위 환산이 딱 떨어지게 한다. */
export const BIAS_CARD_SIZE = 160;
/** 데코/텍스트가 카드 경계 밖으로 삐져나올 수 있는 최대 허용치 (px). 리스트의 카드 간 gap은 이보다 넉넉해야 한다. */
export const BIAS_CARD_BLEED = 16;

export type BiasCardLayerProps = { isLead: boolean };

export type BiasCardAssets = {
  /** 스크린 리더용 아티스트 이름. Text 레이어는 장식으로 취급해 aria-hidden 처리하므로, 접근성 라벨은 이 값이 전담한다. */
  name: string;
  imageStill: string;
  /** 리드 카드로 스냅됐을 때 전환할 motion 에셋. 아직 없으면 imageStill을 계속 사용한다. */
  imageMotion?: string;
  /** 카드마다 새로 작성하는 장식 SVG. 이미지 크롭에는 관여하지 않는다(마스크 아님). */
  Deco: ComponentType<BiasCardLayerProps>;
  /** 카드마다 새로 작성하는 아티스트 이름 SVG. */
  Text: ComponentType<BiasCardLayerProps>;
};

interface BiasCardProps {
  assets: BiasCardAssets;
  isLead: boolean;
  className?: string;
}

export const BiasCard = ({ assets, isLead, className }: BiasCardProps) => {
  const { name, imageStill, imageMotion, Deco, Text } = assets;

  return (
    <div className={clsx(styles.card, className)} aria-label={name}>
      <div className={styles.imageLayer}>
        <img src={isLead && imageMotion ? imageMotion : imageStill} alt="" />
      </div>
      <svg
        className={styles.overlayLayer}
        viewBox={BIAS_CARD_VIEWBOX}
        aria-hidden="true"
      >
        <Deco isLead={isLead} />
      </svg>
      <svg
        className={styles.overlayLayer}
        viewBox={BIAS_CARD_VIEWBOX}
        aria-hidden="true"
      >
        <Text isLead={isLead} />
      </svg>
    </div>
  );
};
