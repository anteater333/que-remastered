import { useEffect, useRef, useState } from "react";
import { BiasCard, type BiasCardAssets } from "./BiasCard";
import styles from "./BiasRail.module.scss";

interface BiasRailProps {
  items: BiasCardAssets[];
  emptyMessage?: string;
}

export const BiasRail = ({
  items,
  emptyMessage = "아직 좋아하는 아티스트가 없어요.",
}: BiasRailProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [leadIndex, setLeadIndex] = useState(0);

  useEffect(() => {
    const root = railRef.current;
    if (!root || items.length === 0) return;

    const ratios = new Map<Element, number>();

    // 스냅으로 맨 앞에 걸린 카드를 "가장 많이 보이는 카드"로 근사한다.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }

        let bestIndex = 0;
        let bestRatio = -1;
        cardRefs.current.forEach((el, index) => {
          const ratio = el ? (ratios.get(el) ?? 0) : 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });
        setLeadIndex(bestIndex);
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  if (items.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div ref={railRef} className={styles.rail}>
      {items.map((assets, index) => (
        <div
          key={assets.name}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          className={styles.cardSlot}
        >
          <BiasCard assets={assets} isLead={index === leadIndex} />
        </div>
      ))}
    </div>
  );
};
