/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { generateRandomNumberBetween1and159, generateRandomString } from '../helper/helper.js';

const npcPosition = new alt.Vector3(-833.1956, -398.9011, 31.3187);

try {
    const npc = new alt.Ped('u_m_m_streetart_01', npcPosition, 0);
    if (npc) {
        npc.frozen = true;
        const colShape = new alt.ColshapeCircle(npcPosition.x, npcPosition.y, 5);
        npc.setMeta('colshape', colShape);
        npc.setMeta('visible', true);

        alt.on('entityEnterColshape', (colshape, entity) => {
            if (entity instanceof alt.Player && colshape === colShape) {
                alt.emitClient(entity, 'entityEnterColshape');
            }
        });

        alt.on('entityLeaveColshape', (colshape, entity) => {
            if (entity instanceof alt.Player && colshape === colShape) {
                alt.emitClient(entity, 'entityLeaveColshape');
            }
        });

        alt.onClient('playerPressedButtonE', async (player) => {
            try {
                const hasPainted = player.getMeta('hasPainted');
                if (hasPainted) {
                    alt.emitClient(player, 'notify');
                    return;
                }
                const vehicle = player.vehicle;
                if (!vehicle) return;
    
                player.setMeta('hasPainted', true);                // add meta to player
                alt.emitClient(player, 'wirdGesprayed');           // for Notification

                /* 
                # Add the listener as a arrow function 
                # This will help to avoid event stacking such as when the player hit multiple times E
                # and the event will be called multiple times
                */

                const handlePlayerLeftVehicle = (playerLeavingVehicle) => {
                    if (playerLeavingVehicle === player) {
                        vehicle.frozen = true;
                        vehicle.engineOn = false;
                        vehicle.lockState = 2;
                        alt.setTimeout(() => {
                            vehicle.numberPlateText = generateRandomString();
                            vehicle.primaryColor = generateRandomNumberBetween1and159();
                            vehicle.secondaryColor = generateRandomNumberBetween1and159();
                            vehicle.dirtLevel = 15; // will make the car very dirty after work for police rp
                            vehicle.frozen = false;
                            vehicle.lockState = 1;
                        }, 10000); // debugging: should change to notification value
                        alt.off('playerLeftVehicle', handlePlayerLeftVehicle); // remove the listener to avoid event stacking
                    }
                };
                alt.on('playerLeftVehicle', handlePlayerLeftVehicle);
            } catch (error) {
                console.error(error);
            }
        });
    } else {
        console.error("error");
    }
} catch (error) {
    console.error(error);
}