/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

const npcPosition = new alt.Vector3(1, 1, 71);
const npc = new alt.Ped('u_m_m_streetart_01', npcPosition, 0);
npc.frozen = true;
npc.health = 8191;
npc.maxHealth = 8191;
//todo: make npc invinc

const colShape = new alt.ColshapeCircle(npcPosition.x, npcPosition.y, 3);
npc.setMeta('colshape', colShape);

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
