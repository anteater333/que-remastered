import { GestureResponderEvent, View, ViewProps } from "react-native";
import navBarStyle from "./navbar.style";
import RoundedButton from "../buttons/RoundedButton";

/** 스타일 객체 */
const styles = navBarStyle;

interface WizardNavBarProps extends ViewProps {
  hideSkipButton: boolean;
  enableNextButton: boolean;
  onSkip?: (event: GestureResponderEvent) => void;
  onNext?: (event: GestureResponderEvent) => void;
  nextButtonText: string;
}

/**
 * 위자드 형식의 입력 시퀀스에서 사용 가능한 NavBar
 * "다음" 버튼과 "건너뛰기" 버튼으로 이루어짐.
 */
function WizardNavBar(props: WizardNavBarProps) {
  return (
    <View style={[styles.default, styles.wizardNavBarContainer]}>
      <View style={styles.wizardButtonContainer}>
        {props.hideSkipButton ? null : (
          <RoundedButton
            style={{
              ...styles.wizardButton,
              ...styles.skipButton,
            }}
            onPress={props.onSkip}
          >
            건너뛰기
          </RoundedButton>
        )}
      </View>
      <View style={styles.wizardButtonContainer}>
        <RoundedButton
          buttonType={props.enableNextButton ? "enabledDark" : "disabled"}
          style={{ ...styles.wizardButton, ...styles.nextButton }}
          onPress={props.onNext}
        >
          {props.nextButtonText}
        </RoundedButton>
      </View>
    </View>
  );
}

WizardNavBar.defaultProps = {
  nextButtonText: "다음",
};

export default WizardNavBar;
