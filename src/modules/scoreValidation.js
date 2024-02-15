//Funktion hvis der er flere korrekte svar og bruger svar
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

function checkAnswers(questions) {
    // Iterate igennem question array
    questions.forEach((question, index) => {
        // Tjek om bruger svar er array
        if (Array.isArray(question.userAnswers)) {
            // Tjek om korrektesvar er array eller single value
            const isCorrect = Array.isArray(question.korrekteSvar)
                ? arraysEqual(question.korrekteSvar, question.userAnswers)
                : question.userAnswers.length === 1 && question.userAnswers[0] === question.korrekteSvar;
            if (isCorrect) {
                question.korrekt = true;
                console.log(`Question ${index + 1}: Correct!`);
            } else {
                question.korrekt = false;
                console.log(`Question ${index + 1}: Incorrect!`);
            }
        } else {
            console.log(`Question ${index + 1}: No user answers provided.`);
        }
    });
}
