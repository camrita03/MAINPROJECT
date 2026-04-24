const checkProfileComplete = (req, res, next) => {
  if (req.user && req.user.profileCompleted) {
    next();
  } else {
    res.status(403).json({
      message: "Please complete your profile first",
      step: "profile",
    });
  }
};

const checkResumeUploaded = (req, res, next) => {
  if (req.user && req.user.resumeUploaded) {
    next();
  } else {
    res.status(403).json({
      message: "Please upload your resume first",
      step: "resume",
    });
  }
};

module.exports = { checkProfileComplete, checkResumeUploaded };
