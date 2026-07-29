import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./StudioScoreGraph.module.scss";

interface StudioScoreGraphProps
  extends Omit<ComponentProps<"svg">, "width" | "height"> {
  vocalScore: number | null;
  visualScore: number | null;
  vibeScore: number | null;
  maxScore?: number;
  size?: number;
}

const AXES = [
  { key: "vocal", label: "Vocal", angle: -90 },
  { key: "visual", label: "Visual", angle: 30 },
  { key: "vibe", label: "Vibe", angle: 150 },
] as const;

const LABEL_OFFSET = 16;

const polarToPoint = (angleDeg: number, radius: number, center: number) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleRad),
    y: center + radius * Math.sin(angleRad),
  };
};

const toPointsAttr = (points: { x: number; y: number }[]) =>
  points.map(({ x, y }) => `${x},${y}`).join(" ");

export const StudioScoreGraph = ({
  vocalScore,
  visualScore,
  vibeScore,
  maxScore = 10,
  size = 220,
  className,
  ...rest
}: StudioScoreGraphProps) => {
  const center = size / 2;
  const radius = center - LABEL_OFFSET;

  const scoreByKey = {
    vocal: vocalScore,
    visual: visualScore,
    vibe: vibeScore,
  };

  const guidePoints = AXES.map(({ angle }) =>
    polarToPoint(angle, radius, center),
  );

  const scorePoints = AXES.map(({ key, angle }) => {
    const ratio = Math.min(Math.max((scoreByKey[key] ?? 0) / maxScore, 0), 1);
    return polarToPoint(angle, radius * ratio, center);
  });

  const labelPoints = AXES.map(({ key, label, angle }) => ({
    key,
    label,
    ...polarToPoint(angle, radius + LABEL_OFFSET, center),
  }));

  // 축 각도가 대칭이 아니라(위 1개, 아래 2개) 라벨까지 포함한 실제 도형은
  // size 정중앙보다 위로 치우친다. 라벨 영역의 세로 중심을 다시 정중앙으로 맞춘다.
  const labelMinY = Math.min(...labelPoints.map((point) => point.y));
  const labelMaxY = Math.max(...labelPoints.map((point) => point.y));
  const offsetY = center - (labelMinY + labelMaxY) / 2;

  return (
    <svg
      className={clsx(styles.graph, className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      {...rest}
    >
      <g transform={`translate(0, ${offsetY})`}>
        <polygon className={styles.guide} points={toPointsAttr(guidePoints)} />

        {AXES.map(({ key, angle }) => {
          const { x, y } = polarToPoint(angle, radius, center);
          return (
            <line
              key={key}
              className={styles.axis}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
            />
          );
        })}

        <polygon className={styles.score} points={toPointsAttr(scorePoints)} />

        {scorePoints.map((point, index) => (
          <circle
            key={AXES[index].key}
            className={styles.scoreDot}
            cx={point.x}
            cy={point.y}
            r={3}
          />
        ))}

        {labelPoints.map(({ key, label, x, y }) => (
          <text
            key={key}
            className={styles.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
};
