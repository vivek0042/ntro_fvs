import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useGlobalState } from "../../context/GlobalContext";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { post } from "../../services/api";
import { AgGridReact } from "ag-grid-react";
import {FaEdit,FaRegWindowClose, FaCheck } from "react-icons/fa";
import "../../assets/style/BulkUpload.css"

const BulkUploadLocation = () => {
    const { state, dispatch } = useGlobalState();
    const { devices, TableData } = state;
    const [file, setFile] = useState(null);
    const [sampleColumns, setSampleColumns] = useState([]);
    const [uploadedColumns, setUploadedColumns] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);
    const [message, setMessage] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [gridApi, setGridApi] = useState(null);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [validate, setvalidate] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [editRowId, setEditRowId] = useState(null);
    const [CountData, setCountData] = useState({
        allDataCnt: 0,
        validDataCnt: 0,
        missingDatCnt: 0,
        duplicateDataCnt: 0,
        inValidDataCnt: 0,
        validMappingCnt: 0,
        bulkImportLocationList: []
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch('/Templetes/ImportLocation.xlsx')
            .then((response) => response.blob())
            .then((blob) => readExcelFile(blob, setSampleColumns))
            .catch((error) => console.error('Error loading sample file:', error));
    }, []);
    
    useEffect(() => {
        compareColumns()
    }, [uploadedColumns]);

    const readExcelFile = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
            callback(headers);
            // Parse the whole data if needed
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setUploadedData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                setFile(selectedFile);
                setMessage('File Selected Successfully!');
                readExcelFile(selectedFile, setUploadedColumns);
                setFileName(selectedFile.name);
                setFileSize((selectedFile.size / 1024).toFixed(2) + ' KB');
            } else {
                setMessage('Invalid file type. Please select an .xlsx or .xls file.');
            }
        } else {
            setMessage('No file selected.');
        }
    };

    const handleUpload = () => {
        if (file) {
            setTimeout(() => {
                compareColumns();
            }, 2000);
        } else {
            setMessage('Please select a file first.');
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = "/Templetes/ImportLocation.xlsx";
        link.download = "ImportLocation.xlsx";
        link.click();
    };

    const columns = [
        { headerName: 'ID', field: 'importId', hide: true },
        { headerName: 'Location Name', field: 'locationName' },
        { headerName: 'Description', field: 'description' },
    ];

    const col = [
        { headerName: 'ID', field: 'TransId', hide: true },
        {
            headerName: 'Location Name',
            field: 'LocationName',
            cellRenderer: (params) => {
                return editRowId === params.data.TransId ? (
                    <input
                        type="text"
                        defaultValue={params.value}
                        onBlur={(e) => {
                            saveChanges(params.data.TransId, e.target.value);
                        }}
                    />
                ) : (
                    params.value
                );
            }
        },
        { headerName: 'Description', field: 'Reason' },
        { headerName: 'Status', field: 'Status' },
        {
            headerName: 'Actions',
            cellRenderer: (params) => {
                const isEditing = editRowId === params.data.TransId;
                const status = params.data.Status;

                return (
                    <div>
                        {isEditing ? (
                            <div>
                                <FaRegWindowClose
                                    className="btn"
                                    title="Cancel"
                                    onClick={() => setEditRowId(null)}
                                />

                                <FaCheck
                                    className="btn"
                                    title="Save"
                                    onClick={() => {
                                        const inputElement = document.querySelector(`input[data-id="${params.data.TransId}"]`);
                                        if (inputElement) {
                                            const newValue = inputElement.value;
                                            saveChanges(params.data.TransId, newValue);
                                        } else {
                                            console.error("Input element not found");
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <FaEdit
                                    className="btn sprite policy_edit_btn"
                                    title="Edit"
                                    onClick={() => EditDuplicate(params.data.TransId)}
                                />
                                    
                            </>
                        )}
                    </div>
                );
            }
        }
    ];
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };

    const handleNextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };
    const fetchAllData = async (bulkUploadParam, impParam) => {
        try {
            const response = await post(`BulkUpload/BulkImportDataCountDetails?BulkuploadParam=${bulkUploadParam}&impParam=${impParam}`);

            if (response) {
                dispatch({ type: "SET_DEVICES", payload: response[0].bulkImportLocationList });
            }
        } catch (error) {
            console.error("Error during bulk import:", error);
        }
    };

    const ValidateData = async () => {
        const impParam = 'Location';
        try {
            const response = await post(`BulkUpload/BulkSaveImportLocation?ImportParam=${impParam}`);
            if (response != 0) {
                dispatch({ type: "Table_Data", payload: response });
            }
        } catch (error) {
            console.error("Error during bulk import:", error);
        }
        setvalidate(true);
    };

    const EditDuplicate = (id) => {
        setEditRowId(id);
    }

    const Export = async () => {
        const impParam = 'Location';
        try {
            const response = await post(`BulkUpload/BulkSaveImportDataFromMaster?ImportParam=Location`);

            if (response.megSts) {
                alert(response.meg);
                window.location.href = '/Master/location-master';
            }
        } catch (error) {
            console.error("Error during bulk import:", error);
        }
    };
    const compareColumns = () => {
        if (uploadedColumns.length !== sampleColumns.length) {
            setMessage('The number of columns in the uploaded file does not match the sample file.');
            return;
        }
        else {
            setMessage('Perfect column matches');
        }


        for (let i = 0; i < sampleColumns.length; i++) {
            if (uploadedColumns[i] !== sampleColumns[i]) {
                setMessage('The names of the columns in the uploaded file do not match the sample file.');
                return;
            }

        }

        setMessage('');
    };

    const saveChanges = async (id, newValue) => {
        var loc =
        {
            TransId: id,
            LocationName: newValue,
            ImportParamName: "Location",
            Remark: "",
            UserId: "",
            Remarks: "",
            CardSrNo: "",
            DeviceIp: "",
            LastName: "",
            Password: "",
            ImportId: 0,
            RoleName: "",
            FirstName: "",
            ModelName: "",
            CardStatus: "",
            Department: "",
            DeviceSrNo: "",
            DeviceType: "",
            EntityADID: "",
            Description: "",
            DeviceStatus: "",
            EmailAddress: "",
            DeviceSerialNo: "",
            ArabLocationName: "",
            AreabuildingName: "",
            cardLocationName: "",
            DeptLocationName: "",
            DeviceLocationName: ""
        }
        try {
            const response = await post('BulkUpload/BulkUpdateDuplicateData', loc);
            if (response != 0) {
                dispatch({ type: "Table_Data", payload: response });
            }
        } catch (error) {
            console.error("Error in updates:", error);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }
        if (uploadedColumns.length === 0) {
            alert("No data found in the file.");
            return;
        }
        const requestData = uploadedData.map(item => ({
            LocationName: item.Location || "",
            ImportParamName: "Location",
            Remark: "",
            UserId: "",
            Remarks: "",
            CardSrNo: "",
            DeviceIp: "",
            LastName: "",
            Password: "",
            ImportId: 0,
            TransId: 0,
            RoleName: "",
            FirstName: "",
            ModelName: "",
            CardStatus: "",
            Department: "",
            DeviceSrNo: "",
            DeviceType: "",
            EntityADID: "",
            Description: "",
            DeviceStatus: "",
            EmailAddress: "",
            DeviceSerialNo: "",
            ArabLocationName: "",
            AreabuildingName: "",
            CardLocationName: "",
            DeptLocationName: "",
            DeviceLocationName: ""
        }));

        try {
            const response = await fetch("http://192.168.11.212:8070/api/BulkUpload/ImportLocation", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.isRedirect) {
                window.location.href = data.redirectUrl;
                return;
            }

            if (data) {
                const aggregatedResponse = data.reduce((acc, item) => {
                    acc.allDataCnt += item.allDataCnt;
                    acc.validDataCnt += item.validDataCnt;
                    acc.missingDatCnt += item.missingDatCnt;
                    acc.duplicateDataCnt += item.duplicateDataCnt;
                    acc.inValidDataCnt += item.inValidDataCnt;
                    return acc;
                }, {
                    allDataCnt: 0,
                    validDataCnt: 0,
                    missingDatCnt: 0,
                    duplicateDataCnt: 0,
                    inValidDataCnt: 0,
                    bulkImportLocationList: []
                });

                setCountData(aggregatedResponse);
            }

        } catch (error) {
            console.error("Error during bulk import:", error);
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setFileName(file.name);
            setFileSize((file.size / 1024).toFixed(2) + ' KB');
        }
    };

    const Merge = async () => {
        await handleFileUpload();
        await fetchAllData("AllDataValid", "Location");
        setOpen(true);
    }
    return (
        <>
            <ul className="nav nav-tabs align-items-center justify-content-between" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link rounded-circle mx-auto d-flex align-items-center justify-content-between ${currentStep === 1 ? 'active' : ''}`}
                        onClick={() => setCurrentStep(1)}
                    >
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="wizard_tabs d-flex align-items-center">
                                <p className="tab_number">01.</p>
                                <p className="ms-2">Upload File</p>
                            </div>
                        </div>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link rounded-circle mx-auto d-flex align-items-center justify-content-between ${currentStep === 2 ? 'active' : 'disabled'}`}
                        onClick={() => currentStep > 1 && setCurrentStep(2)}
                    >
                        <div className="d-flex align-items-center">
                            <div className="wizard_tabs d-flex align-items-center">
                                <p className="tab_number">02.</p>
                                <p className="ms-2">Columns Mapping</p>

                            </div>
                        </div>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link rounded-circle mx-auto d-flex align-items-center justify-content-between ${currentStep === 3 ? 'active' : 'disabled'}`}
                        onClick={() => currentStep > 2 && setCurrentStep(3)}
                    >
                        <div className="d-flex align-items-center">
                            <div className="wizard_tabs d-flex align-items-center">
                                <p className="tab_number">03.</p>
                                <p className="ms-2">Preview & Import</p>
                            </div>
                        </div>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link rounded-circle mx-auto d-flex align-items-center justify-content-between ${currentStep === 4 ? 'active' : 'disabled'}`}
                        onClick={() => currentStep > 3 && setCurrentStep(4)}
                    >
                        <div className="d-flex align-items-center">
                            <div className="wizard_tabs d-flex align-items-center">
                                <p className="tab_number">04.</p>
                                <p className="ms-2">Import</p>
                            </div>
                        </div>
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                {currentStep === 1 && (
                    <div className="tab-pane fade show active" id="step1" role="tabpanel" aria-labelledby="step1-tab">
                        <button className="nav-button" onClick={handleDownload}>
                            Download Template
                        </button>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <div
                            className="drop-zone"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            Drag and drop a file here or click to choose a file
                        </div>
                        {fileName && (
                            <div className="file-info">
                                <p>File Name: {fileName}</p>
                                <p>File Size: {fileSize}</p>
                            </div>
                        )}
                        <button className="upload-button" onClick={handleUpload}>
                            Upload
                        </button>
                        {message && <div className="dynamic-message">{message}</div>}
                        <button className="next-button" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="tab-pane fade show active" id="step2" role="tabpanel" aria-labelledby="step2-tab">
                        <h2>Columns in the Sample File:</h2>
                        <ul>
                            {sampleColumns.map((col, index) => (
                                <li key={index}>{col}</li>
                            ))}
                        </ul>
                        <h2>Columns in the Uploaded File:</h2>
                        <ul>
                            {uploadedColumns.map((col, index) => (
                                <li key={index}>{col}</li>
                            ))}
                        </ul>
                        {message && <p className="error-message">{message}</p>}
                        <button className="previous-button" onClick={handlePreviousStep}>
                            Previous
                        </button>
                        <button className="next-button" onClick={handleNextStep} disabled={!!message}>
                            Next
                        </button>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="tab-pane fade show active" id="step3" role="tabpanel" aria-labelledby="step3-tab">
                        <h2>Preview and Import Data</h2>
                        <button className="previous-button" onClick={handlePreviousStep}>
                            Previous
                        </button>
                        <button className="import-button" onClick={Merge}>
                            Import
                        </button>
                        <button className="next-button" onClick={handleNextStep} disabled={!open}>
                            Next
                        </button>

                        <div className="count-data">
                            <p>Total Data: {CountData.allDataCnt}</p>
                            <p>Valid Data: {CountData.validDataCnt}</p>
                            <p>Missing Data: {CountData.missingDatCnt}</p>
                            <p>Duplicate Data: {CountData.duplicateDataCnt}</p>
                            <p>Invalid Data: {CountData.inValidDataCnt}</p>
                        </div>

                        <div className="ag-theme-alpine grid-container">
                            <div style={{ height: "536px", width: "100%" }}>
                                <AgGridReact
                                    columnDefs={columns}
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
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="tab-pane fade show active" id="step4" role="tabpanel" aria-labelledby="step4-tab">
                        <h2>Import Data</h2>
                        <button className="previous-button" onClick={handlePreviousStep}>
                            Previous
                        </button>
                        <button className="import-button" onClick={ValidateData} >
                            validate
                        </button>
                        <button className="import-button" onClick={Export} disabled={!validate}>
                            Final Exoprt
                        </button>
                        <div className="count-data">
                            <p>Total Data: {CountData.allDataCnt}</p>
                            <p>Valid Data: {CountData.validDataCnt}</p>
                            <p>Missing Data: {CountData.missingDatCnt}</p>
                            <p>Duplicate Data: {CountData.duplicateDataCnt}</p>
                            <p>Invalid Data: {CountData.inValidDataCnt}</p>
                        </div>

                        <div className="ag-theme-alpine grid-container">
                            <div style={{ height: "536px", width: "100%" }}>
                                <AgGridReact
                                    columnDefs={col}
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
                    </div>
                )}
            </div>
        </>
    );
};

export default BulkUploadLocation;
