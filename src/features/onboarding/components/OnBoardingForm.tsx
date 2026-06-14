import { useForm } from "@tanstack/react-form";
import styles from "./OnBoardingForm.module.scss";
import z from "zod";
import Avatar from "boring-avatars";
import { TextInput } from "../../../components/Inputs/TextInput";
import clsx from "clsx";
import { TextArea } from "../../../components/Inputs/TextArea";
import { useMemo, useRef, useState } from "react";

const onBoardingFormSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요"),
  description: z.string(),
});

export type OnBoardingFormValues = z.infer<typeof onBoardingFormSchema>;

type OnBoardingFormProps = OnBoardingFormValues & {
  onSubmit: (
    value: OnBoardingFormValues & { profileImage: File | null },
  ) => Promise<void>;
};

export const OnBoardingForm = ({ onSubmit }: OnBoardingFormProps) => {
  const [profileImage, setProfileImage] = useState<File | null>(null); // Note. 파일은 form 대신 별도 상태로 관리

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewImage = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : null),
    [profileImage],
  );

  const form = useForm({
    defaultValues: {
      nickname: "",
      description: "",
    } satisfies OnBoardingFormValues,
    validators: {
      onChange: onBoardingFormSchema,
      onMount: onBoardingFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.({ ...value, profileImage });
    },
  });

  return (
    <>
      <form id="que-onboarding" className={styles.onBoardingContainer}>
        <div className={styles.profileInput}>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <div className={styles.profileContainer}>
              {previewImage ? (
                <img src={previewImage} className={styles.profileImage} />
              ) : (
                <Avatar name={"anteater333"} size={"100%"} variant="beam" />
              )}
            </div>
          </button>
          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setProfileImage(file);
            }}
          />
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
    </>
  );
};
