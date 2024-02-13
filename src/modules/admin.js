const fs = require("fs").promises;
const path = require("path");
const xml2js = require("xml2js");
const util = require("util");
const parser = new xml2js.Parser();
const xmlFolderPath = path.join(__dirname, "./xml");

// Promisify fs.readFile og fs.unlink for at bruge dem med async/await
const readFileAsync = util.promisify(fs.readFile);
const unlinkAsync = util.promisify(fs.unlink);

exports.index = (req, res) => {
  res.render("admin/index", { title: "Admin Dashboard" });
};

exports.uploadXML = async (req, res) => {
  if (!req.files || !req.files.xmlfile) {
    return res.status(400).send("Ingen fil blev uploadet.");
  }

  const xmlfile = req.files.xmlfile;
  const xmlData = xmlfile.data.toString(); // Antager, at filen er uploadet og tilgængelig som en buffer

  try {
    const parsedData = await parser.parseStringPromise(xmlData);

    // Valideringslogik
    if (!validateXMLStructure(parsedData)) {
      return res
        .status(400)
        .send("XML-filen opfylder ikke de krævede strukturkrav.");
    }

    // Gem filen efter validering
    const filePath = path.join(xmlFolderPath, xmlfile.name);
    fs.writeFileSync(filePath, xmlData);
    res.send("Filen er uploadet og valideret.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Hjælpefunktion til at validere strukturen af XML-filen
function validateXMLStructure(parsedData) {
  // Tjek at der findes et question element
  if (!parsedData.question) return false;

  const question = parsedData.question;

  // Valider de nødvendige under-elementer
  if (
    !question.id ||
    !question.type ||
    !question.questiontext ||
    !question.answer
  )
    return false;

  // Tjek for mindst ét answer element og at hvert answer har de nødvendige felter
  if (!Array.isArray(question.answer) || question.answer.length === 0)
    return false;

  return question.answer.every((answer) => answer.answertext && answer.correct);
}

exports.viewXML = (req, res) => {
  fs.readdir(xmlFolderPath, (err, files) => {
    if (err) {
      console.error("Kunne ikke indlæse filer:", err);
      return res.status(500).send("Kunne ikke indlæse filer.");
    }
    res.render("admin/view", { files: files });
  });
};

exports.deleteXML = (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(xmlFolderPath, filename);

  unlinkAsync(filePath)
    .then(() => {
      res.send(`${filename} er slettet.`);
    })
    .catch((err) => {
      res.status(500).send("Kunne ikke slette filen.");
    });
};
