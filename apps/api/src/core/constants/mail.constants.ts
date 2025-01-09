import { MailOptions } from '@pixelplex/mail-service';

import * as config from 'config';

export const mailConfig: MailOptions<(typeof config.MAIL.GATEWAYS)[0]> = {
  gateways: config.MAIL.GATEWAYS,
  sendgrid: {
    apiKey: config.SENDGRID.API_KEY,
    sender: config.SENDGRID.SENDER,
  },
  slack: {
    url: config.SLACK.URL,
  },
};
