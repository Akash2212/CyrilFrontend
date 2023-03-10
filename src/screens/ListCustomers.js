import React from "react";
import "../CSS/ListCustomers.css";
import { FaEdit } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";

export default class ListCustomers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: Cookies.get("jwtToken") || "",
      customerdata: [],
      id: null,
      selectedRows: [],
      filteredData: [],
    };
  }

  async componentDidMount() {
    const content = document.getElementById("container");
    const viewportHeight = window.innerHeight;

    if (content.offsetHeight > viewportHeight) {
      content.style.height = "100%";
    } else {
      content.style.height = "100vh";
    }

    await axios
      .get("http://localhost:1337/api/customers", {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        var resArray = [];
        for (var i = 0; i < res.data.data.length; i++) {
          resArray.push(res.data.data[i]);
        }
        this.setState({ customerdata: resArray });
      })
      .catch((err) => console.log(err));
  }

  opennewModal = () => {
    var modal = document.getElementById("addnewModal");
    modal.style.display = "block";
  };

  closeaddnewModal = () => {
    var modal = document.getElementById("addnewModal");
    modal.style.display = "none";
  };

  openModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  };

  closeModal = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  createCustomer = async () => {
    var fullname = document.getElementById("new-name");
    var email = document.getElementById("email-new");
    var gender = document.getElementById("gender-new");
    var phone = document.getElementById("phone-new");
    var age = document.getElementById("age-new");

    fetch(`http://localhost:1337/api/customers/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: fullname.value,
          email: email.value,
          phone: phone.value,
          age: age.value,
          gender: gender.value,
        },
      }),
    })
      .then((r) => {
        alert("New customer created");
        this.closeaddnewModal();
      })
      .catch((e) => alert(e.error.message));
  };

  updateCustomer = async () => {
    var fullname = document.getElementById("full-name");
    var email = document.getElementById("email-customer");
    var gender = document.getElementById("gender-customer");
    var phone = document.getElementById("phone");
    var age = document.getElementById("age");

    await fetch(`http://localhost:1337/api/customers/${this.state.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.state.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: fullname.value,
          email: email.value,
          phone: phone.value,
          age: age.value,
          gender: gender.value,
        },
      }),
    })
      .then((res) => {
        alert("Customer details updated");
        this.closeModal();
      })
      .catch((e) => {
        alert(e.error.message);
      });
  };

  checkboxReactComponent = () => {
    return (
      <div>
        <td>
          <input type="checkbox" name="check" className="servicecheckbox" />
        </td>
        <td>
          <FaEdit
            style={{ cursor: "pointer" }}
            onClick={(event) => this.editRow(event)}
          />
        </td>
      </div>
    );
  };

  getHeaderCB = () => {
    var hcb = document.getElementById("headercheckbox");
    var checkbox = document.getElementsByClassName("servicecheckbox");

    if (hcb.checked) {
      for (let i = 0; i < checkbox.length; i++) checkbox[i].checked = true;
    }
    if (!hcb.checked) {
      for (let i = 0; i < checkbox.length; i++) checkbox[i].checked = false;
    }
  };

  deletecustomer = async (event) => {
    var checkbox = document.getElementsByClassName("servicecheckbox");
    var table = document.getElementById("customer-table");

    for (let i = 1; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        table.rows[i].className = "fadeOut";

        setTimeout(() => {
          table.rows[i].remove();
        }, 2000);
      }
    }

    for (let i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        for (let j = 0; j < table.rows[i].cells.length - 1; j++) {
          //alert(table.rows[i].cells[j].innerHTML);
        }
      }
    }

    var ids = this.state.selectedRows;

    for (let j = 0; j < ids.length; j++) {
      await fetch(`http://localhost:1337/api/customers/${ids[j]}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("Customer deleted");
        })
        .catch((e) => {
          alert(e.error.message);
        });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      var searchTerm = document.getElementById("search-customer").value;
      const filteredData = this.state.customerdata.filter((row) => {
        return row.attributes.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      this.setState({ filteredData: filteredData });
    }
  };

  handleRowSelect = (id) => {
    const { selectedRows } = this.state;
    const index = selectedRows.indexOf(id);
    if (index !== -1) {
      selectedRows.splice(index, 1);
    } else {
      selectedRows.push(id);
    }
    this.setState({ selectedRows });
  };

  editRow = (event) => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var fullname = document.getElementById("full-name");
    var email = document.getElementById("email-customer");
    var gender = document.getElementById("gender-customer");
    var phone = document.getElementById("phone");
    var age = document.getElementById("age");

    var table = document.getElementById("customer-table");
    var id = event.target.parentNode.parentNode.rowIndex;

    fullname.value = table.rows[id].cells[0].innerHTML;
    email.value = table.rows[id].cells[2].innerHTML;
    gender.value = table.rows[id].cells[4].innerHTML;
    phone.value = table.rows[id].cells[1].innerHTML;
    age.value = table.rows[id].cells[3].innerHTML;
  };

  render() {
    return (
      <div id="container">
        <div id="top-bar">
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
        </div>
        <div id="page-title-div" style={{ height: "70px" }}>
          <div id="left-page-title">
            <p id="appointment-booking">Event Management</p>
          </div>
          <div id="right-page-title">
            <p id="cjmab">Cyril John Mathew &gt; Event Management</p>
          </div>
        </div>
        <div id="empty-space"></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontWeight: "700",
              fontSize: "30px",
              animation: "book-app 1s ease-in-out forwards",
            }}
          >
            Customers
          </p>

          <div id="filter-add-div">
            <input
              id="search-customer"
              type="text"
              placeholder="Quick Search Customer"
              onKeyDown={(event) => this.handleKeyDown(event)}
            />
            <button
              className="att-btn"
              id="add-customer"
              onClick={() => this.opennewModal()}
            >
              Add new customer
            </button>
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            paddingTop: "50px",
            width: "95%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          <table id="customer-table">
            <tr style={{ fontSize: "20px" }}>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Last Appointment</th>
              <th>Total Appointment</th>
              <th>Payment</th>
              <th>
                <input
                  id="headercheckbox"
                  type="checkbox"
                  name="check"
                  className="servicecheckbox"
                  onClick={() => this.getHeaderCB()}
                />
              </th>
              <th></th>
            </tr>

            {this.state.filteredData.length > 0
              ? this.state.filteredData.map((val, key) => {
                  return (
                    <tr key={val.id} style={{ textAlign: "center" }}>
                      <td>{val.attributes.name}</td>
                      <td>{val.attributes.phone}</td>
                      <td>{val.attributes.email}</td>
                      <td>{val.attributes.age}</td>
                      <td>{val.attributes.gender}</td>
                      <td>{val.attributes.lastappointment}</td>
                      <td>{val.attributes.totalappointment}</td>
                      <td>{val.attributes.payment}</td>
                      <td>
                        <input
                          type="checkbox"
                          name="check"
                          className="servicecheckbox"
                          checked={this.state.selectedRows.includes(val.id)}
                          onClick={() => this.handleRowSelect(val.id)}
                        />
                      </td>
                      <td>
                        <FaEdit
                          style={{ cursor: "pointer" }}
                          onClick={(event) => {
                            this.editRow(event);
                            this.setState({ id: val.id });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              : this.state.customerdata.map((val, key) => {
                  return (
                    <tr key={val.id} style={{ textAlign: "center" }}>
                      <td>{val.attributes.name}</td>
                      <td>{val.attributes.phone}</td>
                      <td>{val.attributes.email}</td>
                      <td>{val.attributes.age}</td>
                      <td>{val.attributes.gender}</td>
                      <td>{val.attributes.lastappointment}</td>
                      <td>{val.attributes.totalappointment}</td>
                      <td>{val.attributes.payment}</td>
                      <td>
                        <input
                          type="checkbox"
                          name="check"
                          className="servicecheckbox"
                          checked={this.state.selectedRows.includes(val.id)}
                          onClick={() => this.handleRowSelect(val.id)}
                        />
                      </td>
                      <td>
                        <FaEdit
                          style={{ cursor: "pointer" }}
                          onClick={(event) => {
                            this.editRow(event);
                            this.setState({ id: val.id });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}

            {/* <tr>
              <td>cyriljm</td>
              <td>9431309362</td>
              <td>cyriljon@yahoo.com</td>
              <td>Mark P. Daye</td>
              <td>Male</td>
              <td>24.01.23</td>
              <td>2</td>
              <td>$23.00</td>
            </tr>
            <tr>
              <td>cyriljm</td>
              <td>9431309362</td>
              <td>cyriljon@yahoo.com</td>
              <td>Mark P. Daye</td>
              <td>Male</td>
              <td>24.01.23</td>
              <td>2</td>
              <td>$23.00</td>
            </tr>
            <tr>
              <td>cyriljm</td>
              <td>9431309362</td>
              <td>cyriljon@yahoo.com</td>
              <td>Mark P. Daye</td>
              <td>Male</td>
              <td>24.01.23</td>
              <td>2</td>
              <td>$23.00</td>
            </tr> */}
          </table>
        </div>
        <div
          style={{
            width: "80vw",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <div>
            <button
              className="att-btn"
              onClick={(event) => this.deletecustomer(event)}
              style={{ width: "100px", padding: "5px" }}
            >
              Delete
            </button>
          </div>
        </div>
        <div id="addnewModal" class="modal">
          <div class="modal-content">
            <p onClick={() => this.closeaddnewModal()} class="close">
              <span>&times;</span>
            </p>
            <div id="customer-modal-div">
              <div>
                <p>Full name</p>
                <input
                  id="new-name"
                  type="text"
                  placeholder="Enter full name"
                />
                <p>Email</p>
                <input
                  id="email-new"
                  type="text"
                  className="padding-input"
                  placeholder="Enter email"
                />
                <p>Gender</p>
                <input
                  id="gender-new"
                  type="text"
                  className="padding-input"
                  placeholder="Enter gender"
                />
              </div>
              <div>
                <p>Phone</p>
                <input
                  id="phone-new"
                  className="padding-input"
                  type="number"
                  placeholder="Enter phone number"
                />
                <p>Age</p>
                <input
                  id="age-new"
                  className="padding-input"
                  type="number"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <button
              className="att-btn"
              onClick={() => this.createCustomer()}
              id="create-staff"
            >
              Create
            </button>
          </div>
        </div>
        <div id="myModal" class="modal">
          <div class="modal-content">
            <p onClick={() => this.closeModal()} class="close">
              <span>&times;</span>
            </p>
            <div id="customer-modal-div">
              <div>
                <p>Full name</p>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Enter full name"
                />
                <p>Email</p>
                <input
                  id="email-customer"
                  type="text"
                  className="padding-input"
                  placeholder="Enter email"
                />
                <p>Gender</p>
                <input
                  id="gender-customer"
                  type="text"
                  className="padding-input"
                  placeholder="Enter gender"
                />
              </div>
              <div>
                <p>Phone</p>
                <input
                  id="phone"
                  className="padding-input"
                  type="number"
                  placeholder="Enter phone number"
                />
                <p>Age</p>
                <input
                  id="age"
                  className="padding-input"
                  type="number"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <button
              className="att-btn"
              onClick={() => this.updateCustomer()}
              id="create-staff"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
