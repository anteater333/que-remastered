import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TextProps,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { buttonInsideStyles, buttonLayoutStyles } from "./RoundedButton.style";
import { useState } from "react";

export type RoundedButtonType =
  | "primary"
  | "enabledDark"
  | "enabledBorder"
  | "white"
  | "danger"
  | "disabled";

/**
 * 버튼 컴포넌트 프로퍼티
 */
export interface RoundedButtonProps extends TextProps {
  buttonType?: RoundedButtonType;
  bold?: boolean;
  iconData?: {
    iconType: "image" | "material" | "ionicon";
    withText?: boolean;
    ioniconName?: keyof typeof Ionicons.glyphMap;
    materialIconName?: keyof typeof MaterialIcons.glyphMap;
    imageSrc?: ImageSourcePropType;
    iconSize?: number;
  };
  testID?: string;
}

/**
 * Que 어플리케이션에서 기본적으로 자주 사용하게 될 끝이 둥근 네모난 버튼 컴포넌트
 * `<Text>` 처럼 사용할 수 있습니다.
 * TBD 버그수정 - StyleSheet.create로 생성한 텍스트 스타일을 프로퍼티로 전달할 시 제대로 반영되지 않음
 */
function RoundedButton(props: RoundedButtonProps) {
  const insideStyles = buttonInsideStyles(props);

  const iconComponent = !props.iconData ? null : props.iconData?.iconType ===
    "image" ? (
    <Image
      source={props.iconData.imageSrc!}
      resizeMode="contain"
      style={insideStyles.buttonImage}
    />
  ) : props.iconData?.iconType === "ionicon" ? (
    <Ionicons
      style={[insideStyles.buttonText, insideStyles.buttonIcon]}
      name={props.iconData.ioniconName!}
    />
  ) : props.iconData?.iconType === "material" ? (
    <MaterialIcons
      style={[insideStyles.buttonText, insideStyles.buttonIcon]}
      name={props.iconData.materialIconName}
    />
  ) : null;

  return (
    <View
      testID={props.testID}
      style={[props.style, buttonLayoutStyles.buttonBorder]}
    >
      <Pressable
        testID="roundedButtonPressable"
        style={[buttonLayoutStyles.buttonBody]}
        onPress={props.onPress}
        disabled={props.buttonType === "disabled"}
        accessibilityRole="button"
      >
        {props.buttonType === "primary" ? (
          <LinearGradient
            style={insideStyles.gradientBackground}
            colors={insideStyles.primaryGradient.colors}
            start={insideStyles.primaryGradient.start}
            end={insideStyles.primaryGradient.end}
          />
        ) : null}
        <View style={insideStyles.buttonInside}>
          {!props.iconData ? (
            // iconData가 없는 경우, 버튼 내용이 텍스트만으로 이루어져 있음.
            <Text selectable={false} style={insideStyles.buttonText}>
              {props.children}
            </Text>
          ) : props.iconData.withText ? (
            // 텍스트와 아이콘 함께 사용하는 버튼
            <View style={insideStyles.rowFlexContainer}>
              <View style={[insideStyles.rowFlexItem]}>{iconComponent}</View>
              <View
                style={[insideStyles.rowFlexItem, insideStyles.verticalLine]}
              />
              <View
                style={[insideStyles.rowFlexItem, insideStyles.rowFlexText]}
              >
                <Text selectable={false} style={[insideStyles.buttonText]}>
                  {props.children}
                </Text>
              </View>
            </View>
          ) : (
            // 아이콘만 있는 버튼
            iconComponent
          )}
        </View>
      </Pressable>
    </View>
  );
}

/** 프로퍼티 기본 값 */
RoundedButton.defaultProps = {
  children: "",
  buttonType: "enabledBorder",
  onPress: () => {
    console.warn("버튼은 왜 달았습니까?");
  },
};

export default RoundedButton;
