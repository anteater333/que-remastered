import { useAssets } from "expo-asset";
import { Image, ImageSourcePropType, View } from "react-native";

export default function Notice05() {
  const [assets, error] = useAssets([require("./notice05.png")]);

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
