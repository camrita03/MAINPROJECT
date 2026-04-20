const mongoose=require("mongoose")

const resumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    extractedSkills: {
      type: [String],
      required: true,
      default: [],
    },
    targetRole: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
module.exports=Resume
