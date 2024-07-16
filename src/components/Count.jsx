import React from 'react';
import '../App.css';
import { post } from '../services/api';
const CountHeader = ({totalCount,activeCount,inactiveCount}) => {
  

  return (
    <div className="page_header d-flex align-items-center justify-content-between pt-2 pb-2">
     
      <div className="pagehead_btn d-flex align-items-center">
        <div className="count">
          <span>Total: {totalCount}</span>
        </div>
        <div className="count">
          <span>Active: {activeCount}</span>
        </div>
        <div className="count">
          <span>Inactive: {inactiveCount}</span>
        </div>
      </div>
    </div>
  );
};
export default CountHeader;

export  function InventoryCount({count}){

  
  return(
    <div className="page_header d-flex align-items-center justify-content-between pt-2 pb-2">
     
      <div className="pagehead_btn d-flex align-items-center">
        <div className="Invcount">
          <span>Received: {count[0].ReceivedCount}</span>
        </div>
        <div className="Invcount">
          <span>In Transit: {count[0].InTransitCount}</span>
        </div>
        <div className="Invcount">
          <span>Allocated: {count[0].AllocatedCount}</span>
        </div>
        <div className="Invcount">
          <span>UnAllocated: {count[0].UnAllocatedCount}</span>
        </div>
        <div className="Invcount">
          <span>Withdrawn: {count[0].WithdrawnCount}</span>
        </div>
      
      </div>
    </div>
  );
}

