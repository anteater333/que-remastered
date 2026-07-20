import { useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "../../../components/Players/VideoPlayer";
import { useStackedLayoutInitiator } from "../../navigation/stores/stackedLayoutStore";
import { VideoUploadPlaceholder } from "../components/VideoUploadPlaceholder";
import {
  useStageInfoQuery,
  useUpdateStageMutation as useUpdateStageMutation,
} from "../hooks/queries";
import { useUploadSceneStore } from "../stores/uploadSceneStore";
import styles from "./UploadEditorScene.module.scss";
import { usePreventLeave } from "../../../hooks/utils/usePreventLeave";
import {
  UploadEditorForm,
  type UploadEditorFormValues,
} from "../components/UploadEditorForm";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useCheckVideoUpdateStatus } from "../hooks/useCheckVideoUploadStatus";
import { useEffect, useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";

const UploadEditorScene = () => {
  /** 현재 장면의 GNB 최초 상태 정의 */
  useStackedLayoutInitiator({
    title: "업로드",
    buttonType: "primary",
  });

  const navigate = useNavigate();
  const confirm = useConfirm();

  // #region 최초 접근 시 데이터 조회 및 초기 form 상태 관리
  const { progress, thumbnail, error, stageId, status, setStatus } =
    useUploadSceneStore();
  const { data, refetch: refetchStage } = useStageInfoQuery(stageId ?? "");
  /**
   * 최초 data 로드되었을 때 form에 세팅해줄 초기 상태
   */
  const [formInitialValues, setFormInitialValues] =
    useState<UploadEditorFormValues | null>(null);

  // data 조회에 맞춰 초기 상태 설정
  useEffect(() => {
    if (data && !formInitialValues) {
      setFormInitialValues({
        title: data.stage.title,
        description: data.stage.description,
        song: "", // TBD
      });
    }
  }, [data]);
  // #endregion

  const { mutateAsync: updateStage } = useUpdateStageMutation(stageId ?? "");

  const handleSubmit = async (value: UploadEditorFormValues) => {
    if (!(await confirm({ title: "스테이지를 등록하시겠습니까?" }))) {
      return;
    }

    try {
      await updateStage(value);
      toast.success("스테이지 정보가 등록되었습니다.");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        toast.error(
          isAxiosError(error)
            ? (error.response?.data?.message ??
                "스테이지 정보 업데이트 요청 중 오류가 발생했습니다.")
            : "스테이지 정보 업데이트 중 서버 오류가 발생했습니다.",
        );
      }
    }
  };

  /** 페이지 이탈 방어 */
  usePreventLeave({ enabled: true });

  // #region 영상 업로드 상태 구독 및 업로드 완료 시 비디오 URL 설정
  /** status를 서버 상태에 구독 */
  useCheckVideoUpdateStatus(stageId ?? "", setStatus);

  useEffect(() => {
    if (status === "DONE") {
      refetchStage();
    }
  }, [status]);
  // #endregion

  if (!stageId) {
    navigate({ to: "/upload" });
  }

  return (
    <div className={styles.uploadModeSelectScene}>
      <div className={styles.videoContainer}>
        {status === "DONE" ? (
          <div className={styles.videoPreviewContainer}>
            <VideoPlayer sourceUrl={data?.stage.sourceUrl ?? ""} />
          </div>
        ) : (
          <VideoUploadPlaceholder
            thumbnailUrl={thumbnail}
            progress={progress}
            status={status}
            error={error}
          />
        )}
      </div>
      {!!data ? (
        <UploadEditorForm
          title={formInitialValues?.title ?? ""}
          description={formInitialValues?.description ?? ""}
          song={formInitialValues?.song ?? ""}
          onSubmit={handleSubmit}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UploadEditorScene;
