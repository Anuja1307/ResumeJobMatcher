function calculateFinalScore({
    semanticScore,
    skillsScore,
    experienceScore
}) {

    const finalScore =
        (semanticScore * 0.60) +
        (skillsScore * 0.30) +
        (experienceScore * 0.10);

    return Math.round(finalScore);
}


module.exports = {
    calculateFinalScore
};