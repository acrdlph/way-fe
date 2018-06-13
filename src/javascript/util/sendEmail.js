var nodemailer = require('nodemailer');

export function sendEmail() {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vasileios.georgopoulos@gmail.com',
    pass: '<<<1313SEGamo'
  }
});

var mailOptions = {
  from: 'vasileios.georgopoulos@gmail.com',
  to: 'moritz@schaefermueller.de',
  subject: 'yoyo',
  text: 'im coming for your sweetest hole!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
};