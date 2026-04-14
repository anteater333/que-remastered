import nodemailer from "nodemailer";
import { globalLogger } from "../server";

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // .env 파일에서 관리 권장
        pass: process.env.MAIL_PASS,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        globalLogger.error({ msg: `메일 서버 연결 실패`, error });
      } else {
        globalLogger.info("Mail 서비스 준비 완료.");
      }
    });
  }

  /**
   * 인증 번호 발송 메서드
   */
  async sendVerificationEmail(toEmail: string, code: string): Promise<boolean> {
    const mailOptions = {
      from: `"QUE" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "[QUE] 회원가입 인증번호",
      html: `
        <h3>인증번호: ${code}</h3>
      `,
    };

    try {
      // 이미 생성된 this.transporter를 재사용
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      globalLogger.error({ msg: "메일 발송 중 에러", error });
      return false;
    }
  }
}

export default new MailService();
