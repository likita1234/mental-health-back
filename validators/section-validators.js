const Question = require('../models/question-model');

exports.validateQuestionIds = async (questions) => {
  // Check if questions exists, then verify all the questions that exists are valid
  if (questions && questions.length > 0) {
    //  Check if each question Id in req.body.questions exists in the Question model
    const validQuestions = await Question.find({
      _id: { $in: questions },
    });
    // .select('_id');
    // Extract only the ids and convert them into string type to make comparisons easier
    const validQuestionsIds = validQuestions?.map((question) =>
      question._id.toString()
    );
    // Check if all question Ids are valid
    const questionsValid = questions.every((question) => {
      return validQuestionsIds.includes(question.toString());
    });
    return questionsValid;
  }
  return true;
};
