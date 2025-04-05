import { createContext, Dispatch, SetStateAction } from "react";
import { SignUpStackNavigationProp } from "../../../navigators/OnBoardingNavigator";
import UserType from "../../../types/User";

type SignUpContextType = {
  signUpNavigator: SignUpStackNavigationProp | undefined;
  buttonEnabled: boolean;
  setButtonEnabled: Dispatch<SetStateAction<boolean>>;
  hideButton: boolean;
  setHideButton: Dispatch<SetStateAction<boolean>>;
  buttonAction: { action: () => void }; // function을 바로 쓰지 않고 객체로 wrapping 해야 변경 가능합니다.
  setButtonAction: Dispatch<SetStateAction<{ action: () => void }>>;
  newUserProfile: UserType;
  setNewUserProfile: Dispatch<SetStateAction<UserType>>;
};
const defaultSignUpContext: SignUpContextType = {
  signUpNavigator: undefined,
  buttonEnabled: false,
  setButtonEnabled: function (): void {
    throw new Error("Function not implemented.");
  },
  buttonAction: {
    action: function (): void {
      throw new Error("Function not implemented.");
    },
  },
  setButtonAction: function (): void {
    throw new Error("Function not implemented.");
  },
  hideButton: false,
  setHideButton: function (value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  newUserProfile: {},
  setNewUserProfile: function (value: SetStateAction<UserType>): void {
    throw new Error("Function not implemented.");
  },
};

/**
 * 회원가입 흐름에 한정되어 사용할 Context
 */
export const SignUpContext =
  createContext<SignUpContextType>(defaultSignUpContext);
