import createElement from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const { player, name } = fighter;

    const title = `${player} win`.toUpperCase();

    // Modal body container
    const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });

    // Append winner name
    const nameElement = createElement({ tagName: 'div', className: 'modal-winner___name' });
    nameElement.innerText = name;
    bodyElement.appendChild(nameElement);

    // Append winner gif
    bodyElement.appendChild(createFighterImage(fighter));

    const onClose = () => {
        window.location.reload();
    };

    showModal({ title, bodyElement, onClose });
}
