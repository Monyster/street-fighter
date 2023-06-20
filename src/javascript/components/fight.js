import controls from '../../constants/controls';

// Generate random number integer (1 or 2)
const getRandomChance = (min, max) => {
    return Math.random() * (max - min) + min;
};

export function getHitPower(fighter) {
    const { attack } = fighter;

    const criticalHitChance = getRandomChance(1, 2);
    const power = attack * criticalHitChance;

    return power;
}

export function getBlockPower(fighter) {
    // return block power
    const { defense } = fighter;

    const dodgeChance = getRandomChance(1, 2);
    const power = defense * dodgeChance;

    return power;
}

export function getDamage(attacker, defender) {
    return getHitPower(attacker) - getBlockPower(defender);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        if (firstFighter) {
            console.warn(controls);
            resolve(firstFighter);
        } else {
            resolve(secondFighter);
        }

        // resolve the promise with the winner when fight is over
    });
}
