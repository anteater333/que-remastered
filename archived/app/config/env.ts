/**
 * 어플리케이션 전역 설정값입니다. 빌드 환경에 따라 달라집니다.
 */
interface Configuration {
  /** 메일 인증 서버 관련 설정입니다. */
  VERIFICATION_SERVER: {
    PROTOCOL: string;
    HOST: string;
    PORT: number;
    PREFIX: string;
  };
  /** 파이어베이스 관련 설정입니다. */
  FIREBASE: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}

/** 배포 환경 */
const prodEnv: Configuration = {
  VERIFICATION_SERVER: {
    PROTOCOL: "http",
    HOST: "118.67.131.12",
    PORT: 18080,
    PREFIX: "/api/v1",
  },
  FIREBASE: {
    apiKey: "AIzaSyCOz2G9IfEWv2oWkJkn6oKSm1CkZ9KwxDM",
    authDomain: "que-production.firebaseapp.com",
    projectId: "que-production",
    storageBucket: "que-production.appspot.com",
    messagingSenderId: "1092820632181",
    appId: "1:1092820632181:web:6fea9e37c52b5c5ccc6e3c",
    measurementId: "G-34J4MB0M1L",
  },
};

/** 개발 환경 */
const devEnv: Configuration = {
  VERIFICATION_SERVER: {
    PROTOCOL: "http",
    HOST: "localhost",
    PORT: 18080,
    PREFIX: "/api/v1",
  },
  FIREBASE: {
    apiKey: "AIzaSyBegKpJPoze-yVHlWc9FC0vOKeHmDOckbk",
    authDomain: "que-backend-dev.firebaseapp.com",
    projectId: "que-backend-dev",
    storageBucket: "que-backend-dev.appspot.com",
    messagingSenderId: "944223797321",
    appId: "1:944223797321:web:31d1b5e50baec0c6a83f98",
    measurementId: "G-Z16F7Q50GY",
  },
};

export default function getEnv(): Configuration {
  if (__DEV__) {
    return devEnv;
  } else {
    return prodEnv;
  }
}
