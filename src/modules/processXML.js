const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const ejs = require('ejs');

// Middleware-funktion til at behandle XML-filer
const processXML = (req, res, next) => {
    // Array til at gemme konverterede spørgsmål
    req.questions = [];

    // Sti til mappen med XML-filer (tilpas denne sti efter dit projekt)
    const xmlFolder = path.join(__dirname, 'xml');

    // Læs alle XML-filer i mappen
    fs.readdir(xmlFolder, (err, files) => {
        if (err) {
            console.error('Fejl ved læsning af XML-filer:', err);
            return res.status(500).send('Der opstod en fejl');
        }

        // Gennemgå hver XML-fil
        files.forEach(file => {
            // Ignorer filer der ikke slutter på .xml
            if (!file.endsWith('.xml')) return;

            // Læs indholdet af XML-filen
            fs.readFile(path.join(xmlFolder, file), (err, data) => {
                if (err) {
                    console.error(`Fejl ved læsning af filen ${file}:`, err);
                    return;
                }

                // Konverter XML til JSON
                xml2js.parseString(data, (err, result) => {
                    if (err) {
                        console.error(`Fejl ved konvertering af XML til JSON for filen ${file}:`, err);
                        return;
                    }

                    // Hent spørgsmål fra JSON-resultatet
                    const quiz = result.quiz;
                    if (!quiz || !quiz.question) {
                        console.error(`Ugyldigt XML-format for filen ${file}`);
                        return;
                    }
                    
                    // Gennemgå hver spørgsmål og konverter til HTML vha. EJS
                    quiz.question.forEach(questionData => {
                        ejs.renderFile('question_template.ejs', { question: questionData }, (err, html) => {
                            if (err) {
                                console.error(`Fejl ved konvertering af spørgsmål til HTML for filen ${file}:`, err);
                                return;
                            }
                            
                            // Tilføj det konverterede spørgsmål til arrayet
                            req.questions.push(html);
                        });
                    });
                });
            });
        });
    });

    // Fortsæt til næste middleware eller rutehåndtering
    next();
};

module.exports = processXML;
