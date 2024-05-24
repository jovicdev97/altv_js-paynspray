/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

// show ingame notification when enter colshape
function showNotification(imageName, headerMsg, detailsMsg, message) {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(
        imageName.toUpperCase(),
        imageName.toUpperCase(),
        false,
        4,
        headerMsg,
        detailsMsg,
        1.0,
        ''
    );
    native.endTextCommandThefeedPostTicker(false, false);
}

// colshape
let isInColshape = false;

alt.onServer('entityEnterColshape', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Press E to change your vehicle color and numberplate');
    isInColshape = true;
});
/* alt.onServer('entityLeaveColshape', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Jää ... Hau rein ...');
    isInColshape = false;
}); */

// key press from player
alt.on('keydown', (key) => {
    if (key === 69 && isInColshape) { 
        alt.emitServer('playerPressedButtonE');
    }
});
