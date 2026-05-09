import { useNavigate } from "@tanstack/react-router";
import { TextInput } from "../../../components/Inputs/TextInput";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import {
  useStackedLayoutInitiator,
  useStackedLayoutStore,
} from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import { useStageInfoQuery } from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";
import { usePreventLeave } from "../../../hooks/utils/usePreventLeave";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

const uploadEditorFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  song: z.string(),
});

type UploadEditorFormValues = z.infer<typeof uploadEditorFormSchema>;

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const navigate = useNavigate();
  const { progress, thumbnail, error, stageId, status } = useUploadSceneStore();
  const { data } = useStageInfoQuery(stageId ?? "");

  /** 페이지 이탈 방어 */
  usePreventLeave({ enabled: true });

  const form = useForm({
    defaultValues: {
      title: data?.stage.title ?? "",
      description: data?.stage.description ?? "",
      song: "",
    } satisfies UploadEditorFormValues,
    validators: {
      onChange: uploadEditorFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      // TODO:: upload mutation
    },
  });

  const { setGnb } = useStackedLayoutStore();
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      setGnb({
        buttonDisabled: !form.state.canSubmit,
        onButtonClick: () => form.handleSubmit(),
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!stageId) {
    navigate({ to: "/upload" });
  }

  return (
    <div>
      <div className={styles.videoContainer}>
        {status === "done" ? (
          <VideoPlayer />
        ) : (
          <VideoUploadPlaceholder
            thumbnailUrl={thumbnail}
            progress={progress}
          />
        )}
      </div>
      <textarea
        style={{ width: "540px", height: "540px" }}
        value={JSON.stringify(data, null, 4)}
      />
      <form id="que-stage-editor" className={styles.infoContainer}>
        <form.Field name="title">
          {(field) => (
            <TextInput
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
            <TextInput
              type="text"
              placeholder="설명"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
        <form.Field name="song">
          {(field) => (
            <TextInput
              type="text"
              placeholder="노래"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
      </form>
    </div>
  );
};

export default UploadEditorScene;
