import React, { useState, useEffect } from "react";
import { get } from "../../services/api";
import { useGlobalState } from "../../context/GlobalContext";
import '../../assets/style/Sidebar.css';
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import logo from '../../assets/images/ntro_logo.svg'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const CompanyProfile = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    isFormOpen,
    TableData,
    LocationDropDown,
    isContactFormOpen,
    selectedContact,
  } = state;

  const [formData, setFormData] = useState({
    CompanyId: 0,
    CompanyName: "",
    Address: "",
    City: "",
    zipcode: "",
    State: "",
    Country: "",
    formType: "Add",
  });

  //for contact
  const [formContact, setFormContact] = useState({
    Id: 0,
    ContactPersonName: "",
    MobileNo: "",
    EmailId: "",
    LocationId: "",
    ContactPriority: "",
    CompanyName: "",
    LocationName: "",
    ContactInformation: "",
  });


  const [ContactData, setContactData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchContactInfo();
  }, []);

  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const data = await get('Master/GetCompany');
      const devices = data.CompanyDetails;
      dispatch({ type: "SET_DEVICES", payload: devices });
    } catch (error) {
      console.error('Error fetching Company:', error);
    }
  };

  useEffect(() => {
    if (devices && devices.length > 0) {
      const firstDevice = devices[0];
      setFormData({
        CompanyId: firstDevice.CompanyId,
        CompanyName: firstDevice.CompanyName,
        Address: firstDevice.Address,
        City: firstDevice.City,
        zipcode: firstDevice.zipcode,
        State: firstDevice.State,
        Country: firstDevice.Country,
        formType: "Update"
      });
    }
  }, [devices]);

  //for contact
  useEffect(() => {
    if (TableData && TableData.length > 0) {
      const TableDatas = TableData[0];
      setFormContact({
        Id: TableDatas.Id || 0,
        ContactPersonName: TableDatas.ContactPersonName || "",
        MobileNo: TableDatas.MobileNo || "",
        EmailId: TableDatas.EmailId || "",
        LocationId: TableDatas.LocationId || "",
        ContactPriority: TableDatas.ContactPriority || "",
        CompanyName: '',
        LocationName: '',
        ContactInformation: '',
      });
    }
  }, [TableData]);


  //Fetch Data for Contact information
  const fetchContactInfo = async () => {
    try {
      const data = await get('Master/GetAllcontactInformation');
      const Contact = data.contactInformationDetails;
      dispatch({ type: "Table_Data", payload: Contact });
    } catch (error) {
      console.error('Error fetching Contact Information:', error);
    }
  };

  useEffect(() => {
    if (TableData && TableData.length > 0) {
      setContactData(TableData);
    }
  }, [TableData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let url = "http://192.168.11.212:8070/api/master/AddCompany";
    let body = {
      CompanyId: Number(formData.CompanyId),
      CompanyName: formData.CompanyName,
      Address: formData.Address,
      City: formData.City,
      zipcode: formData.zipcode,
      State: formData.State,
      Country: formData.Country,
      CompanyLogo: '',
      CompanyLogoName: '',
      CompanyShortName: '',
      Address1: '',
      formType: "Update",
    };
    //for contact
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to add");
      }

      const data = await response.json();
      fetchData();
      if (formData.formType === "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");

      setFormData({
        CompanyId: 0,
        CompanyName: "",
        Address: "",
        City: "",
        zipcode: "",
        State: "",
        Country: "",
        formType: "Update",
      });
    } catch (error) {
      toast.error("Error adding:" + error);
      console.error("Error adding:", error);
    }
  };
  const openContactForm = (contact) => {
    setFormContact({
      Id: contact.Id || 0,
      ContactPersonName: contact.ContactPersonName || "",
      MobileNo: contact.MobileNo || "",
      EmailId: contact.EmailId || "",
      LocationId: contact.LocationId || "",
      ContactPriority: contact.ContactPriority || "",
      CompanyName: '', // Or update as needed
      LocationName: contact.LocationName || '',
      ContactInformation: '', // Or update as needed
    });
    dispatch({ type: "TOGGLE_CONTACT_FORM" });
  };

  const priorityMap = {
    '1': 'Primary Contact',
    '2': 'Secondary Contact',
    '3': 'Tertiary Contact',
    '4': 'Other Contact'
  };

  const handleSubmitContact = async (event) => {
    event.preventDefault();
    const contactPriorityText = formContact.ContactPriority;

    let url = "http://192.168.11.212:8070/api/Master/AddcontactInformation";
    let body = {
      Id: Number(formContact.Id, 10) || 0,
      ContactPersonName: formContact.ContactPersonName || "",
      MobileNo: formContact.MobileNo || "",
      EmailId: formContact.EmailId || "",
      LocationId: formContact.LocationId || "",
      ContactPriority: contactPriorityText || "",
      CompanyName: '',
      LocationName: formContact.LocationName || '',
      ContactInformation: '',
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact");
      }

      const result = await response.json();
      toast.success(result.message || "Data Add successfully");

      setFormContact({
        Id: 0,
        ContactPersonName: "",
        MobileNo: "",
        EmailId: "",
        LocationId: "",
        ContactPriority: "",
        companyName: '',
        LocationName: '',
        ContactInformation: '',
      });

      fetchContactInfo();
      dispatch({ type: "TOGGLE_CONTACT_FORM", payload: false });
    } catch (error) {
      toast.error("Error saving contact:" + error);
      console.error("Error saving contact:", error);
    }
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    fetchData();
    setFormData({
      CompanyId: 0,
      CompanyName: "",
      Address: "",
      City: "",
      zipcode: "",
      State: "",
      Country: "",
      formType: "Add",
    });
  };

  //for contact
  const onCloseContact = () => {
    dispatch({ type: "TOGGLE_CONTACT_FORM", payload: null });
    dispatch({ type: "SET_SELECTED_CONTACT", payload: null });
    // dispatch({ type: "TOGGLE_COMPANY_FORM", payload: null }); 
    setFormContact({
      Id: 0,
      ContactPersonName: "",
      MobileNo: "",
      EmailId: "",
      LocationId: "",
      ContactPriority: "",
      CompanyName: '',
      LocationName: '',
      ContactInformation: '',
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChangeContact = (e) => {
    const { name, value } = e.target;
    setFormContact((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddCompany = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };
  const getLocationNameById = (locationId) => {
    const location = LocationDropDown.find(location => location.LocationId == locationId);
    return location ? location.LocationName : 'Unknown Location';
  };


  return (
    <>
      <div className="content-inner">
        {isFormOpen ? (
          <div className="form-container">
            <form className="add-location-form" onSubmit={handleSubmit}>
              <h2>{formData.formType} </h2>
              <div className="form-group">
                <>
                  <label htmlFor="CompanyName">Company Name</label>
                  <input
                    type="text"
                    id="CompanyName"
                    name="CompanyName"
                    value={formData.CompanyName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="Address">Address</label>
                  <input
                    type="text"
                    id="Address"
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="zipcode">PinCode</label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="City">City</label>
                  <input
                    type="text"
                    id="City"
                    name="City"
                    value={formData.City}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="State">State</label>
                  <input
                    type="text"
                    id="State"
                    name="State"
                    value={formData.State}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="Country">Country</label>
                  <input
                    type="text"
                    id="Country"
                    name="Country"
                    value={formData.Country}
                    onChange={handleChange}
                    required
                  />
                </>
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn btn-add" onClick={handleSubmit}>
                  {formData.formType} Company
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
        ) :

          isContactFormOpen ? (
            <div className="form-container">
              <form className="add-location-form" onSubmit={handleSubmitContact}>
                {/* <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2> */}
                <div className="form-group">
                  <label htmlFor="ContactPersonName">Name</label>
                  <input
                    type="text"
                    id="ContactPersonName"
                    name="ContactPersonName"
                    value={formContact.ContactPersonName}
                    onChange={handleChangeContact}
                    required
                  />
                  <label htmlFor="MobileNo">Mobile No</label>
                  <input
                    type="text"
                    id="MobileNo"
                    name="MobileNo"
                    value={formContact.MobileNo}
                    onChange={handleChangeContact}
                    required
                  />
                  <label htmlFor="EmailId">Email</label>
                  <input
                    type="email"
                    id="EmailId"
                    name="EmailId"
                    value={formContact.EmailId}
                    onChange={handleChangeContact}
                    required
                  />
                  <label htmlFor="LocationId">Location</label>
                  <select
                    id="LocationId"
                    name="LocationId"
                    value={formContact.LocationId}
                    onChange={handleChangeContact}
                    required
                  >
                    <option value="">Select Location</option>
                    {LocationDropDown.map((loc) => (
                      <option key={loc.LocationId} value={loc.LocationId}>
                        {loc.LocationName}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="ContactPriority">Contact Priority</label>
                  <select
                    id="ContactPriority"
                    name="ContactPriority"
                    value={formContact.ContactPriority}
                    onChange={handleChangeContact}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="1">Primary Contact</option>
                    <option value="2">Secondary Contact</option>
                    <option value="3">Tertiary Contact</option>
                    <option value="4">Other Contact</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn btn-add " onClick={handleSubmitContact}>
                    Add Contact
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={onCloseContact}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )
            : (

              <>
                <nav className="navbar">
                  <div className="navbar-left">
                    <span className="navbar-logo"><h3>Company List</h3></span>
                  </div>
                  <div className="navbar-right">

                    <button className="nav-button">Import Bulk</button>
                  </div>
                </nav>
                <div className="header">
                  <img src={logo} alt="Logo" />
                  <div className="company-info">
                    <label className="company_name">
                      <h1>{formData.CompanyName}</h1>
                    </label>
                    <label className="Address">
                      <h2>{formData.City}, {formData.Address}, {formData.City}-{formData.zipcode}</h2>
                    </label>
                    <label className="Small_Address">
                      <h3>{formData.City}, {formData.State}-{formData.Country}</h3>
                    </label>
                  </div>
                  <FaEdit onClick={handleAddCompany} className="edit-icon" />
                </div>


                {/* Code for Contact information */}
                <div className="navbar-left ">
                  <button className="nav-button  " id="addcontactbutton" onClick={openContactForm}>Add Contact</button>


                </div>
                <div className="parent-wrapper">
                  <div className="parent-container">
                    {ContactData.slice(0, 4).map((data) => (
                      <div className="box" key={data.Id}>
                        <h3>{data.ContactPersonName}</h3>
                        <p>{data.MobileNo}</p>
                        <p>{data.EmailId}</p>
                        <p>{getLocationNameById(data.LocationId)}</p>
                        <p>{priorityMap[data.ContactPriority]}</p>

                        <FaEdit
                          onClick={() => openContactForm(data)} // Ensure data is passed here
                          style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
                        />
                      </div>
                    ))}


                  </div>
                </div>
                <div className="grid-controls"></div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete Device"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this contact?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
      </div>
    </>
  );
};

export default CompanyProfile;
