/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

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

alt.onServer('entityEnterColshape', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Jää ... komm näher ...');
});

alt.onServer('entityLeaveColshape', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Jää ... Hau rein ...');
});
