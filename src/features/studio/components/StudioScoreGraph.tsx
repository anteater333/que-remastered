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

/**
 * angle: 축(꼭짓점) 방향
 * labelAngle: 라벨이 놓일 방향
 */
const AXES = [
  {
    key: "vocal",
    label: "VOCAL",
    angle: -90,
    labelAngle: -115,
    labelOffsetRatio: 0.6,
  },
  {
    key: "visual",
    label: "VISUAL",
    angle: 150,
    labelAngle: 150,
    labelOffsetRatio: 1,
  },
  {
    key: "vibe",
    label: "VIBE",
    angle: 30,
    labelAngle: 30,
    labelOffsetRatio: 1,
  },
] as const;

/** 그래프 전체 여백 */
const GRAPH_PADDING = 16;
/** 그래프 내 라벨 위치 */
const LABEL_OFFSET = 32;
/** 모서리 둥글기 */
const CORNER_RADIUS = 14;

const polarToPoint = (angleDeg: number, radius: number, center: number) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angleRad),
    y: center + radius * Math.sin(angleRad),
  };
};

type Point = { x: number; y: number };
type RoundedCorner = { vertex: Point; start: Point; end: Point };

/** 각 꼭짓점을 인접한 두 변 방향으로 반경만큼 물러난 start/end 지점으로 변환한다. */
const computeRoundedCorners = (
  points: Point[],
  cornerRadius: number,
): RoundedCorner[] => {
  const n = points.length;
  const at = (i: number) => points[(i + n) % n];

  return points.map((vertex, i) => {
    const prev = at(i - 1);
    const next = at(i + 1);
    const toPrev = { x: prev.x - vertex.x, y: prev.y - vertex.y };
    const toNext = { x: next.x - vertex.x, y: next.y - vertex.y };
    const distPrev = Math.hypot(toPrev.x, toPrev.y);
    const distNext = Math.hypot(toNext.x, toNext.y);
    // 인접한 변보다 반경이 커지면 모양이 깨지므로, 변 길이의 절반으로 clamp.
    const r = Math.min(cornerRadius, distPrev / 2, distNext / 2);

    return {
      vertex,
      start: {
        x: vertex.x + (toPrev.x / distPrev) * r,
        y: vertex.y + (toPrev.y / distPrev) * r,
      },
      end: {
        x: vertex.x + (toNext.x / distNext) * r,
        y: vertex.y + (toNext.y / distNext) * r,
      },
    };
  });
};

/** 변은 직선, 꼭짓점만 둥글게 깎은 폴리곤 path(d attribute)를 만든다. */
const toRoundedPolygonPath = (corners: RoundedCorner[]) => {
  const n = corners.length;
  let d = `M ${corners[0].start.x},${corners[0].start.y} `;
  for (let i = 0; i < n; i++) {
    const c = corners[i];
    const nextStart = corners[(i + 1) % n].start;
    d += `Q ${c.vertex.x},${c.vertex.y} ${c.end.x},${c.end.y} `;
    d += `L ${nextStart.x},${nextStart.y} `;
  }
  return `${d}Z`;
};

/** 둥근 모서리가 시각적으로 도달하는 가장 바깥 지점(베지어 t=0.5). 축 선의 끝점으로 쓴다. */
const roundedCornerTip = ({ vertex, start, end }: RoundedCorner): Point => ({
  x: 0.25 * start.x + 0.5 * vertex.x + 0.25 * end.x,
  y: 0.25 * start.y + 0.5 * vertex.y + 0.25 * end.y,
});

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
  const radius = center - GRAPH_PADDING;

  const scoreByKey = {
    vocal: vocalScore,
    visual: visualScore,
    vibe: vibeScore,
  };

  const guidePoints = AXES.map(({ angle }) =>
    polarToPoint(angle, radius, center),
  );
  const guideCorners = computeRoundedCorners(guidePoints, CORNER_RADIUS);

  const scorePoints = AXES.map(({ key, angle }) => {
    const ratio = Math.min(Math.max((scoreByKey[key] ?? 0) / maxScore, 0), 1);
    return polarToPoint(angle, radius * ratio, center);
  });
  const scoreCorners = computeRoundedCorners(scorePoints, CORNER_RADIUS);

  const labelPoints = AXES.map(
    ({ key, label, labelAngle, labelOffsetRatio }) => ({
      key,
      label,
      ...polarToPoint(
        labelAngle,
        radius + LABEL_OFFSET * labelOffsetRatio,
        center,
      ),
    }),
  );

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
        <path className={styles.guide} d={toRoundedPolygonPath(guideCorners)} />

        {AXES.map(({ key }, index) => {
          const { x, y } = roundedCornerTip(guideCorners[index]);
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

        <path className={styles.score} d={toRoundedPolygonPath(scoreCorners)} />

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
