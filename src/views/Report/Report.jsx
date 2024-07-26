import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/style/Form.css";
import { useGlobalState } from "../../context/GlobalContext";

function Report() {
  const { state, dispatch } = useGlobalState();
  const { ReportType, FromDate, ToDate } = state;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    localStorage.setItem(name, value);
    dispatch({ type: 'SET_DATE', payload: { name, value } });
  };

  const validateDates = () => {
    const fromDate =  FromDate;
    const toDate = ToDate;
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date.");
      return false;
    }
    return true;
  };

  const handleReportClick = (path) => (e) => {
    e.preventDefault();
    if (validateDates()) {
      navigate(path);
    }
  };

  return (
    <div className="form-wrapper">
      <ToastContainer />
      <div>
        <form>
          <div className="user-report-container">
            <div className="form-group">
              <label htmlFor="ReportType">Select Report</label>
              <div>
                <select
                  className="form-control-custom"
                  id="ReportType"
                  name="ReportType"
                  value={ReportType}
                  onChange={handleChange}
                  required
                >
                  <option value="0">Please select</option>
                  <option value="1">Location Master</option>
                  <option value="2">Area/Building Master</option>
                  <option value="3">Department Master</option>
                  <option value="6">Device List</option>
                  <option value="7">Device Mapping</option>
                  <option value="6">Device Inventory</option>
                  <option value="8">Card Inventory</option>
                  <option value="9">User</option>
                  <option value="10">User Role</option>
                  <option value="14">Entity Master</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="FromDate">From Date</label>
              <div>
                <input
                  className="form-control-custom"
                  type="date"
                  id="FromDate"
                  name="FromDate"
                  value={FromDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="ToDate">To Date</label>
              <div>
                <input
                  className="form-control-custom"
                  type="date"
                  id="ToDate"
                  name="ToDate"
                  value={ToDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn-custom">
                Download
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="card-wrapper">
        <div className="card-custom">
          <div className="card-header-custom">Featured</div>
          <div className="card-body-custom">
            <h5 className="card-title-custom">Card Register Report</h5>
            <p className="card-text-custom">Generate Custom Report.</p>
            <Link
              to="/Report/CardReport"
              className="btn-custom"
              onClick={handleReportClick("/Report/CardReport")}
            >
              See Report
            </Link>
          </div>
        </div>
      </div>
      <div className="card-wrapper">
        <div className="card-custom">
          <div className="card-header-custom">Featured</div>
          <div className="card-body-custom">
            <h5 className="card-title-custom">Device Register Report</h5>
            <p className="card-text-custom">Generate Custom Report.</p>
            <Link
              to="/Report/DeviceReport"
              className="btn-custom"
              onClick={handleReportClick("/Report/DeviceReport")}
            >
              See Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
