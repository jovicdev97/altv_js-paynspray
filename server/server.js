/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

// helper for range https://docs.altv.mp/js/articles/snippets/math.html
function distance2d(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('distance2d => vector1 or vector2 is undefined');
    }

    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

const npcPosition = new alt.Vector3(1, 1, 71);
const interactionDistance = 5;
const npc = new alt.Ped('u_m_m_streetart_01', npcPosition, 0);

alt.everyTick(() => {
    alt.Player.all.forEach((player) => {
        const playerPosition = player.pos;
        const distanceToNPC = distance2d(playerPosition, npc.pos);
        if (distanceToNPC < interactionDistance) {
            alt.emitClient(player, 'playerEnteredNPCRange');
            alt.log(`${player.name} entered NPC range`);
        } else {
            alt.emitClient(player, 'playerLeftNPCRange');
            alt.log(`${player.name} left NPC range`);
        }
    });
});
