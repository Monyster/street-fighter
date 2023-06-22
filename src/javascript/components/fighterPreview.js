import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

/**
 * Create an element that represents the name of the fighter
 *
 * @param {*} fighter Fighter
 * @returns <h1 class="fighter-preview___name">{fighter.name}</h1>
 */
function createFighterName(fighter) {
    const fighterName = createElement({ tagName: 'h1', className: 'fighter-preview___name' });
    fighterName.innerText = fighter.name;

    return fighterName;
}

/**
 * Creates parameter element fighter-preview___parameter.
 * Fill it with fighter-preview___parameter-ico
 * and fighter-preview___parameter-value
 *
 * @param {*} ico html unicode( example '&#10084;')
 * @param {*} value Number
 * @returns fighter-preview___parameter element
 */
function createFighterParameter(ico, value) {
    const fighterParameterBlock = createElement({ tagName: 'div', className: 'fighter-preview___parameter' });

    const parameterIco = createElement({ tagName: 'div', className: 'fighter-preview___parameter-ico' });
    parameterIco.innerHTML = ico;

    const parameterValue = createElement({ tagName: 'div', className: 'fighter-preview___parameter-value' });
    parameterValue.innerText = value;

    fighterParameterBlock.appendChild(parameterIco);
    fighterParameterBlock.appendChild(parameterValue);

    return fighterParameterBlock;
}

/**
 * Creates element to wrap parameters
 *
 * @returns Element fighter-preview___info
 */
function createInfoWrapper() {
    return createElement({ tagName: 'div', className: 'fighter-preview___info' });
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) {
        return fighterElement;
    }

    const fighterImage = createFighterImage(fighter);

    const fighterInfoWrapper = createInfoWrapper();

    const fighterName = createFighterName(fighter);
    fighterInfoWrapper.appendChild(fighterName);

    const fighterHealth = createFighterParameter('&#10084;', fighter.health);
    const fighterDefense = createFighterParameter('&#128737;', fighter.defense);
    const fighterAttack = createFighterParameter('&#9876;', fighter.attack);

    fighterInfoWrapper.appendChild(fighterHealth);
    fighterInfoWrapper.appendChild(fighterDefense);
    fighterInfoWrapper.appendChild(fighterAttack);

    fighterElement.appendChild(fighterImage);
    fighterElement.appendChild(fighterInfoWrapper);

    return fighterElement;
}
