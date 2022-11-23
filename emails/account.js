const sendgrid = require('@sendgrid/mail');
const apiKey = 'your-api-key';

sendgrid.setApiKey(apiKey);

exports.sendWelcomeEmail = (email, name) => {
  sendgrid.send({
    to: email,
    from: 'your-email',
    subject: 'Thanks for joining in',
    text: `Welcome to Tasker ${name}. Let me know how you get along with the app,`,
  });
  console.log('Email sent successfully');
};

exports.sendmail = (email, tasks) => {
  sendgrid.send({
    to: email,
    from: 'your-email',
    subject: 'List of incomplete tasks',
    html: `
     <html>
       <head>
         <title></title>
       </head>
       <body>
       The tasks that are remaining are
       ${tasks}. Please try to complete them as soon as possible.
       And don't forget to update the status of completion.
       </body>
     </html>
   `,
  });
};
