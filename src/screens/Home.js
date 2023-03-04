import React from "react";
import { Component } from "react";
import "../CSS/Home.css";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Cookies from "js-cookie";

//import $ from "jquery";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: [],
      user: "",
      username: "",
      email: "",
      passw: "",
      isExpand: false,
      showMenu: false,
      token: Cookies.get("jwtToken") || "",
    };
  }

  expand = () => {
    this.setState({ isExpand: !this.state.isExpand });
  };

  //componentDidMount() {
  // $("#list-therapist-table tr").hide();
  // $("#list-therapist-table tr").each(function (index) {
  //   $(this)
  //     .delay(index * 300)
  //     .show(1000);
  // });
  //}

  componentDidMount() {
    document.addEventListener("click", (event) =>
      this.handleClickOutside(event)
    );
    var jwt = Cookies.get("jwtToken");
    console.log(jwt);
  }

  componentWillMount() {
    var userType = Cookies.get("usertype");
    if (userType) {
      if (userType == "customer") {
        // window.location.replace("http://localhost:3000/dashboard");
      }
      if (userType == "therapist") {
        window.location.replace("http://localhost:3000/therapistdashboard");
      }
      if (userType == "admin") {
        window.location.replace("http://localhost:3000/admindashboard");
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", (event) =>
      this.handleClickOutside(event)
    );
  }

  handleClickOutside = (event) => {
    if (!event.target.matches("#dropbtn")) {
      this.setState({ showMenu: false });
    }

    // if (
    //   this.dropdownRef.current &&
    //   !this.dropdownRef.current.contains(event.target)
    // ) {
    //   this.setState({ isOpen: false });
    // }
  };

  handleMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  openModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  };

  loginModal = () => {
    var modal = document.getElementById("loginModal");
    modal.style.display = "block";
    document.getElementById("myModal").style.display = "none";
  };

  closeModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  closeLoginModal = () => {
    var modal = document.getElementById("loginModal");
    modal.style.display = "none";
  };

  login = async () => {
    const radioButtons = document.getElementsByName("login");

    const url = "http://localhost:1337";

    for (let i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        const selectedValue = radioButtons[i].value;
        if (selectedValue === "customer") {
          const requestConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: this.state.email.trim(),
              password: this.state.passw.trim(),
              user_type: "customer",
            }),
          };

          try {
            const res = await fetch(
              `${url}/api/auth/local`,
              requestConfig
            ).catch((e) => alert(e));
            const json = await res.json();
            if (json.error) {
              alert(json.error.message);
            } else {
              console.log("Result" + json);
              this.setState({ token: json.jwt });
              Cookies.set("jwtToken", json.jwt, {
                path: "/",
              });
              Cookies.set("email", this.state.email, {
                path: "/",
              });
              Cookies.set("usertype", "customer", {
                path: "/",
              });
              this.closeLoginModal();
            }
          } catch (err) {
            console.log("Authentication failed  " + err);
          }
        }
        if (selectedValue === "therapist") {
          const requestConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: this.state.email.trim(),
              password: this.state.passw.trim(),
              user_type: "customer",
            }),
          };

          try {
            const res = await fetch(
              `${url}/api/auth/local`,
              requestConfig
            ).catch((e) => alert(e));
            console.log(res);
            const json = await res.json();
            if (json.error) {
              alert(json.error.message);
            } else {
              console.log("Result" + json);
              this.setState({ token: json.jwt });
              Cookies.set("jwtToken", json.jwt);
              Cookies.set("email", this.state.email);
              Cookies.set("usertype", "therapist");

              this.closeLoginModal();
              window.location.replace(
                `http://localhost:3000/therapistdashboard`
              );
            }
          } catch (err) {
            console.log("Authentication failed  " + err);
          }
        }
        if (selectedValue === "admin") {
          const requestConfig = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: this.state.email.trim(),
              password: this.state.passw.trim(),
              user_type: "customer",
            }),
          };

          try {
            const res = await fetch(
              `${url}/api/auth/local`,
              requestConfig
            ).catch((e) => alert(e));
            console.log(res);
            const json = await res.json();
            if (json.error) {
              alert(json.error.message);
            } else {
              console.log("Result" + json);
              this.setState({ token: json.jwt });
              Cookies.set("jwtToken", json.jwt, {
                path: "/",
              });
              Cookies.set("email", this.state.email, {
                path: "/",
              });
              Cookies.set("usertype", "admin", { path: "/" });

              this.closeLoginModal();
              window.location.replace(`http://localhost:3000/admindashboard`);
            }
          } catch (err) {
            console.log("Authentication failed  " + err);
          }
        }
      }
    }

    // alert("login");
    // axios.post("http://localhost:1337/api/users", {
    //   headers: {
    //     "content-type": "text/json",
    //   },
    //   body: {
    //     email: this.state.email,
    //     passw: this.state.passw,
    //   },
    // });
  };

  profile = () => {
    window.location.href = `http://localhost:3000/dashboard`;
  };

  signUp = async () => {
    const url = "http://localhost:1337";

    const requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username.trim(),
        email: this.state.email.trim(),
        password: this.state.passw.trim(),
        user_type: "customer",
      }),
    };

    try {
      const res = await fetch(
        `${url}/api/auth/local/register`,
        requestConfig
      ).catch((e) => alert(e));
      console.log(res);
      const json = await res.json();
      if (json.error) {
        alert(json.error.message);
      } else {
        console.log("Result" + json);
        this.setState({ token: json.jwt });
        Cookies.set("jwtToken", json.jwt);
        Cookies.set("email", this.state.email);
        Cookies.set("usertype", "customer");

        await fetch(`http://localhost:1337/api/customers/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              name: this.state.username,
              email: this.state.email,
            },
          }),
        })
          .then((r) => {
            console.log(r);
            console.log("New customer added");
            this.closeModal();
          })
          .catch((e) => alert(e.error.message));

        this.closeModal();
      }
    } catch (err) {
      console.log("Authentication failed  " + err);
    }
  };

  logout = () => {
    this.setState({ token: "" });
    Cookies.remove("jwtToken");
    Cookies.remove("email");
    Cookies.remove("usertype");
  };

  therapists = [
    {
      id: 20,
      name: "Mark P. Daye",
      services: "Individual therapy",
      mode: "Online",
      gender: "Male",
      details: [
        {
          id: "1",
          photo:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlRbn8W997IVVHToRRiUgaVwIy4oq_GbnmiQ&usqp=CAU",
          desc: "He/She is a good therapist go above and beyond to meet the needs of their clients",
          ts1: "8.00 - 12.00",
          ts2: "1.00 - 3.00",
        },
      ],
    },
    {
      id: 30,
      name: "Lenora C. Hickson",
      services: "Couple therapy",
      mode: "Offline",
      gender: "female",
      details: [
        {
          id: "1",
          photo:
            "https://www.shutterstock.com/image-photo/portrait-beautiful-female-psychologist-wearing-260nw-704294779.jpg",
          desc: "He/She is a good therapist go above and beyond to meet the needs of their clients",
        },
      ],
    },
  ];

  goToBooking = (event) => {
    if (this.state.token) {
      console.log(event.target.parentNode.parentNode.closest("tr").rowIndex);
      // window.location.href = `http://localhost:3000/booking`;
    } else {
      this.openModal();
    }
    //window.history.pushState({}, null, "/booking");
    //const navigate = useNavigate();
    //navigate("/booking",{replace: true})
  };

  signup = () => {
    window.location.href = `http://localhost:3000//booking`;
  };

  handleExpand = (therapist) => {
    let newExpandedRows = [...this.state.expandedRows];
    //let allExpanded = this.state.allExpanded;
    let idxFound = newExpandedRows.findIndex((id) => {
      return id === therapist.id;
    });

    if (idxFound > -1) {
      console.log("Collapsing " + therapist.firstName + " " + idxFound);
      newExpandedRows.splice(idxFound, 1);
    } else {
      console.log("Expanding " + therapist.firstName);
      newExpandedRows.push(therapist.id);
    }

    // console.log("Expanded rows");
    // console.log(newExpandedRows);

    this.setState({ expandedRows: [...newExpandedRows] });
  };

  isExpanded = (therapist) => {
    const idx = this.state.expandedRows.find((id) => {
      return id === therapist.id;
    });

    return idx > -1;
  };

  expandAll = (therapists) => {
    console.log("ExapndedRows: " + this.state.expandedRows.length);
    console.log("therapists:      " + therapists.length);
    if (this.state.expandedRows.length === therapists.length) {
      let newExpandedRows = [];
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Collapsing all...");
    } else {
      let newExpandedRows = therapists.map((therapist) => therapist.id);
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Expanding all...");
      console.log("Expanded rows " + newExpandedRows.length);
    }
  };

  getRows = (therapist) => {
    let rows = [];
    const details = therapist.details || [];

    const firstRow = (
      <tr>
        <td>{therapist.name}</td>
        <td>{therapist.services}</td>
        <td>{therapist.mode}</td>
        <td>{therapist.gender}</td>
        <td>
          {details.length > 0 && (
            <button
              id="addorminus"
              onClick={() => this.handleExpand(therapist)}
            >
              {this.isExpanded(therapist) ? "-" : "+"}
            </button>
          )}
        </td>
      </tr>
    );

    rows.push(firstRow);

    if (this.isExpanded(therapist) && details.length > 0) {
      const detailRows = details.map((detail) => (
        <tr>
          <td>
            <img id="therapist-photo" alt="therapist" src={detail.photo} />
          </td>
          <td>
            <p id="desc">{detail.desc}</p>
          </td>
          <td>
            <li id="tslist">
              <p>Work Schedule</p>
              <p>{detail.ts1}</p>
              <p>{detail.ts2}</p>
            </li>
          </td>
          <td>
            <button
              id="book-button"
              onClick={(event) => this.goToBooking(event)}
            >
              Book Appointment now
            </button>
          </td>
        </tr>
      ));

      rows.push(detailRows);
    }

    return rows;
  };

  gettherapistTable = (therapists) => {
    const therapistRows = therapists.map((therapist) => {
      return this.getRows(therapist);
    });

    return (
      <table id="list-therapist-table">
        <tr>
          <th>Name</th>
          <th>Services</th>
          <th>Mode</th>
          <th>Gender</th>
          <th onClick={() => this.expandAll(therapists)}>
            <button id="addorminus">
              {therapists.length === this.state.expandedRows.length ? "-" : "+"}
            </button>
          </th>
        </tr>
        {therapistRows}
      </table>
    );
  };

  render() {
    var userType = Cookies.get("usertype");
    if (userType === "customer") {
      return (
        <div id="container">
          <header id="top-bar">
            <div id="top-left">
              <p id="cyril">Cyril John Mathew | </p>
              <p id="hpy">Happiness sustains!</p>
            </div>
            <div id="top-right">
              <div>
                <FaPhoneAlt color="#000" size={17} />
                <p>8714772868</p>
              </div>
              <div>
                <MdEmail color="#000" size={17} />
                <p>cyriljon@yahoo.com</p>
              </div>
            </div>
            <div>
              <FaUserCircle
                id="dropbtn"
                onClick={() => this.handleMenu()}
                color="#000"
                size={25}
                style={{ cursor: "pointer" }}
              />
              {this.state.showMenu && this.state.token && (
                <ul ref={this.state.dropdownRef}>
                  <li onClick={() => this.profile()}>{Cookies.get("email")}</li>
                  <li onClick={() => this.logout()}>LogOut</li>
                </ul>
              )}
              {this.state.showMenu && !this.state.token && (
                <ul ref={this.state.dropdownRef}>
                  <li onClick={() => this.openModal()}>Signup</li>
                </ul>
              )}
            </div>
          </header>

          <div id="page-title-div" style={{ height: "70px" }}>
            <div id="left-page-title">
              <p id="appointment-booking">Appointment Booking</p>
            </div>
            <div id="right-page-title">
              <p id="cjmab">Cyril John Mathew &gt; Appointment Booking</p>
            </div>
          </div>
          <div id="empty-space"></div>
          <div id="book-appointment" style={{ height: "70px" }}>
            <p id="book-app-text">Book an Appointment</p>
          </div>
          <div id="empty-space"></div>
          <div id="therapist-list">
            <p id="therapist-list-text">Therapists list</p>
          </div>
          <div id="empty-space"></div>
          <div id="filter-div">
            <div id="left-filter">
              <div id="filter-text">
                <p>Filter list by: </p>
              </div>
              <div id="left-filter-content">
                <p>ONLINE</p>
                <p>OFFLINE</p>
                <p>MALE</p>
                <p>FEMALE</p>
              </div>
            </div>
            <div id="right-filter">
              <input
                id="search"
                placeholder="Search Available Therapist"
                type="text"
              />
              <div className="att-btn" id="search-btn">
                Search
              </div>
            </div>
          </div>

          <div id="table-div">{this.gettherapistTable(this.therapists)}</div>

          <div id="myModal" class="modal">
            <div class="home-modal-content">
              <p onClick={() => this.closeModal()} class="close">
                <span>&times;</span>
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  color: "#7F9BC9",
                  fontWeight: "600",
                }}
              >
                Signup
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {/* <p>Are you an</p> */}
                {/* <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <input
                    id="customer-signup"
                    type="radio"
                    name="login"
                    value="customer"
                  />
                  <label for="customer-radio">Customer</label>
                </div>
                {/* <div style={{ marginLeft: "20px" }}>
                  <input
                    id="therapist-signup"
                    type="radio"
                    name="login"
                    value="therapist"
                  />
                  <label for="therapist-radio">therapist</label>
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <input
                    id="admin-signup"
                    type="radio"
                    name="login"
                    value="Admin"
                  />
                  <label for="admin-radio">Admin</label>
                </div> 
              </div> */}
                <p>Username</p>
                <input
                  id="email-customer"
                  type="text"
                  className="padding-input"
                  placeholder="Enter username"
                  onChange={(text) =>
                    this.setState({ username: text.target.value })
                  }
                />
                <p>Email</p>
                <input
                  id="email-customer"
                  type="text"
                  className="padding-input"
                  placeholder="Enter email"
                  onChange={(text) =>
                    this.setState({ email: text.target.value })
                  }
                />
                <p>Password</p>
                <input
                  id="therapist-cust"
                  type="password"
                  className="padding-input"
                  placeholder="Enter password"
                  onChange={(text) =>
                    this.setState({ passw: text.target.value })
                  }
                />
                <p
                  style={{ cursor: "pointer", opacity: "0.7" }}
                  onClick={() => this.loginModal()}
                >
                  Already have an account?
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <button onClick={() => this.signUp()} id="signup-btn">
                    Signup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="loginModal" class="modal">
            <div class="home-modal-content">
              <p onClick={() => this.closeLoginModal()} class="close">
                <span>&times;</span>
              </p>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  color: "#7F9BC9",
                  fontWeight: "600",
                }}
              >
                Login
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <p>Are you an</p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div>
                    <input
                      id="customer-login"
                      type="radio"
                      name="login"
                      value="customer"
                    />
                    <label for="customer-radio">Customer</label>
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <input
                      id="therapist-login"
                      type="radio"
                      name="login"
                      value="therapist"
                    />
                    <label for="therapist-radio">therapist</label>
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <input
                      id="admin-login"
                      type="radio"
                      name="login"
                      value="admin"
                    />
                    <label for="admin-radio">Admin</label>
                  </div>
                </div>
                <p>Email</p>
                <input
                  id="email-customer"
                  type="text"
                  className="padding-input"
                  placeholder="Enter email"
                  onChange={(text) =>
                    this.setState({ email: text.target.value })
                  }
                />
                <p>Password</p>
                <input
                  id="therapist-cust"
                  type="password"
                  className="padding-input"
                  placeholder="Enter password"
                  onChange={(text) =>
                    this.setState({ passw: text.target.value })
                  }
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <button onClick={() => this.login()} id="login-btn">
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <div id='foot'>
        <div id='overcome'>
          <p id='overcome-text'>OVERCOME</p>
          <p id='overcome-desc'>Overcome is an earnest attempt to help people conquer their problems and replenish in life.</p>
        </div>
        <div id='categories'>
          <p id='overcome-text'>CATEGORIES</p>
          <li id='cat-list'>
            <p>General</p>
            <p>Latest</p>
            <p>Learning disability</p>
            <p>Psychoanlysis</p>
            <p>Psychology</p>
            <p>Sexuality</p>
            <p>Spirituality</p>
          </li>
        </div>
        <div id='recent'>
          <p id='overcome-text'>RECENT POSTS</p>
          <li id='cat-list'>
            <p>Integrated person</p>
            <p>The Awakening</p>
            <p>Beyond the Body - 2</p>
            <p>Beyond the Body - 1</p>
            <p>Tantric sex</p>
          </li>
        </div>
        <div id='contact'>
          <p id='overcome-text'>CONTACT US</p>
          <p id='overcome-desc'>AU NATURALE AESTHETICS, Pattom Kowdiar Road Level 2 KGM Grandeur Opposite Supreme Bakers, above SBI, Kuravankonam, Thiruvananthapuram, Kerala 695003</p>
          <p>8714772862</p>
          <p>cyriljon@yahoo.com</p>
        </div>
      </div> */}
        </div>
      );
    } else {
      return <h1>You have not access to this page</h1>;
    }
  }
}
