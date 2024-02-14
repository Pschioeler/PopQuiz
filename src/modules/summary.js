//import possible other dependable modules
function displayAnswers(questionCount){
    //do some display magic here with each answered question
}
async function generateDataForDownload() {
    // The content in this function must follow the XSLT file format
    var fileContent = `
        <data>
            <content>Hello, World!</content>
        </data>
    `; // This data should arrive from another function as an array
    return fileContent;
}
async function getXSLTStylesheetToStyleDownloadedFile() {
    const filePath = "/Test/downloadTemplate.xslt"; // Just modify this path if the XSLT file is moved

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

module.exports = { generateDataForDownload, downloadResults};