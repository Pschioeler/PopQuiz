const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

function processXML(req, res, next) {
    const xmlFolder = path.join(__dirname, '../xml');
    const xmlFiles = fs.readdirSync(xmlFolder);

    // Array til at gemme spørgsmål
    req.questions = [];

    // Gennemgå hver XML-fil og behandle dens indhold
    xmlFiles.forEach(file => {
        const xmlFilePath = path.join(xmlFolder, file);
        const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');

        // Konverter XML til JavaScript-objekt
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Fejl ved konvertering af XML til JavaScript-objekt:', err);
                return;
            }

            // Gennemgå hver quiz i XML-filen
            result.quiz.question.forEach(question => {
                // Kontroller om question.answer eksisterer
                if (question.answer && question.answer.length > 0) {
                    // Opret et nyt objekt til at gemme spørgsmål, svarmuligheder og korrekte svar
                    const questionObject = {
                        kategori: result.quiz.topic[0], // Tilføj kategorien for spørgsmålet
                        spørgsmål: question.questiontext[0],
                        svarMuligheder: question.answer.map(answer => answer.answertext[0]),
                        korrekteSvar: question.answer.filter(answer => answer.correct && answer.correct[0] === 'True').map(answer => answer.answertext[0])
                    };

                    // Tilføj det nye spørgsmål til req.questions-arrayet
                    req.questions.push(questionObject);
                }
            });
        });
    });

    // Fortsæt til næste middleware
    next();
}

module.exports = processXML;
