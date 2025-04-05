import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
import styles from "./Modal.style";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * 서비스 공지사항을 사용자에게 표시하는데 사용하는 모달 컴포넌트입니다.
 * @param props
 */
export default function NoticeModal(props: NoticeModalProps) {
  /** 메세지 페이지 번호 */
  const [pageNum, setPageNum] = useState<number>(0);
  /** 첫 페이지 여부 */
  const [isFirst, setIsFirst] = useState<boolean>(false);
  /** 마지막 페이지 여부 */
  const [isLast, setIsLast] = useState<boolean>(false);

  useEffect(() => {
    setIsFirst(pageNum === 0);
    setIsLast(pageNum >= props.pages.length - 1);
  }, [pageNum]);

  const onCloseRequested = useCallback(
    () => props.setModalVisible(!props.visible),
    [props.visible]
  );

  /** 메세지 페이지 앞으로 */
  const onMovePrev = useCallback(() => {
    if (!isFirst) setPageNum(pageNum - 1);
  }, [pageNum, isFirst]);
  /** 메세지 페이지 뒤로 */
  const onMoveNext = useCallback(() => {
    if (!isLast) setPageNum(pageNum + 1);
  }, [pageNum, isLast]);

  return (
    <Modal
      testID="menuModal"
      isVisible={props.visible}
      animationIn={"zoomIn"}
      animationOut={"zoomOut"}
    >
      <View style={styles.noticeModalView}>
        <View style={styles.noticeModalHeader}>
          <MaterialIcons
            selectable={false}
            style={styles.noticeModalIcon}
            onPress={onCloseRequested}
            name="close"
          />
        </View>
        <View style={styles.noticeModalBody}>{props.pages[pageNum]}</View>
        <View style={styles.noticeModalBottom}>
          <MaterialIcons
            selectable={false}
            style={[
              styles.noticeModalIcon,
              isFirst
                ? styles.noticeModalButtonDisabled
                : styles.noticeModalButtonEnabled,
            ]}
            onPress={isFirst ? undefined : onMovePrev}
            name="navigate-before"
          />
          <MaterialIcons
            selectable={false}
            style={[
              styles.noticeModalIcon,
              isLast
                ? styles.noticeModalButtonDisabled
                : styles.noticeModalButtonEnabled,
            ]}
            onPress={isLast ? undefined : onMoveNext}
            name="navigate-next"
          />
        </View>
      </View>
    </Modal>
  );
}

type NoticeModalProps = {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  pages: JSX.Element[];
};
