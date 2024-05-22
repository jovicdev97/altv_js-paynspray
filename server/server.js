/// <reference types="@altv/types-server" />
import * as alt from 'alt-server'

// create npc (in gta its called Ped) helper func
function createPed(model, x, y, z, heading) {
    const ped = new alt.Ped(model, new alt.Vector3(x, y, z), new alt.Vector3(0, 0, heading));
    return ped;
  }
  
  function loadSprayNpc() {
    const ped1 = createPed('u_m_m_streetart_01', 1, 1, 71, 0);
  }
  
  loadSprayNpc(); //load npc