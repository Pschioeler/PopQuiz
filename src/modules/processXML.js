const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const util = require("util");

// Convert fs.readFile and fs.readdir to Promise-based functions
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

// Function to shuffle an array in random order
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to process XML files and return an array of shuffled questions
async function processXML() {
  const xmlFolder = path.join(__dirname, "../xml");
  let questions = [];

  try {
    const files = await readdir(xmlFolder);
    for (let file of files) {
      const xmlFilePath = path.join(xmlFolder, file);
      const xmlData = await readFile(xmlFilePath, "utf-8");

      // Use xml2js to convert XML data to a JavaScript object
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(xmlData);

      // Extract questions and add them to the questions array
      result.quiz.question.forEach((question) => {
        if (question.answer && question.answer.length > 0) {
          const questionObject = {
            kategori: result.quiz.topic[0],
            type: question.type[0],
            spørgsmål: question.questiontext[0],
            svarMuligheder: question.answer.map(
              (answer) => answer.answertext[0]
            ),
            korrekteSvar: question.answer
              .filter(
                (answer) => answer.correct && answer.correct[0] === "True"
              )
              .map((answer) => answer.answertext[0]),
          };
          questions.push(questionObject);
        }
      });
    }
    // Shuffle the questions array before returning
    return shuffleArray(questions);
  } catch (err) {
    console.error("Error processing XML files:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

module.exports = { processXML };
