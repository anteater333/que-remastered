export interface SignUpSceneProps<T> {
  /** 현재 화면의 요청이 최종 성공하였을 때 */
  onValidated: (payload: T) => void;
}
