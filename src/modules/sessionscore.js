function validateAnswersAndScore(userAnswer, correctAnswers) {
    //Keeping track of sum of possible points for later % calucation
    let totalPoints = localStorage.getItem('totalPoints');
    totalPoints = totalPoints ? parseInt(totalPoints) : 0;
    // Initialize points to zero if not already present in localStorage
    let points = localStorage.getItem('points');
    points = points ? parseInt(points) : 0;
    let isCorrect;

    // Validation for short answer questions and multiple choice with only one answer
    if (typeof userAnswer === 'string' && typeof correctAnswers === 'string') {
        isCorrect = userAnswer.toLowerCase() === correctAnswers.toLowerCase();
        totalPoints++;
        points = isCorrect ? points + 1 : points - 1;
        localStorage.setItem('points', points.toString());
    } //Validation if multiple choice has one answer but the user answered multiple
    else if (typeof userAnswer === 'object' && typeof correctAnswers === 'string') {
        userAnswer.forEach(answer => {
            if (answer.toLowerCase() === correctAnswers.toLowerCase()) {
                points++;
            } else {
                points--;
            }
        });
        totalPoints++;
        localStorage.setItem('points', points.toString());
    }//Validation for multiple choice with multiple answers
    else if (typeof userAnswer === 'object' && typeof correctAnswers === 'object') {
        let score = 0;
        for (let i = 0; i < userAnswer.length; i++) {
            if (correctAnswers.includes(userAnswer[i])) {
                score++;
            } else {
                score--;
            }
        }
        totalPoints += correctAnswers.length;
        points += score;
        localStorage.setItem('points', points.toString());
    } //Validation for multiple solutions with one answer
    else if (typeof userAnswer === 'string' && typeof correctAnswers === 'object') {
         // Conversion for comparison
         const userChoice = userAnswer.toLowerCase();
         const correctChoices = correctAnswers.map(answer => answer.toLowerCase());
 
         if (correctChoices.includes(userChoice)) {
             const index = correctChoices.indexOf(userChoice);
             correctChoices.splice(index, 1);
             points++;
             points -= correctChoices.length;
         } else {
             points -= correctChoices.length + 1;
         }
        totalPoints += correctAnswers.length;
        localStorage.setItem('points', points.toString());
    }
    return { totalPoints, points };
}
module.exports = validateAnswersAndScore;