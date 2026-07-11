import { useForm, useStore } from "@tanstack/react-form";
import styles from "./OnBoardingForm.module.scss";
import z from "zod";
import { TextInput } from "../../../components/Inputs/TextInput";
import clsx from "clsx";
import { TextArea } from "../../../components/Inputs/TextArea";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../../hooks/useAuth";
import { AvatarProfile } from "../../../components/Profile/AvatarProfile";

const onBoardingFormSchema = z.object({
  nickname: z.string().min(2, "닉네임을 입력해주세요"),
  description: z.string().max(500),
});

export type OnBoardingFormValues = z.infer<typeof onBoardingFormSchema>;

export type OnBoardingFormRef = {
  submit: () => void;
  isValid: boolean;
};

type OnBoardingFormProps = OnBoardingFormValues & {
  ref?: React.Ref<OnBoardingFormRef>;
  onSubmit: (
    value: OnBoardingFormValues & { profileImage: File | null },
  ) => Promise<void>;
  onValidChange?: (isValid: boolean) => void;
};

const MAX_PROFILE_SIZE = 5 * 1024 * 1024;

export const OnBoardingForm = ({
  onSubmit,
  onValidChange,
  ref,
}: OnBoardingFormProps) => {
  const { userProfile } = useAuth();
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

  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(),
    isValid: form.state.isValid,
  }));

  const isValid = useStore(form.store, (state) => state.isValid);

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid]);

  return (
    <>
      <form
        id="que-onboarding"
        className={styles.onBoardingContainer}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className={styles.profileInput}>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            <div className={styles.profileContainer}>
              {previewImage ? (
                <img src={previewImage} className={styles.profileImage} />
              ) : (
                <AvatarProfile name={userProfile.handle} />
              )}
            </div>
          </button>
          {/* hidden file input */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              if (file) {
                if (file.size > MAX_PROFILE_SIZE) {
                  alert(
                    `프로필 사진 크기는 최대 ${MAX_PROFILE_SIZE / 1024 / 1024}MB까지 가능해요.`,
                  );
                  e.target.value = "";
                  return;
                }

                setProfileImage(file);
              }
            }}
          />
          <div className={styles.profileHint}>
            <p>JPG · PNG · WEBP · 최대 5MB</p>
            <p>정사각형 이미지를 권장해요.</p>
            <p>업로드 후 이미지 크기는 최적화돼요.</p>
          </div>
        </div>
        <form.Field name="nickname">
          {(field) => (
            <TextInput
              className={clsx(styles.input, styles.name)}
              type="text"
              placeholder="당신의 이름은?"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextArea
              className={clsx(styles.input, styles.description)}
              placeholder="자기소개를 작성해주세요."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
      </form>
    </>
  );
};
