/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { generateRandomNumberBetween1and159, generateRandomString } from '../../npc-para/helper/helper.js';

const webviewUrl = "http://resource/client/html/index.html";

const createNPC = () => {
    const npcPosition = new alt.Vector3(-833.1956, -398.9011, 31.3187);

    try {
        const npc = new alt.Ped('S_M_Y_PestCont_01', npcPosition, 0);
        if (!npc) {
            console.error('Error: NPC could not be created.');
            return;
        }
        
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

        alt.onClient('playerPressedButtonE', handlePlayerPressButtonE);
        alt.onClient('sprayVehicleFromWebviewClientEvent', sprayVehicle);
        alt.onClient('changeNumberPlateFromFromWebview', changeNumberPlate);
        alt.onClient('closeWebView', closeWebView);
    } catch (error) {
        console.error(error);
    }
};

const handlePlayerPressButtonE = async (player) => {
    try {
        const hasPainted = player.getMeta('hasPainted');
        if (hasPainted) {
            alt.emitClient(player, 'notify');
            return;
        }

        const vehicle = player.vehicle;
        if (!vehicle) return;
        alt.emitClient(player, 'openWebView', webviewUrl);

    } catch (error) {
        console.error(error);
    }
};


const resetVehicle = (vehicle, player) => {
    vehicle.frozen = true;
    vehicle.engineOn = false;
    vehicle.lockState = 2;
    alt.emitClient(player, 'startwork');
    alt.setTimeout(() => {
        vehicle.numberPlateText = generateRandomString();
        vehicle.primaryColor = generateRandomNumberBetween1and159();
        vehicle.secondaryColor = generateRandomNumberBetween1and159();
        vehicle.dirtLevel = 15;
        vehicle.frozen = false;
        vehicle.lockState = 1;
        alt.emitClient(player, 'finishcar');
    }, 15000);
};


const sprayVehicle = (player) => {
    const vehicle = player.vehicle;
    if (!vehicle) return;

    const handlePlayerLeftVehicle = (playerLeavingVehicle) => {
        if (playerLeavingVehicle === player) {
            player.setMeta('hasPainted', true);
            resetVehicle(vehicle, player);
            alt.off('playerLeftVehicle', handlePlayerLeftVehicle);
        }
    };
    alt.on('playerLeftVehicle', handlePlayerLeftVehicle);
};

const changeNumberPlate = (player) => {
    const vehicle = player.vehicle;
    if (vehicle) {
        vehicle.numberPlateText = generateRandomString();
    }
};

const closeWebView = (player) => {
    alt.emitClient(player, 'closeWebView');
};

createNPC();
