"use client";
import React, { useState } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { client } from "../utils/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    cemail: "",
    password: "",
    cpassword: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    countryCode: "",
    contact: "",
  });
  const [check, setCheck] = useState({
    fname: false,
    lname: false,
    email: false,
    cemail: false,
    password: false,
    cpassword: false,
    city: false,
    state: false,
    country: false,
    pincode: false,
    contact: false,
  });
  const [code, setCode] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  });
  const [showOtp, setShowOtp] = useState(true);

  const handleOnChangeCode = (event) => {
    setCode({
      ...code,
      [event.target.name]: event.target.value,
    });
  };

  const sendOTP = async () => {
    await client
      .post("/api/sms/send-otp", {
        countryCode: formData.countryCode,
        contact: formData.contact,
      })
      .then(
        (response) => {
          toast("OTP send successfully!", {
            hideProgressBar: true,
            autoClose: 5000,
            type: "success",
          });
          console.log(response);
          setShowOtp(true);
        },
        (error) => {
          console.log(error);
          toast("Error sending OTP. Please try again.", {
            hideProgressBar: true,
            autoClose: 3000,
            type: "error",
          });
        }
      );
  };

  const verifyOTP = async () => {
    if (
      code.first === "" ||
      code.second === "" ||
      code.third === "" ||
      code.fourth === "" ||
      code.fifth === "" ||
      code.sixth === ""
    ) {
      toast("Please enter correct OTP!", {
        hideProgressBar: true,
        autoClose: 3000,
        type: "error",
      });
    } else {
      await client
        .post("/api/sms/verify-otp", {
          countryCode: formData.countryCode,
          contact: formData.contact,
          otp:
            code.first +
            code.second +
            code.third +
            code.fourth +
            code.fifth +
            code.sixth,
        })
        .then(
          (response) => {
            toast("OTP verified successfully!", {
              hideProgressBar: true,
              autoClose: 5000,
              type: "success",
            });
            console.log(response);
            client
              .post("/api/user", {
                ...formData,
              })
              .then(
                (response) => {
                  handleReset();
                  toast(response.data.message, {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: "success",
                  });
                },
                (error) => {
                  toast(error.response.data.message, {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: "error",
                  });
                }
              );
            setShowOtp(false);
          },
          (error) => {
            console.log(error);
            toast("Please enter correct OTP!", {
              hideProgressBar: true,
              autoClose: 3000,
              type: "error",
            });
          }
        );
    }
  };

  const handleOTP = () => {
    if (formData.countryCode && formData.contact && check.contact) {
      sendOTP();
    } else {
      toast("Please, fill contact details first!", {
        hideProgressBar: true,
        autoClose: 2000,
        type: "warning",
      });
    }
  };
  const validateData = () => {
    const nameRegex = /^[a-zA-Z ,.'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const contactRegex = /^\d{10}$/;
    const newCheck = {};

    // Validation for other fields
    for (const field in formData) {
      switch (field) {
        case "fname":
        case "lname":
          newCheck[field] = nameRegex.test(formData[field]);
          break;
        case "email":
        case "cemail":
          newCheck[field] = emailRegex.test(formData[field]);
          break;
        case "password":
        case "cpassword":
          newCheck[field] = passwordRegex.test(formData[field]);
          break;
        case "contact":
          newCheck[field] = contactRegex.test(formData[field]);
          break;
        default:
          newCheck[field] = !!formData[field];
          break;
      }
    }

    setCheck(newCheck);
  };
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    validateData(); // Calling the validation function on each input change
  };

  const handleReset = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      cemail: "",
      password: "",
      cpassword: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      countryCode: "",
      contact: "",
    });
    setCheck({
      fname: false,
      lname: false,
      email: false,
      cemail: false,
      password: false,
      cpassword: false,
      city: false,
      state: false,
      country: false,
      pincode: false,
      contact: false,
    });
  };
  const registerUser = async (e) => {
    e.preventDefault();

    if (
      formData.fname !== "" &&
      check.fname &&
      formData.lname !== "" &&
      check.lname &&
      formData.email !== "" &&
      check.email &&
      formData.cemail !== "" &&
      check.cemail &&
      formData.password !== "" &&
      check.password &&
      formData.cpassword !== "" &&
      check.cpassword &&
      formData.city !== "" &&
      check.city &&
      formData.state !== "" &&
      check.state &&
      formData.country !== "" &&
      check.country &&
      formData.pincode !== "" &&
      check.pincode &&
      formData.contact !== "" &&
      check.contact
    ) {
      // Email Validation
      if (formData.email !== formData.cemail) {
        toast("Emails are not matching!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
        });
      }
      // Password Validation
      else if (formData.password !== formData.cpassword) {
        toast("Both Passwords should Match!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
        });
      } else {
        verifyOTP();
      }
    }
    // regex wrong, fields empty
    else {
      // Email Validation
      if (!check.email || !check.cemail) {
        toast("Emails should be correct!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
        });
      }
      // Password Validation
      else if (!check.password || !check.cpassword) {
        toast("Passwords should be strong!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
        });
      } else if (!check.contact) {
        toast("Contact should be valid!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
        });
      } else {
        toast("Fields should not be empty!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="border-2 border-white rounded-lg m-10 p-10 flex flex-col">
        <div className=" flex flex-row items-center justify-center">
          {/* Labels  */}
          <div className="flex flex-col">
            <label htmlFor="fname" className="mb-3">
              First Name:{" "}
            </label>
            <label htmlFor="lname" className="mb-4">
              Last Name:{" "}
            </label>
            <label htmlFor="email" className="mb-4">
              Email:{" "}
            </label>
            <label htmlFor="cemail" className="mb-4">
              Confirm Email:{" "}
            </label>
            <label htmlFor="password" className="mb-4">
              Password:{" "}
            </label>
            <label htmlFor="cpassword" className="mb-4">
              Confirm Password:{" "}
            </label>
            <label htmlFor="city" className="mb-4">
              City:{" "}
            </label>
            <label htmlFor="state" className="mb-4">
              State:{" "}
            </label>
            <label htmlFor="country" className="mb-4">
              Country:{" "}
            </label>
            <label htmlFor="pincode" className="mb-4">
              Pincode:{" "}
            </label>
            <label htmlFor="contact" className="mb-3">
              Contact:{" "}
            </label>
          </div>
          {/* Inputs  */}
          <div className="flex flex-col">
            <div className="flex flex-row justify-center gap-5">
              <input
                id="fname"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleInputChange}
                placeholder="John"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.fname ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="lname"
                name="lname"
                type="text"
                value={formData.lname}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.lname ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="johndoe@gmail.com"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.email ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="cemail"
                name="cemail"
                type="email"
                value={formData.cemail}
                onChange={handleInputChange}
                placeholder="johndoe@gmail.com"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.cemail ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="************"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.password ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                value={formData.cpassword}
                onChange={handleInputChange}
                placeholder="************"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.cpassword ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Kanpur"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.city ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Uttar Pradesh"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.state ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>

            <div className="flex flex-row justify-center gap-5">
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="India"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.country ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
            <div className="flex flex-row justify-center gap-5">
              <input
                id="pincode"
                name="pincode"
                inputMode="numeric"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="685001"
                required
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.pincode ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <input
                name="countryCode"
                inputMode="numeric"
                placeholder="91"
                className="w-10 h-10 outline-none bg-transparent border-2 border-white  p-2"
                value={formData.countryCode}
                onChange={handleInputChange}
                required
              />
              <input
                id="contact"
                placeholder="Enter 10 digit mobile number"
                name="contact"
                inputMode="numeric"
                value={formData.contact}
                onChange={handleInputChange}
                required
                maxLength={10}
                className="bg-transparent border-2 border-white outline-none px-2 ml-5 mb-3"
              />
              {check.contact ? (
                <AiFillCheckCircle color="green" size={30} />
              ) : (
                <AiFillCloseCircle color="red" size={30} />
              )}
            </div>
          </div>
        </div>
        {/* send OTP Button  */}
        <button
          onClick={handleOTP}
          type="button"
          className="self-center p-2 w-32 mt-5 border-2 border-white text-white hover:bg-white hover:text-black text-sm"
        >
          Send OTP
        </button>
        {showOtp ? (
          <div className="ml-auto mr-96 mt-5 flex flex-row gap-2">
            <input
              type="text"
              name="first"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.first}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
            <input
              type="text"
              name="second"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.second}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
            <input
              type="text"
              name="third"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.third}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
            <input
              type="text"
              name="fourth"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.fourth}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
            <input
              type="text"
              name="fifth"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.fifth}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
            <input
              type="text"
              name="sixth"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code.sixth}
              onChange={handleOnChangeCode}
              pattern="/^\d{1}$/"
              maxLength={1}
              required
              className="w-10 h-10 outline-none bg-transparent border-2 border-white rounded-lg p-3"
            />
          </div>
        ) : null}

        <div className="flex flex-row justify-center gap-5">
          <button
            onClick={handleReset}
            type="reset"
            className="p-5 w-52 border-2 border-white text-white self-center mt-10 hover:bg-white hover:text-black text-lg"
          >
            Reset
          </button>
          <button
            onClick={registerUser}
            type="button"
            className="p-5 w-52 border-2 border-white text-white self-center mt-10 hover:bg-white hover:text-black text-lg"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Form;
