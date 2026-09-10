import type { BiasCardAssets, BiasCardLayerProps } from "./BiasCard";

const PLACEHOLDER_HUES = [350, 205, 35, 150, 265, 20];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const createPlaceholderImage = (seed: string) => {
  const hue = PLACEHOLDER_HUES[hashString(seed) % PLACEHOLDER_HUES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="hsl(${hue} 65% 55%)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const DefaultBiasDeco = ({ isLead }: BiasCardLayerProps) => (
  <circle
    cx={182}
    cy={18}
    r={isLead ? 11 : 7}
    fill="#ff5a7a"
    stroke="#fff"
    strokeWidth={2}
  />
);

const createDefaultBiasText = (name: string) => {
  const DefaultBiasText = ({ isLead }: BiasCardLayerProps) => (
    <>
      <rect x={0} y={162} width={200} height={38} fill="rgba(0, 0, 0, 0.45)" />
      <text x={10} y={187} fill="#fff" fontSize={isLead ? 18 : 16} fontWeight={700}>
        {name}
      </text>
    </>
  );
  DefaultBiasText.displayName = `DefaultBiasText(${name})`;
  return DefaultBiasText;
};

/**
 * 아티스트별 전용 Deco/Text가 아직 없을 때 쓰는 임시 기본값.
 * 카드 디자인이 새로 나오면 이 함수 대신 전용 Deco/Text 컴포넌트로 교체한다.
 */
export const createDefaultBiasAssets = (artistName: string): BiasCardAssets => ({
  name: artistName,
  imageStill: createPlaceholderImage(artistName),
  Deco: DefaultBiasDeco,
  Text: createDefaultBiasText(artistName),
});
