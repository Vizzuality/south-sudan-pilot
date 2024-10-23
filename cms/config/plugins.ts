export default ({env}) => ({
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_SES_ACCESS_KEY_ID'),
        secret: env('AWS_SES_ACCESS_KEY_SECRET'),
        amazon: `https://email.${env('AWS_REGION')}.amazonaws.com`
      },
      settings: {
        defaultFrom: `strapi@${env('AWS_SES_DOMAIN')}`,
        defaultReplyTo: `strapi@${env('AWS_SES_DOMAIN')}`,
      },
    },
  }

});
