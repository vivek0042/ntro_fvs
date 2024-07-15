import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from 'react-toastify'
import { get , post} from '../../services/api';
import { InventoryCount } from "../../components/Count";

const CardInventory = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    isFormOpen,
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [InvCount, setInvCount] = useState([]);
  const [LocationDropDown, setLocationDropDown] = useState([]);
  const [formData, setFormData] = useState({
    formType:"Add",
    CardId:0,
    Remark: "",
    CardStatus: 0,
    LocationId: 0,
    CardSerialNo: "",
  });

  const columnDefs = [
    {
      headerName: "Card Serial No",
      field: "Mcsn",
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
      headerName: "Card Type",
      field: "CardType",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "CardStatusName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Remark",
      field: "Remark",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },

    {
      cellRenderer: (params) => (
        <>
          <FaEdit
            style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
            onClick={() => {
              dispatch({ type: "TOGGLE_FORM", payload: params.data.CardId }) 
              setFormData({
                formType:"Update",
                CardId : params.data.CardId,
                Remark : params.data.Remark,
                CardStatus: params.data.CardStatus,
                LocationId: params.data.LocationId,
                CardSerialNo: params.data.Mcsn
               })
            }}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ];
  useEffect(() => {
    InventoryCountDetail();
    fetchData();
    BindLocation();
  }, []);

  const fetchData = async () => {
    try {
    const Cards = await get('Master/GetCardInventory');
    const data=Cards.CardInventoryDetails;
        if (Array.isArray(data)) {
         
          dispatch({ type: "SET_DEVICES", payload: data });
        }
       
       
    } catch (error) {
        console.error('Error fetching Cards:', error);
        return [];
      }
    
  };
  const InventoryCountDetail = async () => {
    const payload = {
      ParamName: "CardInventory",
      sDeviceSerialNo: "",
      sLocationId: 0,
      sCardStatusID: 0,
      sFromDate: "",
      sToDate: "",
      sAreaBuildingID: 0,
      sId: 0,
      sDeviceId: "",
      sDeviceModelName: "",
      sDeviceType: "",
      sLocationName: "",
      sDeviceIp: "",
      sMappingFlag: 0,
      sRemark: "",
      sIsActive: 0,
      userID: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      role: 0,
    };
    const res = await post("Master/InventoryCountDetailsFilter", payload);
    setInvCount(res.InventoryCountDeatils);
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (deviceId, newStatus) => {
    try {
      await updateStatus(deviceId, newStatus, "Device");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ["Mcsn", "LocationId", "CardType", "CardStatus", "Remark"],
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



  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
        formType:"Add",
        Remark: "",
        CardStatus: 0,
        LocationId: 0,
        CardSerialNo: "",
      });
  };

  const BindLocation = async () => {
    const data = await get('dropdown/getfilllocation');

    if (Array.isArray(data.LocationDetails)) {
      setLocationDropDown(data.LocationDetails);
    }
  };

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleAddCard = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    let body = {
      CardId:formData.CardId,
      CardSerialNo: formData.CardSerialNo,
      LocationId: Number(formData.LocationId),
      CardStatus: Number(formData.CardStatus),
      Remark: formData.Remark,
      Mcsn:"",
      LocationName:"",
      CardType:"",
      CardStatusName:"",
      CID:"",
    };

    try {
      const data = await post('master/AddCardInventory',body );

      if (data == []) {
        throw new Error("Failed to add");
      }

    
      handleAddCard();
      
      // Clear form fields
      setFormData({
          Remark: "",
          CardStatus: 0,
          LocationId: 0,
          CardSerialNo: "",
        });
        fetchData()
        toast.success(`Card ${formData.formType} Succesfully`);

    } catch (error) {
        toast.error("Error adding:" + error.message);
      console.error("Error adding:", error);
    }
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <div className="form-container">
          <form className="add-location-form" onSubmit={handleSubmit}>
            <h2>{formData.formType} Card</h2>
            <div className="form-group">
              <>
                <label htmlFor="CardSerialNo">Card Serial No</label>
                <input
                  type="text"
                  id="CardSerialNo"
                  name="CardSerialNo"
                  value={formData.CardSerialNo}
                  onChange={handleChange}
                  required
                />
                
                <label htmlFor="LocationId">Location</label>
                <select
                  id="LocationId"
                  name="LocationId"
                  value={formData.LocationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a location</option>
                  {LocationDropDown.map((location) => (
                    <option
                      key={location.LocationId}
                      value={location.LocationId}
                    >
                      {location.LocationName}
                    </option>
                  ))}
                </select>
                <label htmlFor="CardStatus">Card Status</label>
                <select
                  id="CardStatus"
                  name="CardStatus"
                  value={formData.CardStatus}
                  onChange={handleChange}
                  defaultValue = "0"
                  required
                >
                  <option value="0">Please select Status</option>
                  <option value="1">Received</option>
                  <option value="2">In Transist</option>
                  <option value="3">Allocated</option>
                  <option value="4">UnAllocated</option>
                  <option value="5">Withdrawn</option>
                  <option value="6">Issued</option>
                  <option value="7">Lost</option>
                </select>
                <label htmlFor="Remark">Remark</label>
                <input
                  type="text"
                  id="Remark"
                  name="Remark"
                  value={formData.Remark}
                  onChange={handleChange}
                  required
                />
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                 {formData.formType} Card
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
           {InvCount.length != 0 && <InventoryCount count={InvCount} />}
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
              <button className="btnDownload" onClick={handleExport}>
                Download
              </button>
              <button className="btnAdd" onClick={handleAddCard}>
                Add Card
              </button>
            </label>
          </div>
          <div className="ag-theme-alpine grid-container">
            <div style={{ height: "536px", width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={devices}
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
      )}
    </div>
  );
};

export default CardInventory;
