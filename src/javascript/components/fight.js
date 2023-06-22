import controls from '../../constants/controls';

// Extended objects of the fighters
let newFirstFighter = null;
let newSecondFighter = null;

// Winner in fight
let winner = null;

// SetInterval pointer
let critUpdateInterval = null;

// Function that resolve the fight promise
let fightResolve = null;

// Elements of health indicators
let firstFighterIndicator = null;
let secondFighterIndicator = null;

let updateIndicators = null;

// Contains held keys
const heldKeys = new Set();

// Contains keys that are used to perform actions in battle
const pressedKeys = new Set();

/**
 * Generate random number between min and max (include)
 *
 * @param {*} min Minimal (include)
 * @param {*} max Maximum (include)
 * @returns Random number
 */
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

/**
 * Process the keys that players pressed.
 * Depends on keys in pressedKeys make different actions
 *
 * @returns
 */
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
        pressedKeys.delete(controls.PlayerOneAttack);
    }

    // Process attacks when no blocked player two
    if (playerTwoCriticalHit) {
        if (newSecondFighter.hasUnblockCrit) {
            newFirstFighter.health -= 2 * newSecondFighter.attack;
            newSecondFighter.hasUnblockCrit = false;
        }
    } else if (pressedKeys.has(controls.PlayerTwoAttack)) {
        newFirstFighter.health -= getDamage(newSecondFighter, newFirstFighter);
        pressedKeys.delete(controls.PlayerTwoAttack);
    }
}

/**
 * Checks the health of both players and selects the winner
 */
function selectWinner() {
    if (newFirstFighter.health <= 0) {
        winner = newSecondFighter;
    } else if (newSecondFighter.health <= 0) {
        winner = newFirstFighter;
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

    // If already in Set of holding keys (prevent endless "same key" loop )
    if (heldKeys.has(pressedKey)) return;
    heldKeys.add(pressedKey);

    // Remember the key that was pressed
    pressedKeys.add(pressedKey);

    processFightKeys();

    updateIndicators(newFirstFighter.health, newSecondFighter.health);

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

    heldKeys.delete(event.code);
    pressedKeys.delete(event.code);
};

/**
 *
 * @param {*} initFirstFighter
 * @param {*} initSecondFighter
 * @returns
 */
const updateFighterIndicator = (initFirstFighter, initSecondFighter) => {
    const totalFirstFighterHealth = initFirstFighter.health;
    const totalSecondFighterHealth = initSecondFighter.health;

    return (firstHealth, secondHealth) => {
        const firstWidth = (firstHealth * 100) / totalFirstFighterHealth;
        const secondWidth = (secondHealth * 100) / totalSecondFighterHealth;

        firstFighterIndicator.style.width = firstWidth >= 0 ? `${Math.floor(firstWidth)}%` : 0;
        secondFighterIndicator.style.width = secondWidth >= 0 ? `${Math.floor(secondWidth)}%` : 0;
    };
};

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        // Create new fighters object with additional keys
        newFirstFighter = { ...firstFighter, hasUnblockCrit: false, player: 'left' };
        newSecondFighter = { ...secondFighter, hasUnblockCrit: false, player: 'right' };

        // Update special critical hit chance which can't be blocked
        critUpdateInterval = setInterval(() => {
            newFirstFighter.hasUnblockCrit = true;
            newSecondFighter.hasUnblockCrit = true;
        }, 10000);

        firstFighterIndicator = document.getElementById('left-fighter-indicator');
        secondFighterIndicator = document.getElementById('right-fighter-indicator');

        updateIndicators = updateFighterIndicator(firstFighter, secondFighter);

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
