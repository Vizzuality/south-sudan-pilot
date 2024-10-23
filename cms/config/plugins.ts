export default ({env}) => ({
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_SES_ACCESS_KEY_ID'),
        secret: env('AWS_SES_ACCESS_KEY_SECRET'),
        amazon: 'https://email.af-south-1.amazonaws.com',
      },
      settings: {
        defaultFrom: 'strapi@ss-hydro-pilot.gmv.com',
        defaultReplyTo: 'strapi@ss-hydro-pilot.gmv.com',
      },
    },
  }

});
