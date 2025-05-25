/**
 * 알파 버전에서 표출할 공지사항을 컴포넌트로 만든겁니다.
 * TBD 아무래도 계속 RN 컴포넌트로 만들기는 힘들고 확장성도 좋지 않으니
 *     HTML로 작성할수 있도록 구조를 변경하기. (WebView 활용)
 */

import { useAssets } from "expo-asset";
import { Image, ImageSourcePropType, View } from "react-native";

export default function Notice01() {
  const [assets, error] = useAssets([require("./notice01.png")]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {assets ? (
        <Image
          style={{ flex: 1, resizeMode: "contain" }}
          source={assets[0] as ImageSourcePropType}
        />
      ) : null}
    </View>
  );
}
