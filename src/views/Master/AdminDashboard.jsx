import React, { useEffect, useState } from 'react';
import { useGlobalState } from "../../context/GlobalContext";
import { Bar, Pie } from 'react-chartjs-2';
import '../../assets/style/Dashboard.css';
import { del, post, get } from "../../services/api";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';

import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

const AdminDashboard = () => {
    const { state, dispatch } = useGlobalState();
    const {
        devices,
        totalCount,
        activeCount,
        inactiveCount,
        TableData,
        selectedContact,
        LocationDropDown

    } = state;

    ChartJS.register(
        BarElement,
        ArcElement,
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        ChartDataLabels,
        Legend
    );
    const [DeviceData, setDeviceData] = useState({});
    const [CardData, setCardData] = useState({});

    const GetFillLocation = async () => {
        try {
            const data = await get("DropDown/GetFillLocation");
            const final_data = data.LocationDetails;
            dispatch({
                type: "Fill_DROPDOWN",
                payload: final_data,
            });
        } catch (error) {
            console.error("Error fetching users count:", error);
        }
    }

    const GetMfuser = async () => {
        try {
            const data = await post("DashBoard/GetMFAUsers");
            dispatch({
                type: "SET_COUNTS",
                payload: {
                    totalCount: data[0].TotalUser,
                    activeCount: data[0].EnrolledUser,
                    inactiveCount: data[0].ReaminforEnrollment,
                },
            });
        } catch (error) {
            console.error("Error fetching MFA users:", error);
        }
    };
    const GetUserCount = async () => {
        try {
            const data = await get("Master/InActiveActiveCountDetails?StausCountPatam=User");
            dispatch({
                type: "Table_Data",
                payload: data,
            });
        } catch (error) {
            console.error("Error fetching users count:", error);
        }
    };

    const AuthData = async () => {
        try {
            const data = await post("DashBoard/AuthenticationHighchart");
            dispatch({
                type: "SET_DEVICES",
                payload: data,
            });
        } catch (error) {
            console.error("Error fetching Authentication data:", error);
        }
    };
    const GetEntityCount = async () => {
        try {
            const data = await get("Master/InActiveActiveCountDetails?StausCountPatam=EntityMaster");
            dispatch({
                type: "SET_SELECTED_CONTACT",
                payload: data,
            });
        } catch (error) {
            console.error("Error fetching Entity count:", error);
        }
    };
    const BindHighartbylocationid = async (param, id) => {
        const requestData = {
            param: param,
            LocationId: id,
        };

        try {
            const data = await post("DashBoard/Dashboardhighchartcountbylocationid", requestData);

            if (data.isRedirect) {
                window.location.href = data.redirectUrl;
                return;
            }

            if (data != null) {
                if (param === "DeviceInventory") {
                    setDeviceData({
                        Dtotal: data[0].Total,
                        Dtotal_received: data[0].ReceivedCount,
                        Dtotal_Transit: data[0].InTransitCount,
                        Dtotal_Allocated: data[0].AllocatedCount,
                        Dtotal_UnAllocated: data[0].UnAllocatedCount,
                        Dtotal_Withdrawn: data[0].WithdrawnCount,
                    });
                    //   DeviceHighchart();
                } else if (param === "CardInventory") {
                    setCardData({
                        Ctotal: data[0].Total,
                        Ctotal_received: data[0].ReceivedCount,
                        Ctotal_Transit: data[0].InTransitCount,
                        Ctotal_Allocated: data[0].AllocatedCount,
                        Ctotal_UnAllocated: data[0].UnAllocatedCount,
                        Ctotal_Withdrawn: data[0].WithdrawnCount,
                        Ctotal_Issued: data[0].IssuedCount,
                        Ctotal_Lost: data[0].LostCount,
                    });
                    //   CardHighchart();
                }
            }
        } catch (error) {
            console.error("Error fetching Authentication data:", error);
        }
    };

    const BindHighartWithoutlocationid = async () => {
        const requestData = {
            "StausCountPatam": "",
            "sDeviceSerialNo": "",
            "LocationId": 0,
            "CardStatusId": 0,
            "sFromDate": "",
            "ToDate": "",
            "AreaBuilding": 0,
            "sId": 0,
            "sDeviceId": "",
            "sDeviceModelName": "",
            "sDeviceType": "",
            "sLocationName": "",
            "sDeviceIp": "",
            "sMappingFlag": 0,
            "sRemark": "",
            "sIsActive": 0,
            "UserID": "",
            "FirstName": "",
            "LastName": "",
            "EmailAddress": "",
            "Role": 0,
            "sToDate": "",
            "ParamName": "DeviceInventory",
        };

        try {
            const AllData = await post("Master/InventoryCountDetailsFilter", requestData);
            const data = AllData.InventoryCountDeatils;

            if (data.isRedirect) {
                window.location.href = data.redirectUrl;
                return;
            }

            if (data != null) {
                setDeviceData({
                    Dtotal: data[0].Total,
                    Dtotal_received: data[0].ReceivedCount,
                    Dtotal_Transit: data[0].InTransitCount,
                    Dtotal_Allocated: data[0].AllocatedCount,
                    Dtotal_UnAllocated: data[0].UnAllocatedCount,
                    Dtotal_Withdrawn: data[0].WithdrawnCount,
                });
            }
        } catch (error) {
            console.error("Error fetching Authentication data:", error);
        }
    };
    const BindHighartWithoutlocationidcard = async () => {
        const requestData = {
            "StausCountPatam": "",
            "sDeviceSerialNo": "",
            "LocationId": 0,
            "CardStatusId": 0,
            "sFromDate": "",
            "ToDate": "",
            "AreaBuilding": 0,
            "sId": 0,
            "sDeviceId": "",
            "sDeviceModelName": "",
            "sDeviceType": "",
            "sLocationName": "",
            "sDeviceIp": "",
            "sMappingFlag": 0,
            "sRemark": "",
            "sIsActive": 0,
            "UserID": "",
            "FirstName": "",
            "LastName": "",
            "EmailAddress": "",
            "Role": 0,
            "sToDate": "",
            "ParamName": "CardInventory",
        };

        try {
            const AllData = await post("Master/InventoryCountDetailsFilter", requestData);
            const data = AllData.InventoryCountDeatils;

            if (data.isRedirect) {
                window.location.href = data.redirectUrl;
                return;
            }

            if (data != null) {
                setCardData({
                    Ctotal: data[0].Total,
                    Ctotal_received: data[0].ReceivedCount,
                    Ctotal_Transit: data[0].InTransitCount,
                    Ctotal_Allocated: data[0].AllocatedCount,
                    Ctotal_UnAllocated: data[0].UnAllocatedCount,
                    Ctotal_Withdrawn: data[0].WithdrawnCount,
                    Ctotal_Issued: data[0].IssuedCount,
                    Ctotal_Lost: data[0].LostCount,
                });
            }
        } catch (error) {
            console.error("Error fetching Authentication data:", error);
        }
    };

    const handleSelectChange = (event) => {
        const { value } = event.target;
        BindHighartbylocationid("DeviceInventory", value);
    };
    const handleSelectChangeCard = (event) => {
        const { value } = event.target;
        BindHighartbylocationid("CardInventory", value);
    };

    useEffect(() => {
        GetMfuser();
        AuthData();
        GetUserCount();
        GetEntityCount();
        GetFillLocation();
        BindHighartWithoutlocationidcard();
        BindHighartWithoutlocationid();
    }, []);

    const DeviceDatas = {
        labels: ['Allocated', 'UnAllocated', 'Received', 'InTransit', 'Withdrawn'],
        datasets: [
            {
                label: 'Device Inventory',
                data: [DeviceData.Dtotal_Allocated, DeviceData.Dtotal_UnAllocated, DeviceData.Dtotal_received, DeviceData.Dtotal_Transit, DeviceData.Dtotal_Withdrawn],
                backgroundColor: ['#aefb2a', '#e60b09', '#242acf', '#f3f520', '#f4762d'],
            },
        ],
    };
    const DeviceOptions = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Device Inventory',
            },
        },
    };

    const CardDatas = {
        labels: ['Allocated', 'UnAllocated', 'Received', 'Issued', 'InTransit', 'Withdrawn', 'Lost'],
        datasets: [
            {
                label: 'Card Inventory',
                data: [CardData.Ctotal_Allocated, CardData.Ctotal_UnAllocated, CardData.Ctotal_received, CardData.Ctotal_Issued, CardData.Ctotal_Transit, CardData.Ctotal_Withdrawn, CardData.Ctotal_Lost],
                backgroundColor: ['#aefb2a', '#e60b09', '#242acf', '#f3f520', '#f4762d', '#f40752', '#08203e'],
            },
        ],
    };
    const CardOptions = {
        indexAxis: 'x',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Card Inventory',
            },
        },
    };

    const TotalEntityCount = selectedContact && selectedContact.DatatableCountDetails && selectedContact.DatatableCountDetails.length > 0
        ? selectedContact.DatatableCountDetails[0].TotalCountActiveInActive
        : 0;

    const EntityActiveCount = selectedContact && selectedContact.DatatableCountDetails && selectedContact.DatatableCountDetails.length > 0
        ? selectedContact.DatatableCountDetails[0].ActiveCount
        : 0;

    const EntityInActiveCount = selectedContact && selectedContact.DatatableCountDetails && selectedContact.DatatableCountDetails.length > 0
        ? selectedContact.DatatableCountDetails[0].InActiveCount
        : 0;


    const EntityData = {
        labels: ['Total', 'Authenticated', 'UnAuthenticated'],
        datasets: [
            {
                label: 'Entities Count',
                data: [TotalEntityCount, EntityActiveCount, EntityInActiveCount],
                backgroundColor: ['#36A2EB', '#00e600', '#e60000'],
            },
        ],
    };
    const EntityOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Entities Count',
            },
        },
    };


    const TotalCount = TableData && TableData.DatatableCountDetails && TableData.DatatableCountDetails.length > 0
        ? TableData.DatatableCountDetails[0].TotalCountActiveInActive
        : 0;

    const ActiveCount = TableData && TableData.DatatableCountDetails && TableData.DatatableCountDetails.length > 0
        ? TableData.DatatableCountDetails[0].ActiveCount
        : 0;

    const InActiveCount = TableData && TableData.DatatableCountDetails && TableData.DatatableCountDetails.length > 0
        ? TableData.DatatableCountDetails[0].InActiveCount
        : 0;


    const UserData = {
        labels: ['Total Users', 'Active Users', 'Inactive Users'],
        datasets: [
            {
                label: 'User Count',
                data: [TotalCount, ActiveCount, InActiveCount],
                backgroundColor: ['#36A2EB', '#00e600', '#e60000'],
            },
        ],
    };
    const userOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Data',
            },
        },
    };

    const count3fa = devices.length > 0 ? devices[0].Count_3FA : 0;
    const count2fa = devices.length > 0 ? devices[0].Count_2FA : 0;
    const countnfa = devices.length > 0 ? devices[0].Count_NFA : 0;

    const chartData = {
        labels: ['Total Users', 'Active Users', 'Inactive Users'],
        datasets: [
            {
                label: 'MFA Transction',
                data: [totalCount, activeCount, inactiveCount],
                backgroundColor: ['#36A2EB', '#00e600', '#e60000'],
            },
        ],
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'MFA Transaction',
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value, context) => {
                    return value;
                },
                color: 'black',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    const pieChartData = {
        labels: ['3FA', '2FA', 'NFA'],
        datasets: [
            {
                label: 'Authentication Count',
                data: [count3fa, count2fa, countnfa],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Authentication Methods Distribution',
            },
        },
    };

    return (
        <>
            {/* for device */}

            {/* for Card Inventory */}

            <div className="AllCharts">
                <div className="MFUser">
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        
                        <Bar data={chartData} options={chartOptions} />
                       
                        <Link to="/Master/Card" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>
                <div className="AuthenticationUser">
                    <div style={{ width: '50%', margin: '0 auto' }}>
                        <Pie data={pieChartData} options={pieChartOptions} />
                        <Link to="/UserMaster/User" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>
                <div className="UserData">
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        <Bar data={UserData} options={userOptions} />
                        <Link to="/UserMaster/User" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>
                <div className="EntityData">
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        <Bar data={EntityData} options={EntityOptions} />
                        <Link to="/Master/EntityMaster" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>

                <div className="DeviceData">
                    <div className='LocationDropdownDevice'>
                        <select onChange={handleSelectChange}>
                            <option >Select a location</option>
                            {LocationDropDown.map((location) => (
                                <option
                                    key={location.LocationId}
                                    value={location.LocationId}
                                >
                                    {location.LocationName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        <Bar data={DeviceDatas} options={DeviceOptions} />
                        <Link to="/Master/Device-Inventory" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>

                <div className="CardData">
                    <div className='LocationDropdownCard'>
                        <select onChange={handleSelectChangeCard}>
                            <option >Select a location</option>
                            {LocationDropDown.map((location) => (
                                <option
                                    key={location.LocationId}
                                    value={location.LocationId}
                                >
                                    {location.LocationName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '70%', margin: '0 auto' }}>
                        <Bar data={CardDatas} options={CardOptions} />
                        <Link to="/Master/Card-Inventory" className="card-link">
                            See All
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
