import { TextArea } from "../../components/Inputs/TextArea";
import { TextInput } from "../../components/Inputs/TextInput";
import { SignUpFNB } from "../navigation/components/SignUpFNB";
import styles from "./onboarding.module.scss";

const OnBoardingPage = () => {
  return (
    <>
      <form className={styles.onBoardingContainer}>
        <div>profile image placeholder</div>
        <TextInput placeholder="당신의 이름은?" />
        <TextArea placeholder="자기소개를 작성해주세요." />
      </form>
      <SignUpFNB
        isNextEnabled={true}
        isPrevEnabled={false}
        onNext={() => {}}
        onPrev={() => {}}
        showPrev={false}
      />
    </>
  );
};

export default OnBoardingPage;
