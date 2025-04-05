import React, { useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Modal.style";

// TBD Ionicons => MaterialIcon으로 변경하기

/**
 * 메뉴 모달 컴포넌트
 * @param props
 */
export default function MenuModal(props: MenuModalProps) {
  const onCloseRequested = useCallback(
    () => props.setModalVisible(!props.visible),
    [props.visible]
  );

  return (
    <Modal
      testID="menuModal"
      isVisible={props.visible}
      onBackButtonPress={onCloseRequested}
      onBackdropPress={onCloseRequested}
      onSwipeComplete={onCloseRequested}
      swipeDirection="down"
      swipeThreshold={66}
    >
      <View style={styles.menuModalView}>
        {/** ! 터치 버그 존재 ! */}
        <TouchableWithoutFeedback>
          <View style={styles.menuModalChildrenContainer}>
            <View style={styles.modalSwipeIndicator}>
              <View style={styles.modalSwipeHandle} />
            </View>
            <View style={styles.menuModalItemContainer}>{props.children}</View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

/**
 * 메뉴 모달에 들어갈 클릭 가능한 메뉴 아이템 컴포넌트
 * @param props
 */
export function MenuModalItem(props: MenuModalItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuModalItemFlexBox}
      onPress={props.onMenuPress}
    >
      <Ionicons
        style={styles.menuModalItemFlexItem}
        size={18}
        name={props.iconName}
      />
      <Text style={styles.menuModalItemFlexItem}>{props.menuText}</Text>
    </TouchableOpacity>
  );
}

type MenuModalProps = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: JSX.Element | JSX.Element[];
};

type MenuModalItemProps = {
  menuText?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onMenuPress?: () => void;
};
