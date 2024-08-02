import React from "react";
import "../App.css";
import { post } from "../services/api";
const CountHeader = ({ totalCount, activeCount, inactiveCount }) => {
  return (
    <div className="location_filter d-flex align-items-center mb-2">
      <div className="location_box color_purple text-center">
        <div>Total</div>
        <p>{totalCount}</p>
      </div>
      <div className="location_box color_green text-center">
        <div>Active</div>
        <p>{activeCount}</p>
      </div>
      <div className="location_box color_red text-center">
        <div>
        Inactive
        </div>
        <p>{inactiveCount}</p>
      </div>
    </div>
  );
};
export default CountHeader;

export function InventoryCount({ count }) {
  return (
   
     
      <div className="location_filter d-flex align-items-center mb-2">
      <div className="location_box color_purple text-center">
        <div>Received</div>
        <p>{count[0].ReceivedCount}</p>
      </div>
      <div className="location_box color_blue text-center">
        <div>In Transit</div>
        <p>{count[0].InTransitCount}</p>
      </div>
      <div className="location_box color_green text-center">
        <div>
        Allocated
        </div>
        <p>{count[0].AllocatedCount}</p>
      </div>
      <div className="location_box color_red text-center">
        <div>
        UnAllocated
        </div>
        <p>{count[0].UnAllocatedCount}</p>
      </div>
      <div className="location_box color_orange text-center">
        <div>
        Withdrawn
        </div>
        <p>{count[0].WithdrawnCount}</p>
      </div>
    </div>
  
  );
}

export function InventoryCardCount({ count }) {
  return (

     <div className="location_filter d-flex align-items-center mb-2">
     <div className="location_box color_purple text-center">
       <div>Functional</div>
       <p>{count[0].totalCountActiveInActive}</p>
     </div>
     <div className="location_box color_blue text-center">
       <div>Non Functional</div>
       <p>{count[0].inActiveCount}</p>
     </div>
     <div className="location_box color_green text-center">
       <div>
       Wear & Tear
       </div>
       <p>0</p>
     </div>
     <div className="location_box color_red text-center">
       <div>
       Lost
       </div>
       <p>0</p>
     </div>
     
   </div>
 
  );
}
