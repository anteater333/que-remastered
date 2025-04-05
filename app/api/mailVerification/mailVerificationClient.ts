import getEnv from "../../config/env";
import { QueAuthResponse } from "../interfaces";

const config = getEnv().VERIFICATION_SERVER;

const URL =
  config.PROTOCOL + "://" + config.HOST + ":" + config.PORT + config.PREFIX;

const MailVerificationClient = {
  requestVerificationCodeMail: async function (
    mailAddr: string
  ): Promise<QueAuthResponse> {
    try {
      const reqUrl = `${URL}/verification?mail=${mailAddr}`;
      /** 메일 전송 요청 */
      const result = await fetch(reqUrl);

      const statusCode = result.status.toString();

      // 요청 결과 다듬어서 반환하기.
      if (
        Object.values(QueAuthResponse).includes(statusCode as QueAuthResponse)
      ) {
        return statusCode as QueAuthResponse;
      } else {
        // 지정하지 않은 에러 발생
        throw new Error(`Undefined error code : ${result.status}`);
      }
    } catch (error) {
      console.error(`Unhandled error : ${error}`);
      throw error;
    }
  },
  sendVerificationCode: async function (
    mailAddr: string,
    code: string
  ): Promise<QueAuthResponse> {
    try {
      const reqUrl = `${URL}/verification`;

      /** 검증 요청 */
      const result = await fetch(reqUrl, {
        method: "POST",
        headers: { "Content-Type": "appliation/json" },
        body: JSON.stringify({ mail: mailAddr, code: code }),
      });

      const statusCode = result.status.toString();

      // 요청 결과 다듬어서 반환하기.
      if (
        Object.values(QueAuthResponse).includes(statusCode as QueAuthResponse)
      ) {
        return statusCode as QueAuthResponse;
      } else {
        // 지정하지 않은 에러 발생
        throw new Error(`Undefined error code : ${result.status}`);
      }
    } catch (error) {
      console.error(`Unhandled error : ${error}`);
      throw error;
    }
  },
  signUpWithQueSelfManaged: async function (
    mailAddr: string,
    password: string
  ): Promise<QueAuthResponse> {
    try {
      const reqUrl = `${URL}/signup`;

      /** 회원가입 요청 */
      const result = await fetch(reqUrl, {
        method: "POST",
        headers: { "Content-Type": "appliation/json" },
        body: JSON.stringify({ mail: mailAddr, password: password }),
      });

      const statusCode = result.status.toString();

      // 요청 결과 다듬어서 반환하기.
      if (
        Object.values(QueAuthResponse).includes(statusCode as QueAuthResponse)
      ) {
        return statusCode as QueAuthResponse;
      } else {
        // 지정하지 않은 에러 발생
        throw new Error(`Undefined error code : ${result.status}`);
      }
    } catch (error) {
      console.error(`Unhandled error : ${error}`);
      throw error;
    }
  },
};

export default MailVerificationClient;
