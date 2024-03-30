const Question = require('../models/question-model');

exports.validateQuestionIds = async (questions) => {
  // Check if questions exists, then verify all the questions that exists are valid
  if (questions && questions.length > 0) {
    //  Check if each question Id in req.body.questions exists in the Question model
    const invalidQuestionIds = await Question.find({
      _id: { $in: questions },
    }).select('_id');

    // Check if all question Ids are valid
    const isValidQuestions = questions.every((questionId) =>
      invalidQuestionIds.includes(questionId.toString())
    );
    return isValidQuestions;
  }
  return true;
};
