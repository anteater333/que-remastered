// redis 키 정보 저장소

/** 이메일 인증 요청 정보 */
export const REDIS_VERIFICATION_EMAIL_KEY_PREFIX = (email: string) =>
  `que-verificationMail-${email}`;

/** 이메일 인증 통과 여부 */
export const REDIS_VERIFICATION_CHECK_KEY_PREFIX = (email: string) =>
  `que-verificationCheck-${email}`;
