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

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) {
        return fighterElement;
    }

    // todo: show fighter info (image, name, health, etc.)
    const fighterImage = createFighterImage(fighter);
    const fighterName = createFighterName(fighter);

    fighterElement.appendChild(fighterImage);
    fighterElement.appendChild(fighterName);

    return fighterElement;
}
