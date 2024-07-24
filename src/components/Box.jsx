import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { useGlobalState } from "../context/GlobalContext";

const Box = ({ data, LocationDropDown }) => {
  const { state, dispatch } = useGlobalState();
  const { isContactFormOpen, selectedContact, isCompanyFormOpen } = state;

  const [formContact, setForm] = useState({
    Id:0,
    Name: "",
    MobileNo: "",
    EmailId: "",
    LocationId: "",
    ContactPriority: "",
    companyName: '',
    LocationName: '',
    ContactInformation:'',
  });

  useEffect(() => {
    if (selectedContact && selectedContact.id === data.id) {
      setFormData({
        Id:selectedContact.Id || 0,
        ContactPersonName: selectedContact.ContactPersonName || "",
        MobileNo: selectedContact.MobileNo || "",
        EmailId: selectedContact.EmailId || "",
        LocationId: selectedContact.LocationId || "",
        ContactPriority: selectedContact.ContactPriority || "",
        companyName: '',
        LocationName: '',
        ContactInformation:'',
      });
    }
  }, [selectedContact, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openContactForm = () => {
    dispatch({ type: "TOGGLE_CONTACT_FORM", payload: data });
    dispatch({ type: "SET_SELECTED_CONTACT", payload: data });
    // dispatch({ type: "TOGGLE_COMPANY_FORM", payload: data.CompanyId }); 
    setFormData({
      Id:data.Id || 0,
      ContactPersonName: data.ContactPersonName || "",
      MobileNo: data.MobileNo || "",
      EmailId: data.EmailId || "",
      LocationId: data.LocationId || "",
      ContactPriority: data.ContactPriority || "",
      companyName: '',
      LocationName: '',
      ContactInformation:'',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://192.168.11.212:8070/api/master/AddcontactInformation";
      const method = "POST"; // Use PUT for update and POST for add

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact");
      }

      const result = await response.json();
      console.log("Contact saved successfully:", result);
      dispatch({ type: 'Table_Data', payload: result });
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const onClose = () => {
    dispatch({ type: "TOGGLE_CONTACT_FORM", payload: null });
    dispatch({ type: "SET_SELECTED_CONTACT", payload: null });
    // dispatch({ type: "TOGGLE_COMPANY_FORM", payload: null }); 
    setFormData({
      Id:0,
      ContactPersonName: "",
      MobileNo: "",
      EmailId: "",
      LocationId: "",
      ContactPriority: "",
      companyName: '',
      LocationName: '',
      ContactInformation:'',
    });
  };

  let ContactPriorityName;
  switch (data.ContactPriority) {
    case '1':
      ContactPriorityName = 'Primary Contact';
      break;
    case '2':
      ContactPriorityName = 'Secondary Contact';
      break;
    case '3':
      ContactPriorityName = 'Tertiary Contact';
      break;
    default:
      ContactPriorityName = 'Other Contact';
  }

  const location = LocationDropDown.find(location => location.LocationId === data.LocationId);
  const locationName = location ? location.LocationName : 'Unknown Location';

  return (
    <>
    
      <div className="box">
        <h3>{data.ContactPersonName}</h3>
        <p>{data.MobileNo}</p>
        <p>{data.EmailId}</p>
        <p>{locationName}</p>
        <p>{ContactPriorityName}</p>
        <FaEdit onClick={openContactForm} style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }} />
      </div>
      

      {isContactFormOpen && selectedContact && selectedContact.id === data.id && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>{selectedContact ? "Edit Contact" : "Add Contact"}</h2>
            <div className="form-group">
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                id="ContactPersonName"
                name="ContactPersonName"
                value={formData.ContactPersonName}
                onChange={handleChange}
                required
              />
              <label htmlFor="MobileNo">MobileNo</label>
              <input
                type="text"
                id="MobileNo"
                name="MobileNo"
                value={formData.MobileNo}
                onChange={handleChange}
                required
              />
              <label htmlFor="EmailId">Email</label>
              <input
                type="EmailId"
                id="EmailId"
                name="EmailId"
                value={formData.EmailId}
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
                value={formData.ContactPriority}
                onChange={handleChange}
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
              <button type="submit" className="btn btn-add">
                {selectedContact ? "Update Contact" : "Add Contact"}
              </button>
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Box;
