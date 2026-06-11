import clsx from "clsx";
import { TextArea } from "../../components/Inputs/TextArea";
import { TextInput } from "../../components/Inputs/TextInput";
import { SignUpFNB } from "../navigation/components/SignUpFNB";
import styles from "./onboarding.module.scss";
import Avatar from "boring-avatars";
import { useForm } from "@tanstack/react-form";

const OnBoardingPage = () => {
  const form = useForm({});

  return (
    <>
      <form id="que-onboarding" className={styles.onBoardingContainer}>
        <div>
          <button onClick={() => {}}>
            <div className={styles.profileContainer}>
              <Avatar name={"anteater333"} size={"100%"} variant="beam" />
            </div>
          </button>
        </div>
        <form.Field name="nickname">
          {(field) => (
            <TextInput
              className={clsx(styles.input, styles.name)}
              placeholder="당신의 이름은?"
            />
          )}
        </form.Field>
        <form.Field name="nickname">
          {(field) => (
            <TextArea
              className={clsx(styles.input, styles.description)}
              placeholder="자기소개를 작성해주세요."
            />
          )}
        </form.Field>
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
