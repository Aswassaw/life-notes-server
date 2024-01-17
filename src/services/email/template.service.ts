import { Injectable } from '@nestjs/common';
import { htmlTemplateBottom, htmlTemplateTop } from './template';

@Injectable()
export class TemplateService {
  verifyAfterRegistration({ link }: { link: string }): string {
    const htmlContent = `
      <p>
        Anda menerima email ini karena Anda telah melakukan registrasi di Life Notes.
        <br>
        Anda diharapkan dapat memverifikasi akun anda melalui link di bawah ini:
      </p>

      <a href="${link}" style="color: white;" class="auth-button">Verify</a>

      <p>
        Link alternatif: <a href="${link}">${link}</a>
      </p>

      <hr>

      <p>Copyright &copy; ${new Date().getFullYear()} Life Notes - Developed with <span style="color: red !important;">❤️</span> by <a style="text-decoration: none;" href="https://github.com/andry-pebrianto" target="_blank">Andry Pebrianto</a> in Tangerang</p>
    `;

    return htmlTemplateTop + htmlContent + htmlTemplateBottom;
  }
}
