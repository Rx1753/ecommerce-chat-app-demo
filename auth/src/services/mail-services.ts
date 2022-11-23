
import nodemailer, { TransportOptions } from "nodemailer";
import { google } from "googleapis";
import { BadRequestError } from "@rx-ecommerce-chat/common_lib";


const clientId =
  "485945689011-5pps6r44202h4prpafudks08jv8frbd4.apps.googleusercontent.com";
const clientSecreat = "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";
const redirect_uri = "https://developers.google.com/oauthplayground";
const referesh_token =
  "1//04qwjzRdFihJICgYIARAAGAQSNgF-L9Ir3M6bnTIRqCM5-pD34kDBYdG7lURVaZns1iYBGcHxo4_h4AIhI_FIIZw5WKTRUv3JnQ";


export class MailService {
  static async mailTrigger(code: string, email: string, subject: string,html:string) {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecreat,
      redirect_uri
    );
    oAuth2Client.setCredentials({ scope: 'offline', refresh_token: referesh_token });

    oAuth2Client.refreshAccessToken();
    const accessToken = await oAuth2Client.getAccessToken() as String;


    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: 'gokaninidhi9521@gmail.com',
        clientId: clientId,
        clientSecret: clientSecreat,
        refreshToken: referesh_token,
        accessToken: accessToken
      },
    } as TransportOptions);

    var mailOptions = {
      from: "gokaninidhi9521@gmail.com",
      to: email,
      subject: subject,
      text: "Hello,",
      html: html,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
        throw new BadRequestError(error.message);
      } else {
        console.log("Email sent: " + info.response);
        return true;
      }
    });
  }
}