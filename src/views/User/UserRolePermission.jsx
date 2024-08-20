import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import "../../assets/style/Sidebar.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post, get } from "../../services/api";
import { Link } from "react-router-dom";
const UserRolePermission = () => {
  const { state, dispatch } = useGlobalState();
  const { TableData, isFormOpen, LocationDropDown , RoleRights } = state;
  const [expandedMenu, setExpandedMenu] = useState(null);
  // const [RoleId, setRoleId] = useState(0);
  const [formData, setFormData] = useState({
    RoleId: 0,
    RoleName: "",
  });

  useEffect(() => {
    BindRole();
    userRoleRight();
  }, []);

  useEffect(() => {
    if (formData.RoleId !== 0) {
      userRoleRight();
    }
  }, [formData.RoleId]);

  const handleToggleExpand = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const handleSelectAll = (id, checked) => {
    // Logic to handle select all functionality
    const updatedData = TableData.map((item) =>
      item.ParentMenuId === id
        ? {
            ...item,
            MenuFlage: checked,
            CanView: checked,
            CanAdd: checked,
            CanEdit: checked,
            CanDelete: checked,
          }
        : item
    );
    dispatch({ type: "TABLE_DATA", payload: updatedData });
  };

  const handleUpdateCheckAll = (id, checked, type) => {
    // Logic to handle individual checkbox updates

    if (type == "checkall") {
      const updatedData = TableData.map((item) =>
        item.OperationId === id
          ? {
              ...item,
              MenuFlage: checked,
              CanView: checked,
              CanAdd: checked,
              CanEdit: checked,
              CanDelete: checked,
            }
          : item
      );

      dispatch({ type: "TABLE_DATA", payload: updatedData });
    } else {
      const updatedData = TableData.map((item) =>
        item.OperationId === id ? { ...item, [type]: checked } : item
      );
      dispatch({ type: "TABLE_DATA", payload: updatedData });
    }
  };

  // Filter and map the data to get distinct ParentMenuName values
  const BindRole = async () => {
    const data = await get("DropDown/GetFillRole");
    if (Array.isArray(data.RoleDetails)) {
      dispatch({ type: "Fill_DROPDOWN", payload: data.RoleDetails });
    }
  };

  const parentMenus = Array.from(
    new Set(
      TableData.filter((item) => item.ParentMenuName).map(
        (item) => item.ParentMenuName
      )
    )
  );
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Delete existing role rights
      const deleteResponse = await post("UserMaster/DeleteUserRolePerMission", {
        Id: formData.RoleId,
        Deleteby: 1, // Replace with actual user id or name
      });

      if (deleteResponse != null) {
        // Prepare data to add new role permissions
        const msg="";
        TableData.forEach(async (item) => {
          if (
            item.CanView ||
            item.CanAdd ||
            item.CanEdit ||
            item.CanImport ||
            item.CanExport
          ) {
            const req = {
              OperationId: item.OperationId,
              ParentMenuName: item.ParentMenuName || "",
              OperationName: item.OperationName || "",
              ActionUrl: item.ActionUrl || "",
              ParentMenuId: item.ParentMenuId,
              SeqNo: item.SeqNo,
              IsActive: item.IsActive,
              ImgClassName: item.ImgClassName || "",
              CanAdd: item.CanAdd || false,
              CanArrange: false,
              CanDelete: item.CanDelete || false,
              CanEdit: item.CanEdit || false,
              CanExport: item.CanExport || false,
              CanImport: item.CanImport || false,
              CanView: item.CanView || false,
              RoleID: formData.RoleId,
              MenuFlage: item.MenuFlage || false,
            };

            const addResponse = await post(
              "UserMaster/AddUserRolePerMission",
              req
            );

            if (addResponse.errCode === "1001") {
             
            } else {
             msg=addResponse.errInfo;
            }
          }
        
        });
        if(msg==""){
         
            toast.success("Rights Updated Successfully!");
         
        }
        // Add new role permissions

        // Fetch the updated role permissions
        const response = await get("UserMaster/GetUserRoleRights?id=" + 0);
        const data = response.UserRolePermissionMasterDetails;
        dispatch({ type: "TABLE_DATA", payload: data });

        setFormData({
          RoleId: 0,
          RoleName: "",
        });
        setExpandedMenu(null);
      }
    } catch (error) {
      toast.error("An error occurred while updating rights.");
    }
  };

  const userRoleRight = async () => {
    const response = await get(
      "UserMaster/GetUserRoleRights?id=" + formData.RoleId
    );
    const data = response.UserRolePermissionMasterDetails;
    dispatch({ type: "TABLE_DATA", payload: data });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // if (name === "RoleId") {
    //   setRoleId(value);
    // }
  };

  return (
    <>
      <div className="content-inner">
        <div className="page_header d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <Link to="/UserMaster/UserRole">
              <h2 className="page_title_sub">User Role</h2>
            </Link>
            <Link to="/UserMaster/User">
              <h2 className="page_title_sub">User</h2>
            </Link>
            <Link to="/UserMaster/UserRolePermission">
              <h2 className="page_title_sub active">Role Permission</h2>
            </Link>
          </div>
        </div>
        <form>
          <div>
            <div className="selectrole_header">
              <div className="d-flex justify-content-between align-items-end">
                <div className="col-3">
                  <div className="form-group d-flex align-items-center">
                    <label className="control-label">Select Role</label>
                    <select
                      id="RoleId"
                      name="RoleId"
                      value={formData.RoleId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a Role</option>
                      {LocationDropDown.map((location) => (
                        <option key={location.RoleId} value={location.RoleId}>
                          {location.RoleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex">
                  {/* <button class="btn trans_btn" id="btnreset">
                    Reset
                  </button> */}
          
                  <button
                    id="btnRolePermission"
                    className="btn primary_btn login-btn ms-3"
                    name="Command"
                    onClick={handleSaveChanges}
                    value="Save"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="role_head">
                <div className="row">
                  <div className="col">Menu</div>
                  <div className="col">
                    <div className="text-center">Select All</div>
                  </div>
                  <div className="col">
                    <div className="text-center">Allow View Only</div>
                  </div>
                  <div className="col">
                    <div className="text-center">Allow Add</div>
                  </div>
                  <div className="col">
                    <div className="text-center">Allow Update</div>
                  </div>
                  <div className="col">
                    <div className="text-center">Allow Delete</div>
                  </div>
                </div>
              </div>
              <div className="role_body c_scroll_white">
                {parentMenus.map((menuName, nn) => {
                  const subMenus = TableData.filter(
                    (item) => item.ParentMenuName === menuName
                  );
                  const { OperationId, MenuFlage, ParentMenuId } = subMenus[0];

                  return (
                    <div className="roletab_box mb-1" key={menuName}>
                      <div
                        className="roletab_head d-flex click-to-show"
                        onClick={() => handleToggleExpand(menuName)}
                      >
                        <div
                          className={`form-check ${
                            nn % 2 === 1 ? "row_alternate" : "row_normal"
                          }`}
                        >
                          <label className="form-check-label">{menuName}</label>
                        </div>
                        <input
                          type="checkbox"
                          className="form-check-input chkSelectall"
                          data-id={OperationId}
                          id={`chkSelectall_${OperationId}`}
                          name={`chkSelectall_${OperationId}`}
                          checked={Boolean(MenuFlage)}
                          onChange={(e) =>
                            handleSelectAll(ParentMenuId, e.target.checked)
                          }
                        />
                      </div>
                      {expandedMenu === menuName && (
                        <div className="hide-content">
                          <div className="roletab_data">
                            {subMenus.map((dr, index) => (
                              <div
                                className={`form_box ${
                                  index % 2 === 1
                                    ? "row_alternate"
                                    : "row_normal"
                                }`}
                                key={dr.OperationId}
                              >
                                <div className="row">
                                  <div className="col">{dr.OperationName}</div>
                                  <div className="col">
                                    <div className="text-center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input checkall"
                                        data-id={dr.OperationId}
                                        id={`chkcheckall_${dr.OperationId}`}
                                        checked={Boolean(
                                          dr.CanView &&
                                            dr.CanAdd &&
                                            dr.CanEdit &&
                                            dr.CanDelete
                                        )}
                                        onChange={(e) =>
                                          handleUpdateCheckAll(
                                            dr.OperationId,
                                            e.target.checked,
                                            "checkall"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div className="text-center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`chkCanView_${dr.OperationId}`}
                                        name={`chkCanView_${dr.OperationId}`}
                                        checked={Boolean(dr.CanView)}
                                        onChange={(e) =>
                                          handleUpdateCheckAll(
                                            dr.OperationId,
                                            e.target.checked,
                                            "CanView"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div className="text-center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`chkCanAdd_${dr.OperationId}`}
                                        name={`chkCanAdd_${dr.OperationId}`}
                                        checked={Boolean(dr.CanAdd)}
                                        onChange={(e) =>
                                          handleUpdateCheckAll(
                                            dr.OperationId,
                                            e.target.checked,
                                            "CanAdd"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div className="text-center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`chkCanEdit_${dr.OperationId}`}
                                        name={`chkCanEdit_${dr.OperationId}`}
                                        checked={Boolean(dr.CanEdit)}
                                        onChange={(e) =>
                                          handleUpdateCheckAll(
                                            dr.OperationId,
                                            e.target.checked,
                                            "CanEdit"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col">
                                    <div className="text-center">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`chkCanDelete_${dr.OperationId}`}
                                        name={`chkCanDelete_${dr.OperationId}`}
                                        checked={Boolean(dr.CanDelete)}
                                        onChange={(e) =>
                                          handleUpdateCheckAll(
                                            dr.OperationId,
                                            e.target.checked,
                                            "CanDelete"
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
             
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserRolePermission;
