import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postBionicV7Client from "../services/bionicv7.js";
import ntroLogo from "../assets/images/ntro_logo.svg";
import refresh_btn from "../assets/images/refresh_btn.svg";
import bioLogo from "../assets/images/bio_logo.svg";
import bioObj from "../assets/images/bio_object.svg";
import Password from "../assets/images/hide_passoword.svg";
import successIcon from "../assets/images/success_icon_right.svg";
import smartCardScan from "../assets/images/smartcard_scan.svg";
import bioMatricDevice from "../assets/images/biometric_device.svg";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { post } from "../services/api";
import { CheckPin } from "../services/transaction.js";
function Signin() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [hideShowPassword, setHideShowPaswword] = useState("Password");
  const [display, setDisplay] = useState({ display: "none" });
  const [captcha, setCaptcha] = useState("");
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
    remember: false,
    captcha: "",
  });
  const [loginPage, setLoginPage] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSessionTimer, setShowSessionTimer] = useState(false);
  const [dvPin, setDvPin] = useState(true);
  const [showPinError, setShowPinError] = useState(false);
  const [showPinSuccess, setShowPinSuccess] = useState(false);
  const [showCardSuccess, setShowCardSuccess] = useState(false);
  const [showAllSuccess, setShowAllSuccess] = useState(false);
  const [showDeviceUnplugged, setShowDeviceUnplugged] = useState(false);
  const [showCardUnplugged, setShowCardUnplugged] = useState(false);
  const [showFingerNotMatch, setShowFingerNotMatch] = useState(false);
  const [showDeviceConnected, setShowDeviceConnected] = useState(false);
  const [enrollment, setEnrollment] = useState(false);
  const [navPin, setNavPin] = useState(false);
  const [navCard, setNavCard] = useState(false);
  const [navBio, setNavBio] = useState(false);
  const [pinValues, setPinValues] = useState(new Array(6).fill(""));
  const [dataForUser, setDataForUser] = useState({});
  const handlePin = (value, index) => {
    if (value.length > 1) return;
    const newPinValues = [...pinValues];
    newPinValues[index] = value;
    setPinValues(newPinValues);

    // Move to the next input field if value is entered
    if (value !== "" && index < pinValues.length - 1) {
      document.getElementById(`pinInput${index + 1}`).focus();
    }
  };

  const toggleNavBio = () => setNavBio(!navBio);
  const toggleDvPin = () => setDvPin(dvPin);
  const toggleNavCard = () => setNavCard(!navCard);
  const toggleNavPin = () => setNavPin(!navPin);
  const toggleLoginPage = () => setLoginPage(!loginPage);
  const toggleenrollment = () => setEnrollment(!enrollment);
  const toggleForgotPassword = () => setShowForgotPassword(!showForgotPassword);
  const toggleSessionTimer = () => setShowSessionTimer(!showSessionTimer);
  const togglePinError = () => setShowPinError(!showPinError);
  const togglePinSuccess = () => setShowPinSuccess(!showPinSuccess);
  const toggleCardSuccess = () => setShowCardSuccess(!showCardSuccess);
  const toggleAllSuccess = () => setShowAllSuccess(!showAllSuccess);
  const toggleDeviceUnplugged = () =>
    setShowDeviceUnplugged(!showDeviceUnplugged);
  const toggleCardUnplugged = () => setShowCardUnplugged(!showCardUnplugged);
  const toggleFingerNotMatch = () => setShowFingerNotMatch(!showFingerNotMatch);
  const toggleDeviceConnected = () =>
    setShowDeviceConnected(!showDeviceConnected);
  const Navigate = useNavigate();
  useEffect(() => {
    generateCaptcha();
  }, []);
  const hideShow = () => {
    if (hideShowPassword == "Password") {
      setHideShowPaswword("text");
    } else {
      setHideShowPaswword("Password");
    }
  };

  function generateCaptcha() {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captcha);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const req = {
      UserName: formData.UserName,
      Password: formData.Password,
      RememberMe: Boolean(formData.remember),
    };
    const Entcaptcha = formData.captcha;

    if (Entcaptcha !== captcha) {
      toast.error("Invalid Captcha");
      setFormData({
        UserName: "",
        Password: "",
        remember: false,
        captcha: "",
      });
      generateCaptcha();
      return;
    }

    const response = await post("Account/UserLogin", req);
    setDataForUser(response);
    setFormData({
      UserName: "",
      Password: "",
      remember: false,
      captcha: "",
    });
    generateCaptcha();
    if (response.errCode === "106") {
      toast.error("UserName/Password is Incorrect");
      return;
    }
    if (response.cardType === 2 || response.cardType === 3) {
      toast.error("You have no Access, Please Contact the administrator");
    } else if (response.isActive === false) {
      toast.error("User is inactive, Please Contact the administrator");
    } else if (response.isLock === 1) {
      toast.error("User is Locked, Please Contact the administrator");
    }

    if (response.errCode === "0") {
      const options = {
        path: "/",
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      };

      if (response.authType == "1") {
        toggleLoginPage();
        toggleenrollment();
        toggleNavPin();
        toggleNavCard();
      }
      if (response.authType == "2") {
        toggleLoginPage();
        toggleenrollment();
        toggleNavPin();
        toggleNavCard();
        toggleNavBio();
      } else {
        Navigate("DashBoard/AdminDashBoard");
      }

      setCookie("loginId", response.UserName, options);
      setCookie("userroleid", response.userRole, options);
      setCookie("UserId", response.userName, options);
      setCookie("Name", response.name, options);
      setCookie("Cardtype", response.cardType, options);
      setCookie("AuthType", response.authType, options);
      setCookie("ADIDUser", response.adid, options);
      setCookie("RoleName", response.roleName, options);
      setCookie("CardSerialNo", response.cardSerialNo, options);
      setCookie("Mcsn", response.mcsn, options);
    }
    console.log(response);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePinVerify = async () => {
    const pin = pinValues.join("");
    var d = new Date();
    var txn = d.valueOf().toString();
    var _idx = "0";

    if (cookies.authType == "1") {
      _idx = "-1";
    }

    var data = {
      pin: pin,
      txn: txn,
      adid: dataForUser.userName,
      roleId: "1",
      cin: dataForUser.cardSerialNo,
      idx: _idx,
      mcsn: dataForUser.mcsn,
    };

    const response = await post("account/checkpin", data);

    var BionicV7Request = {
      reqdata: response,
    };
     var isBodyAvailable = 1;
    var method = "verification";
    const res =await postBionicV7Client(
      method,
      JSON.stringify(BionicV7Request),
      isBodyAvailable
    );
    //  var biteArray = StringToByteArrayFastest(res.resdata);
    // const decRes = await post("account/DecData", biteArray);
    if (res.data.ErrorCode == "0" && dataForUser.authType == 2) {
      var delay = 3000;
      var d = new Date();
      var txn = d.valueOf().toString();
      toggleDvPin();

      setTimeout(togglePinSuccess(), 500);
     // Show PIN success box after 1000 milliseconds (1 second)
      setTimeout(toggleCardSuccess(), 2500);
      setTimeout(function () {
        window.location.href = "/Dashboard/Admindashboard";
      }, delay); // Show Card success box after 2000 milliseconds (2 seconds)
    } else if (res.data.ErrorCode == "0" && dataForUser.authType == 1) {
      var delay = 3000;
      var d = new Date();
      var txn = d.valueOf().toString();
      toggleDvPin();
      setTimeout(togglePinSuccess(), 500); 
      // Show PIN success box after 1000 milliseconds (1 second)
      setTimeout(toggleCardSuccess(), 2500);
      setTimeout(function () {
        window.location.href = "/Dashboard/Admindashboard";
      }, delay); // Show Card success box after 2000 milliseconds (2 seconds)
    }
  };
  // function StringToByteArrayFastest(hex) {
  //   if (hex.Length % 2 == 1)
  //     throw new Exception("The binary key cannot have an odd number of digits");

  //   var arr = new byte[hex.Length >> 1]();

  //   for (let i = 0; i < hex.Length >> 1; ++i) {
  //     arr[i] = byte(
  //       (GetHexVal(hex[i << 1]) << 4) + GetHexVal(hex[(i << 1) + 1])
  //     );
  //   }
  //   function GetHexVal(hex) {
  //     var val = parseInt(hex);
  //     //For uppercase A-F letters:
  //     //return val - (val < 58 ? 48 : 55);
  //     //For lowercase a-f letters:
  //     //return val - (val < 58 ? 48 : 87);
  //     //Or the two combined, but a bit slower:
  //     return val - (val < 58 ? 48 : val < 97 ? 55 : 87);
  //   }
  //   return arr;
  // }
  function showPinSuccesss() {
    togglePinSuccess();
    toggleNavBio();
  }

  function showCardSuccesss() {
    togglePinSuccess();
    toggleCardSuccess();
  }

  return (
    <>
      {loginPage && (
        <div className="login-page bg-light">
          <div className="container">
            <div className="row">
              <div className="d-flex justify-content-center">
                <div className="col-lg-10">
                  <div className="color-grey rounded p-3">
                    <div className="row ms-md-0">
                      <div className="col-md-6 bg-white rounded">
                        <div className="form-left h-100 py-3 px-5">
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            <img src={ntroLogo} />
                            <span className="logo ms-2">NTRO</span>
                          </div>
                          <h3 className="mb-3 text-center">
                            Sign in to your account
                          </h3>

                          <div className="col-12">
                            <div className="form-group">
                              <label className="control-label">
                                AD User ID<span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control form-control-sm "
                                  onChange={handleChange}
                                  value={formData.UserName}
                                  id="UserName"
                                  name="UserName"
                                  placeholder="Enter User ID"
                                />
                                <i className="fas fa-lock"></i>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label className="control-label">
                                Password<span className="text-danger">*</span>
                              </label>
                              <div className="input-group">
                                <input
                                  type={hideShowPassword}
                                  className="form-control form-control-sm"
                                  onChange={handleChange}
                                  value={formData.Password}
                                  id="Password"
                                  name="Password"
                                  placeholder="Enter Password"
                                />
                                <span
                                  className="input-group-addon"
                                  role="button"
                                  title="view"
                                  id="passBtn"
                                >
                                  <img src={Password} onClick={hideShow} />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="row g-2">
                              <div className="d-flex justify-content-between">
                                <div className="form-group">
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm "
                                      id="captcha"
                                      name="captcha"
                                      onChange={handleChange}
                                      value={formData.captcha}
                                      placeholder="Enter User captcha"
                                      maxLength="6"
                                    />
                                    <i className="fas fa-lock"></i>
                                  </div>
                                </div>
                                <div className="form-group ps-2 pe-2">
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      value={captcha}
                                      name="captchacode"
                                      id="captchacode"
                                      disabled
                                      className="form-control form-control-sm captchacode"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="input-group">
                                    <a href="#" onClick={generateCaptcha}>
                                      <img
                                        src={refresh_btn}
                                        width="32"
                                        height="32"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {showForgotPassword && (
                            <div className="col-12">
                              <a
                                href="#"
                                className="float-end text-purple-1 forgot_pass"
                              >
                                Forgot Password?
                              </a>
                            </div>
                          )}
                          <div className="col-12">
                            <button
                              type="button"
                              name="btnsubmit"
                              className="signin_btn px-4 mt-1 login-btn"
                              onClick={handleSubmit}
                            >
                              Sign in
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ps-0 d-none d-md-block">
                        <div className="form-right h-100 text-center">
                          <div className="text-center">
                            <img src={bioLogo} />
                            <img className="mt-3" src={bioObj} />
                          </div>
                          <p>Powered by Mantra Softech India PVT.LTD</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {enrollment && (
        <div className="ep_page bg-light" id="enrollmentmainblock">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 m-auto">
                <div className="enrollmentbox rounded">
                  <div className="row ms-md-0 me-md-0">
                    <div className="col-lg-4 d-lg-block d-none pe-0 ps-0">
                      <div className="elbox_left text-center">
                        <div className="text-center">
                          <img src={bioLogo} />
                          <img className="bio_object" src={bioObj} />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8 col-xl-8">
                      <div className="elbox_right rounded d-flex">
                        <div className="elbox_data">
                          <div className="elbox_header">
                            <div className="name">
                              Name:<span id="uname">{cookies.UserId}</span>
                            </div>
                            <div className="id">
                              AD ID : <span id="adid">{cookies.Mcsn}</span>
                            </div>
                            <div className="role">
                              Role : <span id="role">{cookies.RoleName}</span>
                            </div>
                          </div>
                          <div className="elbox_body">
                            <ul
                              className="verticalwiz nav nav-tabs"
                              id="nav-tab"
                              role="tablist"
                            >
                              {navPin && (
                                <li
                                  className="nav-link before-line active"
                                  id="nav-pin"
                                  data-bs-target="#nav-pin-tab"
                                  data-bs-toggle="tab"
                                  aria-controls="nav-pin-tab"
                                  role="tab"
                                  aria-selected="true"
                                >
                                  <a href="#tab1" className="active">
                                    <span className="step">
                                      <label>1</label>
                                    </span>
                                    <span className="title">PIN</span>
                                  </a>
                                </li>
                              )}
                              {navCard && (
                                <li
                                  className="nav-link before-line"
                                  id="nav-card"
                                  data-bs-target="#nav-card-tab"
                                  data-bs-toggle="tab"
                                  aria-controls="nav-card-tab"
                                  role="tab"
                                  aria-selected="false"
                                >
                                  <a href="#tab2">
                                    <span className="step">
                                      <label>2</label>
                                    </span>
                                    <span className="title">Smart Card</span>
                                  </a>
                                </li>
                              )}
                              {navBio && (
                                <li
                                  className="nav-link"
                                  id="nav-biometric"
                                  data-bs-target="#nav-biometric-tab"
                                  data-bs-toggle="tab"
                                  aria-controls="nav-biometric-tab"
                                  role="tab"
                                  aria-selected="false"
                                >
                                  <a href="#tab3">
                                    <span className="step">
                                      <label>3</label>
                                    </span>
                                    <span className="title">Biometric</span>
                                  </a>
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="elbox_footer">
                            {showSessionTimer && (
                              <div className="timer_box">
                                <p>Session time (ms)</p>
                                <span>02:02</span>
                              </div>
                            )}
                            <div className="button_box">
                              <a className="btn" href="/Account/AdminLogin">
                                Home
                              </a>
                              <a className="btn" href="/Account/AdminLogin">
                                Reset
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="rightab">
                          <div className="tab-content">
                            <div
                              className="tab-pane active"
                              id="nav-pin-tab"
                              role="tabpanel"
                              aria-labelledby="nav-pin-tab"
                            >
                              {dvPin && (
                              <div id="dvPin">
                                <div className="tabbody d-flex justify-content-between">
                                  <div className="tabbody_header">
                                    <div className="tabbody_title mb-2">
                                      PIN Authentication
                                    </div>
                                    <div className="tabbody_sub_title">
                                      Please Enter your 6 digit pin for
                                      verification
                                    </div>
                                  </div>
                                  <div className="tabbody_data" id="dvPindata">
                                    <div className="row g-2" id="pinerrorbox">
                                      {pinValues.map((pinValue, index) => (
                                        <div className="col" key={index}>
                                          <input
                                            type="text"
                                            className="form-control form-control-sm auto-tab"
                                            maxLength="1"
                                            id={`pinInput${index}`}
                                            value={pinValue}
                                            onChange={(e) =>
                                              handlePin(e.target.value, index)
                                            }
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    </div>
                                  {showPinSuccess && (
                                    <p
                                      className="pinerror_login color_red"
                                      id="pinerror_login"
                                    ></p>
                                  )}
                                  {showPinError && (
                                    <p
                                      className="pinerror_login color_red"
                                      id="Failpinerror_login"
                                    ></p>
                                  )}
                                  <div className="tabbody_footer">
                                    <button
                                      className="btn primary_btn login-btn"
                                      type="button"
                                      id="btnVerifyPin"
                                      onClick={handlePinVerify}
                                    >
                                      Next Smart Card
                                    </button>
                                  </div>
                                </div>
                              </div>)}
                              {showPinSuccess && (
                                <div
                                  className="tabbody msgBox"
                                  id="pin_successfull_box"
                                >
                                  <div className="d-flex justify-content-between">
                                    <div className="successfull_msg">
                                      <div className="tabbody_header">
                                        <div className="tabbody_title mb-2">
                                          PIN Authentication
                                        </div>
                                        <div className="tabbody_sub_title mb-3">
                                          Please Enter your 6 digit pin for
                                          verification
                                        </div>
                                      </div>
                                      <div className="tabbody_data success_main">
                                        <div className="smartcard_box">
                                          <img
                                            className="success_icon"
                                            src={successIcon}
                                            alt=""
                                          />
                                          <p className="thanksmsg_success">
                                            Pin Authentication Successful
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {showCardSuccess && (
                                <div
                                  className="tabbody msgBox"
                                  id="card_successfull_box"
                                >
                                  <div className="d-flex justify-content-between">
                                    <div className="successfull_msg">
                                      <div className="tabbody_header">
                                        <div className="tabbody_title mb-2">
                                          Card Authentication
                                        </div>
                                        <div className="tabbody_sub_title mb-3">
                                          Keep/Wave Smart card on the device for
                                          verification
                                        </div>
                                      </div>
                                      <div className="tabbody_data success_main">
                                        <div className="smartcard_box">
                                          <img
                                            className="success_icon"
                                            src={successIcon}
                                            alt=""
                                          />
                                          <p className="thanksmsg_success">
                                            Card Authentication Successful
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {showAllSuccess && (
                                <div
                                  className="tabbody msgBox"
                                  id="successfull_box"
                                >
                                  <div className="d-flex justify-content-between">
                                    <div className="successfull_msg">
                                      <div className="tabbody_data success_main">
                                        <div className="smartcard_box">
                                          <img
                                            className="success_icon"
                                            src={successIcon}
                                            alt=""
                                          />
                                          <p className="thanksmsg_success">
                                            All Authentication Successful
                                          </p>
                                        </div>
                                        <div className="tabbody_footer w-100">
                                          <button
                                            className="btn primary_btn login-btn green_btn"
                                            type="button"
                                            onClick={Navigate(
                                              "/Home/Admindashboard"
                                            )}
                                          >
                                            Go to application{" "}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {showDeviceUnplugged && (
                                <div id="dvdeviceUnplugged">
                                  <div className="tabbody d-flex justify-content-between">
                                    <div className="tabbody_header">
                                      <div className="tabbody_title mb-2">
                                        Smart Card Authentication
                                      </div>
                                      <div className="tabbody_sub_title">
                                        Keep/Wave Smart card on the device for
                                        verification
                                      </div>
                                    </div>
                                    <div className="tabbody_data smartcard_main">
                                      <div className="smartcard_box">
                                        <img src={smartCardScan} alt="" />
                                        <p className="smartcard_error">
                                          Device does not Connected Please
                                          Connect device
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {showCardUnplugged && (
                                <div id="dvcardUnplugged">
                                  <div className="tabbody d-flex justify-content-between">
                                    <div className="tabbody_header">
                                      <div className="tabbody_title mb-2">
                                        Smart Card Authentication
                                      </div>
                                      <div className="tabbody_sub_title">
                                        Keep/Wave Smart card on the device for
                                        verification
                                      </div>
                                    </div>
                                    <div className="tabbody_data smartcard_main">
                                      <div className="smartcard_box">
                                        <img src={smartCardScan} alt="" />

                                        <p className="smartcard_error">
                                          The card has been taken out. Please
                                          place the card on the device.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {showFingerNotMatch && (
                                <div id="fingernotmatch">
                                  <div className="tabbody d-flex justify-content-between">
                                    <div className="tabbody_header">
                                      <div className="tabbody_title mb-2">
                                        Biometric Authentication
                                      </div>
                                      <div className="tabbody_sub_title">
                                        Please submit your finger print on the
                                        scanner for verification
                                      </div>
                                    </div>
                                    <div
                                      className="tabbody_data smartcard_main"
                                      id="dvFailFinger"
                                    >
                                      <div className="smartcard_box">
                                        <img src={bioMatricDevice} alt="" />
                                        <p className="smartcard_error">
                                          Finger authentication is invalid;
                                          please try again.
                                        </p>
                                        <p
                                          id="bioFailcounter1"
                                          className="smartcard_error"
                                        ></p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {showDeviceConnected && (
                                <div id="dvDevice">
                                  <div className="tabbody d-flex justify-content-between">
                                    <div className="tabbody_header">
                                      <div className="tabbody_title mb-2">
                                        Biometric Authentication
                                      </div>
                                      <div className="tabbody_sub_title">
                                        Please submit your finger print on the
                                        scanner for verification
                                      </div>
                                    </div>
                                    <div className="tabbody_data smartcard_main">
                                      <div className="smartcard_box">
                                        <img src={bioMatricDevice} alt="" />
                                        <p className="smartcard_success">
                                          Device Connected
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div
                              className="tab-pane"
                              id="nav-card-tab"
                              role="tabpanel"
                              aria-labelledby="nav-card-tab"
                            ></div>

                            <div
                              className="tab-pane"
                              id="nav-biometric-tab"
                              role="tabpanel"
                              aria-labelledby="nav-biometric-tab"
                            >
                              <div className="tabbody tab-3" id="tab_3">
                                <div className="tabbody_header">
                                  <div className="tabbody_title mb-2">
                                    Biometric Authentication
                                  </div>
                                  <div className="tabbody_sub_title">
                                    Please submit your finger print on the
                                    scanner for verification
                                  </div>
                                </div>
                                <div className="tabbody_data smartcard_main">
                                  <div className="smartcard_box">
                                    <img
                                      src="~/images/biometric_device.svg"
                                      alt=""
                                    />
                                    <p className="smartcard_success">
                                      Device Connected
                                    </p>
                                  </div>
                                </div>
                                <div className="tabbody_footer">
                                  <button
                                    className="btn primary_btn login-btn green_btn"
                                    id="deviceconnect_btn"
                                    type="button"
                                  >
                                    Device Connected
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <a href="https://www.mantratec.com/" target="_blank">
                <p className="poweredby">
                  Powered by Mantra Softech India PVT.LTD
                </p>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signin;
