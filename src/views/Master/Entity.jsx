import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import "../../assets/style/Sidebar.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import CountHeader from "../../components/Count";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post, get } from "../../services/api";


const EntityMaster = () => {
  const { state, dispatch } = useGlobalState();
  const {
    TableData,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    LocationDropDown,
  } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    Id: 0,
    DeviceId: 0,
    deviceSerialNo: "",
    DeviceType: "",
    DeviceModelName: "",
    DeviceIp: "",
    LocationId: 0,
    formType: "Add",
  });

  const columnDefs = [
    {
      headerName: "Enroll ID",
      field: "EnrollID",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Entity Ad ID",
      field: "EntityADID",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Card ID",
      field: "CID",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Entity Name",
      field: "EmpName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Location",
      field: "LocationName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Area/Building",
      field: "AreaBuildingName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Department",
      field: "DepartmentName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "IsActive",
      cellRenderer: (params) => (
        <StatusButtonCell
          value={params.value}
          onUpdateStatus={() =>
            handleUpdateStatus(params.data.EmpId, !params.value)
          }
        />
      ),
      flex: 1,
      minWidth: 150,
    },
    {
      cellRenderer: () =>
        <td style={{color:'#0d6efd',opacity: '0.65'}}>Update</td>
    },
    {
      cellRenderer: () =>
        <td style={{color:'#0d6efd',opacity: '0.65'}}>Re-enroll</td>
    },
    // {
    //   cellRenderer: (params) => (
    //     <>
    //       <FaEdit
    //         style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
    //         onClick={() => {
    //           dispatch({ type: "TOGGLE_FORM" });
    //           setFormData({
    //             Id: params.data.Id,
    //             DeviceId: params.data.DeviceId,
    //             deviceSerialNo: params.data.DeviceSerialNo,
    //             DeviceType: params.data.DeviceType,
    //             DeviceModelName: params.data.DeviceModelName,
    //             DeviceIp: params.data.DeviceIp,
    //             LocationId: params.data.LocationId,
    //             formType: "Update",
    //           });
    //         }}
    //       />
    //       <FaTrash
    //         style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
    //         onClick={() => handleClickOpen(params.data.Id)}
    //       />
    //     </>
    //   ),
    //   flex: 1,
    //   minWidth: 150,
    // },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await get("Entity/GetAllEntity");
      const Entity = data.EntityEnrollMappingMasterDetails;
      dispatch({ type: "TABLE_DATA", payload: Entity });
      dispatch({
        type: "SET_COUNTS",
        payload: {
          totalCount: Entity.length,
          activeCount: Entity.filter((dev) => dev.IsActive).length,
          inactiveCount: Entity.filter((dev) => !dev.IsActive).length,
        },
      });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (empId, newStatus) => {
    try {
      await updateStatus(empId, newStatus, "EntityMaster");

      if (newStatus == 1) toast.success("Activated Successfully");
      else if (newStatus == 0) toast.error("Deactivate Successfully");

      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: [
          "DeviceId",
          "DeviceSerialNo",
          "DeviceType",
          "DeviceModelName",
          "DeviceIp",
          "LocationName",
          "IsActive",
        ],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const onGridReady = useCallback(
    (params) => {
      setGridApi(params.api);
      params.api.paginationSetPageSize(pageSize);
    },
    [pageSize]
  );

 

  return (
    <div className="content-inner">
      <>
        <CountHeader
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />
        <div className="grid-controls">
          <label>
            <span>Search: </span>
            <input
              type="text"
              onChange={handleQuickFilter}
              placeholder="Search..."
            />
          </label>
          <label>
            <FaDownload style={{ cursor: "pointer" }} onClick={handleExport} />
          </label>
        </div>
        <div className="ag-theme-alpine grid-container">
          <div style={{ height: "536px", width: "100%" }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={TableData}
              pagination
              paginationPageSize={pageSize}
              defaultColDef={{
                sortable: true,
                filter: true,
                flex: 1,
                minWidth: 150,
              }}
              enableBrowserTooltips
              floatingFilter
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </>
    </div>
  );
};

export default EntityMaster;
