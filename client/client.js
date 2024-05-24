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
alt.onServer('entityLeaveColshape', () => {
    isInColshape = false;
});

// key press from player
alt.on('keydown', (key) => {
    if (key === 69 && isInColshape) { 
        alt.emitServer('playerPressedButtonE');
    }
});

// edit spawned npc
alt.on('gameEntityCreate', (ped) => {
    if (!(ped instanceof alt.Ped)) return
/*     setInterval(() => { */
        native.setEntityInvincible(ped, true);
        native.setBlockingOfNonTemporaryEvents(ped, true);
        native.taskStartScenarioInPlace(ped, 'WORLD_HUMAN_COP_IDLES', 0, true);
        native.taskSetBlockingOfNonTemporaryEvents(ped, true);
        native.setEntityProofs(ped, true, true, true, true, true, true, true, true);
        native.setPedTreatedAsFriendly(ped, 1, 0);
        for (let i = 0; i < 17; i++) {
          native.setRagdollBlockingFlags(ped, i);
        }
        native.taskPlayAnim(ped, 'rcmjosh1', 'idle', 8, 8, -1, 1, 0, false, false, false);
/*       }, 0); */
  });

  alt.onServer('wirdGesprayed', (player) => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'This will take 20s');
  })

alt.onServer('notify', () => {
    showNotification('CHAR_DEFAULT', 'Info', '', 'Bro .. back off !!');
});