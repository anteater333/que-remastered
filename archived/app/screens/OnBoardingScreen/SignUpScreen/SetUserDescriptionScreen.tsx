import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { updateUserProfile } from "../../../api/QueResourceUtils";
import CommonTextInput from "../../../components/inputs/CommonTextInput";
import { OnBoardingStackNavigationProp } from "../../../navigators/OnBoardingNavigator";
import screens from "../../../styles/screens";
import { SignUpContext } from "./SignUpContext";
import { signUpScreenStyle } from "./SignUpScreen.style";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setCredential } from "../../../reducers/authReducer";
import { useAuth } from "../../../hooks/useAuth";
import { useConfirm } from "../../../hooks/useConfirm";
import { useLoadingIndicator } from "../../../hooks/useLoadingIndicator";

const styles = signUpScreenStyle;

const maxLength = 140;

/**
 * 4. 사용자 자기소개 화면
 * @returns
 */
export default function SetUserDescriptionScreen() {
  /** 자기소개 입력 정보 */
  const [description, setDescription] = useState<string>("");
  /** 길이 초과 여부 */
  const [isLengthOver, setIsLengthOver] = useState<boolean>(false);

  /** 업데이트 된 프로필을 store에 적용하기 위한 dispatcher */
  const dispatch = useAppDispatch();
  const { user: currentUser, isSigned } = useAuth(); // API 호출 대신 이걸 사용

  /** 대기 가능 alert창 사용 */
  const asyncAlert = useConfirm();

  const onBoardingNavigator = useNavigation<OnBoardingStackNavigationProp>();

  /** SignUp 컨텍스트 */
  const { setButtonAction, setButtonEnabled, setHideButton, newUserProfile } =
    useContext(SignUpContext);

  const { hideLoading, showLoading } = useLoadingIndicator();

  /** Description 길이 제한 */
  const updateDescriptionInput = useCallback(
    (newStr: string) => {
      if (newStr.length <= maxLength) {
        setDescription(newStr);
        setIsLengthOver(newStr.length === maxLength);
      }
    },
    [description]
  );

  /** 버튼 액션, 자기소개를 서버에 등록하기 */
  const postUserDescription = useCallback(async () => {
    showLoading();

    if (
      !description.length &&
      !(await asyncAlert(
        "자기소개 없이 진행하시겠습니까?",
        "프로필 변경 기능은 개발 중입니다."
      ))
    ) {
      hideLoading();
      return;
    }

    const result = await updateUserProfile({
      description: description,
    });

    if (result.success) {
      hideLoading();
      // 업데이트한 프로필을 클라이언트에도 적용
      dispatch(
        setCredential({
          user: {
            ...currentUser,
            ...newUserProfile,
            description: description,
          },
        })
      );
      // 온보딩 화면 처음으로 이동 -> 해당 화면에서 로그인 여부 판단 -> 메인화면으로 이동
      onBoardingNavigator.navigate("CatchPhrase");
    } else {
      hideLoading();
      // TBD 업데이트 과정 에러 처리
      alert(`프로필 등록 과정에서 에러가 발생했습니다. : ` + result.errorType);
    }
  }, [newUserProfile.nickname, newUserProfile.profilePictureUrl, description]);

  /** 화면 초기화 */
  useEffect(() => {
    setHideButton(false);
    setButtonEnabled(true);
    setDescription("");
  }, []);

  /** 버튼 액션 설정 */
  useEffect(() => {
    setButtonAction({ action: postUserDescription });
  }, [description]);

  return (
    <SafeAreaView style={screens.defaultScreenLayout}>
      <View style={styles.upperContainer}>
        <CommonTextInput
          style={styles.textInputUpper}
          autoFocus
          multiline
          placeholder="자기소개를 작성해주세요."
          accessibilityRole="text"
          textContentType="none"
          onChangeText={updateDescriptionInput}
          value={description}
        />
        <Text
          style={[
            styles.messageText,
            styles.textAlignRight,
            isLengthOver ? styles.errorMessageText : {},
          ]}
        >{`${description.length}/${maxLength}`}</Text>
      </View>
    </SafeAreaView>
  );
}
