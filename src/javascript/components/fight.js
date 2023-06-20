import controls from '../../constants/controls';

const pressedKeys = new Set();

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
        // resolve the promise with the winner when fight is over
        let winner = null;

        // Create new fighters object with additional keys
        const newFirstFighter = { ...firstFighter, hasUnblockCrit: false };
        const newSecondFighter = { ...secondFighter, hasUnblockCrit: false };

        console.warn(newFirstFighter);
        console.warn(newSecondFighter);

        // Handle key down event
        document.addEventListener('keydown', event => {
            event.preventDefault();

            // Get current pressed key
            const pressedKey = event.code;

            // If already in Set of pressed keys (prevent endless "same key" loop )
            if (pressedKeys.has(pressedKey)) return;

            pressedKeys.add(pressedKey);

            // Process actions depending on values in Set of pressed keys
            if (pressedKeys.has(controls.PlayerOneAttack)) {
                newSecondFighter.health -= getDamage(newFirstFighter, newSecondFighter);
            }

            if (pressedKeys.has(controls.PlayerTwoAttack)) {
                newFirstFighter.health -= getDamage(newSecondFighter, newFirstFighter);
            }

            if (newFirstFighter.health <= 0) {
                winner = newFirstFighter;
            } else if (newSecondFighter.health <= 0) {
                winner = newSecondFighter;
            }

            if (winner) {
                document.removeEventListener('keydown', () => {});
                document.removeEventListener('keyup', () => {});

                pressedKeys.clear();
                resolve(winner);
            }

            console.warn(newFirstFighter.health);
            console.warn(newSecondFighter.health);
            console.warn(pressedKeys);
        });

        // Handle key up event
        document.addEventListener('keyup', event => {
            event.preventDefault();
            pressedKeys.delete(event.code);
        });
    });
}
