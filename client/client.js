/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

let webview = null;
let audio = null;
let isInColshape = false;

function playLocalSound(filePath, volume = 1) {
    if (audio) {
        try {
            audio.destroy();
        } catch (error) {
            console.error(error);
        }
    }
    try {
        audio = new alt.Audio(filePath);
        audio.volume = volume;
        audio.addOutput(new alt.AudioOutputFrontend());
        audio.play();
    } catch (error) {
        console.error(error);
    }
}

function createWebView(url) {
    if (webview) return;
    try {
        webview = new alt.WebView(url, true);
        console.log('Webview loaded on client');
        webview.focus();
        alt.showCursor(true);
        alt.toggleGameControls(false);
        alt.toggleVoiceControls(false);
        playLocalSound('/client/assets/wav/yo_pal.mp3');

        webview.on('sprayVehicleFromWebview', () => {
            alt.emitServer('sprayVehicleFromWebviewClientEvent');
            playLocalSound('/client/assets/wav/after_accept.mp3');
            showNotification('CHAR_DEFAULT', 'Info', '', 'Leave your car and let the mechanics cook.');
        });

        webview.on('changeNumberPlateFromFromWebview', () => {
            alt.emitServer('changeNumberPlateFromFromWebview');
            playLocalSound('/client/assets/wav/after_accept.mp3');
            showNotification('CHAR_DEFAULT', 'Info', '', 'Leave your car and let the mechanics cook.');
        });

        webview.on('closeWebView', () => {
            destroyWebView();
        });
    } catch (error) {
        console.error(error);
    }
}

function destroyWebView() {
    if (!webview) return;
    try {
        alt.showCursor(false);
        alt.toggleGameControls(true);
        alt.toggleVoiceControls(true);
        webview.destroy();
        webview = null;
    } catch (error) {
        console.error(error);
    }
    
    if (audio) {
        try {
            audio.destroy();
            audio = null;
        } catch (error) {
            console.error(error);
        }
    }
}

alt.on('keydown', (key) => {
    if (key === 69 && isInColshape) { 
        alt.emitServer('playerPressedButtonE');
    }
});

alt.onServer('openWebView', (url) => {
    createWebView(url);
});

alt.onServer('closeWebView', () => {
    destroyWebView();
});

alt.onServer('entityEnterColshape', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Press E to change your vehicle color and numberplate');
    isInColshape = true;
});

alt.onServer('entityLeaveColshape', () => {
    isInColshape = false;
});

alt.onServer('notify', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'This car is too hot for the mechanic. You should leave this place.');
    playLocalSound('/client/assets/wav/go_away.mp3');
});

alt.onServer('startwork', () => {
    playLocalSound('/client/assets/wav/get_to_spray.mp3'); 
});

alt.onServer('finishcar', () => {
    playLocalSound('/client/assets/wav/rdy_car.mp3'); 
});

alt.on('gameEntityCreate', (entity) => {
    if (!(entity instanceof alt.Ped)) return;
    alt.setTimeout(() => {
        try {
            native.setEntityInvincible(entity, true);
            native.setBlockingOfNonTemporaryEvents(entity, true);
            native.taskStartScenarioInPlace(entity, 'WORLD_HUMAN_COP_IDLES', 0, true);
            native.taskSetBlockingOfNonTemporaryEvents(entity, true);
            native.setEntityProofs(entity, true, true, true, true, true, true, true, true);
            native.setPedTreatedAsFriendly(entity, 1, 0);
            native.setPedFleeAttributes(entity, 15, true);
            for (let i = 0; i < 17; i++) {
                native.setRagdollBlockingFlags(entity, i);
            }
            native.taskPlayAnim(entity, 'rcmjosh1', 'idle', 8, 8, -1, 1, 0, false, false, false);
        } catch (error) {
            console.error(error);
        }
    }, 500);
});

function showNotification(imageName, headerMsg, detailsMsg, message) {
    try {
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
    } catch (error) {
        console.error(error);
    }
}
