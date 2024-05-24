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
                const vehicle = player.vehicle;
                if (!vehicle) return;
                alt.emitClient(player, 'wirdGesprayed'); // for Notification
                alt.on('playerLeftVehicle', (player) => { // we want player to leave vehicle
                    vehicle.frozen = true;
                    vehicle.engineOn = false;
                    alt.setTimeout(() => {
                        vehicle.numberPlateText = generateRandomString();
                        vehicle.primaryColor = generateRandomNumberBetween1and159();
                        vehicle.secondaryColor = generateRandomNumberBetween1and159();
                        vehicle.dirtLevel = 15; // will make the car very dirty after work for police rp
                        vehicle.frozen = false;
                    }, 10000); // debugging: should change to notification value
                });
            } catch (error) {
                console.error(error);
            }
        });
        
    } else {
        console.error("error spawn");
    }
} catch (error) {
    console.error("error:", error);
}
