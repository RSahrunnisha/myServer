module.exports = {
    //mongoURI: "mongodb://localhost:27017/review" ,
    mongoURI: "mongodb+srv://root:rootpassword@cluster0.zdr2j.mongodb.net/<dbname>?retryWrites=true&w=majority",
    otpApiKey: 'c91430b3-bef4-11ea-9fa5-0200cd936042',
    secretOrKey: "FD9EF31C0244663F6165F3E8FC5F2C4A2B9F69CF1896C89644906ADDC537C5CB",
    email: {
      smtpOptions : {
        service:'gmail',
        host: "smtp.gmail.com",
        //service: "Sendgrid",
        auth: {
          user: "shuriken.eizan@gmail.com",
          pass: 'laptop1000',
        }
      },
      emailFrom: "info@eizen.com",
    }
  };