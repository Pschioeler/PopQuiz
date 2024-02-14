//import possible other dependable modules
function generateMockAnswerObjects(question, answerOptions, correctAnswers, usersAnswers){
    var answer = {
        question: "",
        answerOptions: [],
        correctAnswers: [],
        usersAnswers: []
    }
    var answerObject = Object.create(answer);
        answerObject.question = question,
        answerObject.answerOptions = answerOptions,
        answerObject.correctAnswers = correctAnswers,
        answerObject.usersAnswers = usersAnswers

    return answerObject;
}
function generateMockAnswers(){
    var question1 = generateMockAnswerObjects("Hvad betyder følgende sammenligningsoperator: <b>!==</b>", ["Lig med værdien og typen ", "Ikke lig med ", "Lig med typen, men ikke værdien ", "Ikke lige med værdien eller typen "], ["var ", "int "], ["var"]);
    var question2 = generateMockAnswerObjects("Hvad betyder følgende sammenligningsoperator: <b>!==</b>", ["Lig med værdien og typen ", "Ikke lig med ", "Lig med typen, men ikke værdien ", "Ikke lige med værdien eller typen "], ["var ", "int "], ["sandwich"]);
    var question3 = generateMockAnswerObjects("Hvad betyder følgende sammenligningsoperator: <b>!==</b>", ["Lig med værdien og typen ", "Ikke lig med ", "Lig med typen, men ikke værdien ", "Ikke lige med værdien eller typen "], ["var ", "int "], ["const"]);
    let answers = [];
        answers.push(question1, question2, question3);
    
    return answers;
}
function displayAnswers(){
    //do some display magic here with each answered question
    var answersToDisplay = generateMockAnswers();
}
// Funktion til at konvertere et array af svarobjekter til XML
function convertArrayToXML(data) {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<answers>';
    // Gennemløb hvert svarobjekt i arrayet
    data.forEach(answerObj => {
        xmlString += '<answer>';
        // Gennemløb attributterne i svarobjektet
        Object.keys(answerObj).forEach(key => {
            if (Array.isArray(answerObj[key])) {
                xmlString += `<${key}>`;
                answerObj[key].forEach(option => {
                    xmlString += `<option>${option}</option>`;
                });
                xmlString += `</${key}>`;
            } else {
                xmlString += `<${key}>${answerObj[key]}</${key}>`;
            }
        });
        xmlString += '</answer>';
    });
    xmlString += '</answers>';
    return xmlString;
}
async function generateDataForDownload() {
    var downloadAnswers = generateMockAnswers();

    const xmlString = convertArrayToXML(downloadAnswers);
    console.log(xmlString);
    return xmlString; // This data should arrive from another function as an array
}

async function getXSLTStylesheetToStyleDownloadedFile() {
    const filePath = "../downloadTemplate.xslt"; // Stien til XSLT-filen, hvor ".." går en mappe tilbage

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error('Fejl ved indlæsning af XSLT-filen: ' + xhr.statusText));
                }
            }
        };
        xhr.send();
    });
}

async function transformXMLToText(xmlData) {
    const xsltStylesheet = await getXSLTStylesheetToStyleDownloadedFile();

    const xsltProcessor = new XSLTProcessor();
    const parser = new DOMParser();
    const xsltDocument = parser.parseFromString(xsltStylesheet, "text/xml");
    xsltProcessor.importStylesheet(xsltDocument);
    const transformedText = xsltProcessor.transformToFragment(parser.parseFromString(xmlData, "text/xml"), document);

    return transformedText.textContent;
}
async function downloadResults() {
    const fileName = "quiz-results.txt";
    const xmlData = await generateDataForDownload();
    console.log(xmlData);
    const transformedText = await transformXMLToText(xmlData);

    const file = new Blob([transformedText], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(file);
    downloadLink.href = url;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}