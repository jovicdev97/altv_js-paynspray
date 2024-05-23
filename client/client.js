/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

let isNearNPC = false;

alt.onServer('playerEnteredNPCRange', () => {
    if (!isNearNPC) {
        isNearNPC = true;
        showNotification('CHAR_DEFAULT', 'Info', '', 'Du bist in der Nähe des NPCs');
    }
});

alt.onServer('playerLeftNPCRange', () => {
    if (isNearNPC) {
        isNearNPC = false;
    }
});

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
