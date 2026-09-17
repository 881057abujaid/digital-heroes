export const generateUniqueNumbers = (count = 5) => {
    const numbers = new Set();

    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    return [...numbers].sort((a, b) => a - b);
};

export const calculatePrizeDistribution = (prizePool) => {
    const pool = Number(prizePool);

    return {
        THREE: Number((pool * 0.25).toFixed(2)),
        FOUR: Number((pool * 0.35).toFixed(2)),
        FIVE: Number((pool * 0.4).toFixed(2)),
    };
};

export const generateAlgorithmicNumbers = (
    scores,
    seed,
    count = 5
) => {
    if (!scores.length) {
        return generateUniqueNumbers(count);
    }

    const frequency = new Map();

    for (const score of scores) {
        frequency.set(score, (frequency.get(score) || 0) + 1);
    }

    const weightedNumbers = [];

    for (const [score, frequencyCount] of frequency.entries()) {
        for (let i = 0; i < frequencyCount; i++) {
            weightedNumbers.push(score);
        }
    }

    // Seeded pseudo-random generator
    let state = 0;

    for (const char of seed) {
        state = (state * 31 + char.charCodeAt(0)) >>> 0;
    }

    const random = () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
    };

    const selected = new Set();

    while (
        selected.size < count &&
        selected.size < frequency.size
    ) {
        const randomIndex = Math.floor(
            random() * weightedNumbers.length
        );

        selected.add(weightedNumbers[randomIndex]);
    }

    // Fill remaining numbers if fewer than 5
    // unique scores exist.
    if (selected.size < count) {
        const remaining = generateUniqueNumbers(45).filter(
            (number) => !selected.has(number)
        );

        for (const number of remaining) {
            selected.add(number);

            if (selected.size === count) {
                break;
            }
        }
    }

    return [...selected].sort((a, b) => a - b);
};

const testScores = [18, 18, 18, 22, 22, 27];

const seed = "bd0b8c19-cc4d-470c-9c62-23a5583788f6";

console.log(
    generateAlgorithmicNumbers(testScores, seed, 5)
);

console.log(
    generateAlgorithmicNumbers(testScores, seed, 5)
);

export const getMonthRange = (date) => {
    const value = new Date(date);

    const start = new Date(
        Date.UTC(
            value.getUTCFullYear(),
            value.getUTCMonth(),
            1
        )
    );

    const end = new Date(
        Date.UTC(
            value.getUTCFullYear(),
            value.getUTCMonth() + 1,
            1
        )
    );

    return {
        start,
        end,
    };
};