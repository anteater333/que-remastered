import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, TextInputProps, TextStyle } from "react-native";
import commonTextInputStyles, {
  multiLineStyles,
} from "./CommonTextInput.style";

const styles = commonTextInputStyles;

interface CommonTextInput extends TextInputProps {
  disabled?: boolean;
  invalid?: boolean;
}

/** 기본 텍스트 입력 폼 */
function CommonTextInput(props: CommonTextInput) {
  const [focused, setFocused] = useState(false);

  const [contentHeight, setContentHeight] = useState<number>(0);

  /** focus 처리 */
  // useEffect(() => {}, [focused]);

  return (
    <TextInput
      {...props}
      scrollEnabled={false}
      onFocus={(e) => {
        setFocused(true);
        if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        if (props.onBlur) props.onBlur(e);
      }}
      onContentSizeChange={(event) => {
        setContentHeight(event.nativeEvent.contentSize.height);
      }}
      style={[
        styles.default,
        props.invalid ? styles.invalid : styles.valid,
        props.disabled ? styles.disabled : {},
        props.style,
        props.multiline
          ? multiLineStyles(
              contentHeight,
              (props.style as TextStyle).maxHeight,
              (props.style as TextStyle).minHeight
            ).calculated
          : {},
      ]}
    >
      {props.children}
    </TextInput>
  );
}

/** 기본 property */
const defaultProps: CommonTextInput = {
  invalid: false,
};

CommonTextInput.defaultProps = defaultProps;

export default CommonTextInput;
