import { QueAuthResponse } from "./interfaces";
import authUtils from "./QueAuthUtils";

const goodMail = "anteater1056@gmail.com";

describe("requestVerificationCodeMail", () => {
  it("메일 전송 요청을 성공한다.", async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ status: QueAuthResponse.OK });
    }) as jest.Mock;

    const result = await authUtils.requestVerificationCodeMail(goodMail);

    expect(result).toBe(QueAuthResponse.OK);
  });
});

describe("sendVerificationCode", () => {
  it("틀린 코드를 보낼 경우 틀렸다는 결과를 반환받는다.", async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ status: QueAuthResponse.Wrong });
    }) as jest.Mock;

    const badCode = "123456";

    const result = await authUtils.sendVerificationCode(goodMail, badCode);

    expect(result).toBe(QueAuthResponse.Wrong);
  });

  it("옳은 코드를 보낼 경우 성공을 반환받는다.", async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ status: QueAuthResponse.OK });
    }) as jest.Mock;

    const goodCode = "111111";

    const result = await authUtils.sendVerificationCode(goodMail, goodCode);

    expect(result).toBe(QueAuthResponse.OK);
  });
});

describe("signUpWithQueSelfManaged", () => {
  it("인증이 완료된 메일을 입력하면 계정이 생성됐다는 결과를 반환받는다.", async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve({ status: QueAuthResponse.Created });
    }) as jest.Mock;

    const goodPassword = "asdf1234";
    const result = await authUtils.signUpWithQueSelfManaged(
      goodMail,
      goodPassword
    );

    expect(result).toBe(QueAuthResponse.Created);
  });
});
