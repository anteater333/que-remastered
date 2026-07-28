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
  { key: "vocal", label: "보컬", angle: -90 },
  { key: "visual", label: "비주얼", angle: 30 },
  { key: "vibe", label: "바이브", angle: 150 },
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
  size = 160,
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

  return (
    <svg
      className={clsx(styles.graph, className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      {...rest}
    >
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

      {AXES.map(({ key, label, angle }) => {
        const { x, y } = polarToPoint(angle, radius + LABEL_OFFSET, center);
        return (
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
        );
      })}
    </svg>
  );
};
