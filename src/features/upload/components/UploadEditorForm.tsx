import { useForm } from "@tanstack/react-form";
import { TextArea } from "../../../components/Inputs/TextArea";
import { TextInput } from "../../../components/Inputs/TextInput";
import styles from "./UploadEditorForm.module.scss";
import z from "zod";
import { useEffect } from "react";
import { useStackedLayoutStore } from "../../navigation/stores/stackedLayoutStore";
import clsx from "clsx";

const uploadEditorFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  song: z.string(),
});

type UploadEditorFormValues = z.infer<typeof uploadEditorFormSchema>;

type UploadEditorFormProps = UploadEditorFormValues & {
  onSubmit: (value: UploadEditorFormValues) => Promise<void>;
};

export const UploadEditorForm = ({
  description,
  song,
  title,
  onSubmit,
}: UploadEditorFormProps) => {
  const form = useForm({
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      song: song,
    } satisfies UploadEditorFormValues,
    validators: {
      onChange: uploadEditorFormSchema,
      onMount: uploadEditorFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  // 값 변경 감지해 GNB 상태 변경
  const { setGnb } = useStackedLayoutStore();
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      setGnb({
        buttonDisabled: !form.store.state.canSubmit,
        onButtonClick: () => form.handleSubmit(),
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <form id="que-stage-editor" className={styles.infoFormContainer}>
      <form.Field name="title">
        {(field) => (
          <TextInput
            className={styles.infoInput}
            type="text"
            placeholder="제목"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <TextArea
            className={clsx(styles.infoInput, styles.infoDescription)}
            placeholder="무대를 설명해주세요."
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <form.Field name="song">
        {(field) => (
          <TextInput
            className={styles.infoInput}
            type="text"
            placeholder="노래"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
    </form>
  );
};
