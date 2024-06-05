/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import * as native from 'natives';

let webview = null;
let audio = null;
let isInColshape = false;

function playLocalSound(filePath, volume = 1) {
    if (audio) {
        audio.destroy();
    }
    audio = new alt.Audio(filePath);
    audio.volume = volume;
    audio.addOutput(new alt.AudioOutputFrontend());
    audio.play();
}

function createWebView(url) {
    if (webview) return;
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
}

function destroyWebView() {
    if (!webview) return;
    alt.showCursor(false);
    alt.toggleGameControls(true);
    alt.toggleVoiceControls(true);
    webview.destroy();
    webview = null;
    
    if (audio) {
        audio.destroy();
        audio = null;
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
    showNotification('CHAR_DEFAULT', 'Info', '', 'This car is to hot for the mechanic. You should leave this place.');
    playLocalSound('/client/assets/wav/go_away.mp3');
});

alt.onServer('startwork', () => {
    playLocalSound('/client/assets/wav/get_to_spray.mp3'); 
});

alt.onServer('finishcar', () => {
    playLocalSound('/client/assets/wav/rdy_car.mp3'); 
});

alt.on('gameEntityCreate', (ped) => {
    if (!(ped instanceof alt.Ped)) return
    alt.setTimeout(() => {
        native.setEntityInvincible(ped, true);
        native.setBlockingOfNonTemporaryEvents(ped, true);
        native.taskStartScenarioInPlace(ped, 'WORLD_HUMAN_COP_IDLES', 0, true);
        native.taskSetBlockingOfNonTemporaryEvents(ped, true);
        native.setEntityProofs(ped, true, true, true, true, true, true, true, true);
        native.setPedTreatedAsFriendly(ped, 1, 0);
        native.setPedFleeAttributes(ped, 15, true);
        for (let i = 0; i < 17; i++) {
          native.setRagdollBlockingFlags(ped, i);
        }
        native.taskPlayAnim(ped, 'rcmjosh1', 'idle', 8, 8, -1, 1, 0, false, false, false);
    }, 500)
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
