import { ActivityIndicator, Text, View } from "react-native";
import { bColors, bFont, bSpace } from "../../styles/base";

/**
 * 화면 전체를 커버하는 로딩 표시
 */
export default function ScreenCoverLoadingSpinner(props: { message?: string }) {
  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: bColors.black + bColors.tpTetiary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
      }}
    >
      <ActivityIndicator size={bFont.xlarge * 2} color={bColors.primary} />
      <Text
        style={{
          marginTop: bSpace.large,
          fontSize: bFont.xlarge,
          textAlign: "center",
          color: bColors.white + bColors.tpPrimary,
        }}
      >
        {props.message}
      </Text>
    </View>
  );
}
