import controls from '../../constants/controls';

let newFirstFighter = null;
let newSecondFighter = null;

let winner = null;
let critUpdateInterval = null;

let fightResolve = null;

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
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);

    return blockPower > hitPower ? 0 : hitPower - blockPower;
}

function processFightKeys() {
    const playerOneCriticalHit = !controls.PlayerOneCriticalHitCombination.some(elem => {
        return !pressedKeys.has(elem);
    });

    const playerTwoCriticalHit = !controls.PlayerTwoCriticalHitCombination.some(elem => {
        return !pressedKeys.has(elem);
    });

    // Process actions depending on values in Set of pressed keys

    // Do nothing when player one now in block
    if (pressedKeys.has(controls.PlayerOneBlock) && pressedKeys.has(controls.PlayerOneAttack)) {
        return;
    }

    if (pressedKeys.has(controls.PlayerOneBlock) && pressedKeys.has(controls.PlayerTwoAttack)) {
        return;
    }

    if (pressedKeys.has(controls.PlayerOneBlock) && playerOneCriticalHit) {
        return;
    }

    // Do nothing when player two now in block
    if (pressedKeys.has(controls.PlayerTwoBlock) && pressedKeys.has(controls.PlayerTwoAttack)) {
        return;
    }

    if (pressedKeys.has(controls.PlayerTwoBlock) && pressedKeys.has(controls.PlayerOneAttack)) {
        return;
    }

    if (pressedKeys.has(controls.PlayerTwoBlock) && playerTwoCriticalHit) {
        return;
    }

    // Process attacks when no blocked player one
    if (playerOneCriticalHit) {
        if (newFirstFighter.hasUnblockCrit) {
            newSecondFighter.health -= 2 * newFirstFighter.attack;
            newFirstFighter.hasUnblockCrit = false;
        }
    } else if (pressedKeys.has(controls.PlayerOneAttack)) {
        newSecondFighter.health -= getDamage(newFirstFighter, newSecondFighter);
    }

    // Process attacks when no blocked player two
    if (playerTwoCriticalHit) {
        if (newSecondFighter.hasUnblockCrit) {
            newFirstFighter.health -= 2 * newSecondFighter.attack;
            newSecondFighter.hasUnblockCrit = false;
        }
    } else if (pressedKeys.has(controls.PlayerTwoAttack)) {
        newFirstFighter.health -= getDamage(newSecondFighter, newFirstFighter);
    }
}

function selectWinner() {
    if (newFirstFighter.health <= 0) {
        winner = newFirstFighter;
    } else if (newSecondFighter.health <= 0) {
        winner = newSecondFighter;
    }
}

/**
 * Checking is pressed button in Set and then skip or add this.
 * After process fight and winner select.
 *
 * @param {*} event key down event
 * @returns to avoid endless loop of keys
 */
const handlerFightKeyDown = event => {
    event.preventDefault();

    // Get current pressed key
    const pressedKey = event.code;

    // If already in Set of pressed keys (prevent endless "same key" loop )
    if (pressedKeys.has(pressedKey)) return;
    pressedKeys.add(pressedKey);

    console.warn(pressedKeys);

    processFightKeys();

    console.warn(newFirstFighter.health);
    console.warn(newSecondFighter.health);

    // Health check and select winner
    selectWinner();

    if (winner) {
        fightResolve();
    }
};

/**
 * Remove buttons from Set when it released
 *
 * @param {*} event key up event
 */
const handlerFightKeyUp = event => {
    event.preventDefault();

    pressedKeys.delete(event.code);
};

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        // Create new fighters object with additional keys
        newFirstFighter = { ...firstFighter, hasUnblockCrit: false };
        newSecondFighter = { ...secondFighter, hasUnblockCrit: false };

        // Update special critical hit chance which can't be blocked
        critUpdateInterval = setInterval(() => {
            newFirstFighter.hasUnblockCrit = true;
            newSecondFighter.hasUnblockCrit = true;
        }, 10000);

        // Handle key down event
        document.addEventListener('keydown', handlerFightKeyDown);

        // Handle key up event
        document.addEventListener('keyup', handlerFightKeyUp);

        // Create callback for resolving promise
        fightResolve = () => {
            document.removeEventListener('keydown', handlerFightKeyDown);
            document.removeEventListener('keyup', handlerFightKeyUp);
            clearInterval(critUpdateInterval);
            pressedKeys.clear();
            resolve(winner);
        };
    });
}
