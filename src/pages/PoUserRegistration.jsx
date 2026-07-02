import React, { useState } from "react";
import "../styles/PoUserRegistration.css";

import logo from "../assets/images/logo.png";
import eduhireText from "../assets/images/eduhire-text.png";
import eduMoto from "../assets/images/edu-moto.png";

import placementOfficer from "../assets/icons/placement-officer.png";
import recruiter from "../assets/icons/recruiter.png";
import student from "../assets/icons/student.png";
import trainingCoordinator from "../assets/icons/training-coordinator.png";

import user from "../assets/icons/user.png";
import university from "../assets/icons/university.png";
import eye from "../assets/icons/eye.png";
import dropdown from "../assets/icons/dropdown.png";
import arrowRight from "../assets/icons/arrow-right.png";
import radioUnselected from "../assets/icons/radio-unselected.png";

const roleList = [
  {
    title: "Placement Officer",
    description:
      "Manage drives, postings, student placements and company relations.",
    icon: placementOfficer,
    selected: true,
  },
  {
    title: "Recruiter",
    description:
      "Post jobs, search students and manage recruitment efficiently.",
    icon: recruiter,
    selected: false,
  },
  {
    title: "Student",
    description:
      "Explore opportunities, apply for jobs and track applications.",
    icon: student,
    selected: false,
  },
  {
    title: "Training Coordinator",
    description:
      "Manage training programs, schedules and student records.",
    icon: trainingCoordinator,
    selected: false,
  },
];

// ---------- Validation helpers ----------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;
// At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validateField = (name, value, formData) => {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 3)
        return "Full name must be at least 3 characters.";
      return "";

    case "email":
      if (!value.trim()) return "Official email address is required.";
      if (!EMAIL_REGEX.test(value.trim()))
        return "Please enter a valid email address.";
      return "";

    case "phone":
      if (!value.trim()) return "Phone number is required.";
      if (!PHONE_REGEX.test(value.trim()))
        return "Please enter a valid phone number.";
      return "";

    case "universityName":
      if (!value.trim()) return "University / Institution name is required.";
      return "";

    case "department":
      if (!value.trim())
        return "Department / Placement Cell is required.";
      return "";

    case "employeeId":
      if (!value.trim()) return "Employee ID is required.";
      return "";

    case "designation":
      if (!value) return "Please select your designation.";
      return "";

    case "password":
      if (!value) return "Password is required.";
      if (!PASSWORD_REGEX.test(value))
        return "Password must be 8+ characters and include uppercase, lowercase, a number and a special character.";
      return "";

    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      if (value !== formData.password) return "Passwords do not match.";
      return "";

    case "agreeToTerms":
      if (!value) return "You must agree to the Terms of Use and Privacy Policy.";
      return "";

    default:
      return "";
  }
};

const validateAll = (formData) => {
  const errors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key], formData);
    if (error) errors[key] = error;
  });
  return errors;
};

// ---------- Reusable field components ----------

const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  error,
}) => (
  <div className="ur-form-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={error ? "ur-input-error" : ""}
    />
    {error && <span className="ur-error-text">{error}</span>}
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  show,
  toggle,
  eye,
  error,
}) => (
  <div className="ur-form-group">
    <label>{label}</label>

    <div className="ur-input-with-icon">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder="********"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "ur-input-error" : ""}
      />

      <img
        src={eye}
        alt="eye"
        className="ur-eye-icon"
        onClick={toggle}
      />
    </div>
    {error && <span className="ur-error-text">{error}</span>}
  </div>
);

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  universityName: "",
  department: "",
  employeeId: "",
  designation: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const PoUserRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    const updatedFormData = { ...formData, [name]: newValue };
    setFormData(updatedFormData);

    // Only live-validate a field once it has already been touched
    // (i.e. it already has an entry, possibly empty string, in errors)
    setErrors((prev) => {
      if (!(name in prev) && name !== "password") return prev;

      const next = { ...prev };

      if (name in prev) {
        next[name] = validateField(name, newValue, updatedFormData);
      }

      // Keep confirmPassword in sync if password changes after confirm was touched
      if (name === "password" && "confirmPassword" in prev) {
        next.confirmPassword = validateField(
          "confirmPassword",
          updatedFormData.confirmPassword,
          updatedFormData
        );
      }

      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, fieldValue, formData),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitSuccess(false);

    const validationErrors = validateAll(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // No client-side errors — ready to send to the backend/API.
      setSubmitSuccess(true);
      // Example: call your registration API here with `formData`.
      console.log("Form submitted successfully:", formData);
    } else {
      // Scroll to the first field with an error for better UX
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementsByName(firstErrorField)[0];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (

    <div className="ur-main-wrapper">

      <div className="ur-registration-container">

        {/* LEFT PANEL */}

        <div className="ur-left-panel">

          <div className="ur-logo-section">

            <img
              src={logo}
              alt="Logo"
              className="ur-logo-image"
            />

            <div className="ur-logo-content">

              <img
                src={eduhireText}
                alt="EduHire"
                className="ur-logo-text"
              />

              <img
                src={eduMoto}
                alt="Moto"
                className="ur-logo-moto"
              />

            </div>

          </div>

          <div className="ur-content-section">

            <h1 className="ur-main-title">
              Create Your Account
            </h1>

            <p className="ur-main-description">
              Join CampusConnect and be part of a platform that
              connects talent with opportunities.
            </p>

            <p className="ur-role-heading">
              SELECT YOUR ROLE
            </p>

            {roleList.map((role) => (

              <div
                key={role.title}
                className={`ur-role-card ${
                  role.selected ? "ur-role-active" : ""
                }`}
              >

                <div className="ur-role-left">

                  <img
                    src={role.icon}
                    alt={role.title}
                    className="ur-role-icon"
                  />

                  <div className="ur-role-content">

                    <h3 className="ur-role-title">
                      {role.title}
                    </h3>

                    <p className="ur-role-description">
                      {role.description}
                    </p>

                  </div>

                </div>

                {role.selected ? (

                  <div className="ur-role-radio">
                    <div className="ur-role-radio-inner"></div>
                  </div>

                ) : (

                  <img
                    src={radioUnselected}
                    alt="Radio"
                    className="ur-role-radio-image"
                  />

                )}

              </div>

            ))}

          </div>

          <p className="ur-footer-text">
            Need help? Contact: support@campusconnect.com
          </p>

        </div>

        {/* RIGHT PANEL */}

        <div className="ur-right-panel">

          <div className="ur-form-header">

            <img
              src={user}
              alt="User"
              className="ur-form-user-icon"
            />

            <div>

              <h2 className="ur-form-title">
                User Registration
              </h2>

              <p className="ur-form-subtitle">
                Fill in the details below to create your account
              </p>

            </div>

          </div>

          {submitSuccess && (
            <div className="ur-success-banner">
              Registration details are valid! Submitting your account...
            </div>
          )}

          <form className="ur-registration-form" onSubmit={handleSubmit} noValidate>

            <div className="ur-form-fields">
              <div className="ur-form-row">

                <InputField
                  label="Full Name"
                  name="fullName"
                  placeholder="Johnathan Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fullName}
                />

                <InputField
                  label="Official Email Address"
                  type="email"
                  name="email"
                  placeholder="j.doe@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                />

              </div>

              <InputField
                label="Phone Number"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
              />

              <div className="ur-form-group">

                <label>
                  University / Institution Name
                </label>

                <div className="ur-input-with-icon">

                  <img
                    src={university}
                    alt="University"
                    className="ur-input-left-icon"
                  />

                  <input
                    type="text"
                    name="universityName"
                    placeholder="Search or type university name"
                    value={formData.universityName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.universityName ? "ur-input-error" : ""}
                  />

                </div>
                {errors.universityName && (
                  <span className="ur-error-text">{errors.universityName}</span>
                )}

              </div>

              <div className="ur-form-row">

                <InputField
                  label="Department / Placement Cell"
                  name="department"
                  placeholder="Corporate Relations"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.department}
                />

                <InputField
                  label="Employee ID"
                  name="employeeId"
                  placeholder="EMP-2024-001"
                  value={formData.employeeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.employeeId}
                />

              </div>

              <div className="ur-form-group">

                <label>
                  Designation
                </label>

                <div className="ur-input-with-icon">

                  <select
                    className={`ur-select-field ${
                      errors.designation ? "ur-input-error" : ""
                    }`}
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >

                    <option value="" disabled>
                      Select your designation
                    </option>

                    <option>
                      Placement Officer
                    </option>

                    <option>
                      Senior Placement Officer
                    </option>

                    <option>
                      Head of Placement Cell
                    </option>

                  </select>

                  <img
                    src={dropdown}
                    alt="Dropdown"
                    className="ur-dropdown-icon"
                  />

                </div>
                {errors.designation && (
                  <span className="ur-error-text">{errors.designation}</span>
                )}

              </div>

              <div className="ur-form-row">

                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  show={showPassword}
                  toggle={() =>
                    setShowPassword(!showPassword)
                  }
                  eye={eye}
                  error={errors.password}
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  show={showConfirmPassword}
                  toggle={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  eye={eye}
                  error={errors.confirmPassword}
                />

              </div>

            </div>

            <div className="ur-form-bottom">

              <label className="ur-checkbox-section">

                <input
                  type="checkbox"
                  name="agreeToTerms"
                  className="ur-checkbox-input"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <span className="ur-checkbox-text">

                  I agree to the

                  <strong> Terms of Use </strong>

                  and

                  <strong> Privacy Policy</strong>

                </span>

              </label>
              {errors.agreeToTerms && (
                <span className="ur-error-text">{errors.agreeToTerms}</span>
              )}

              <button
                type="submit"
                className="ur-register-button"
              >

                Complete Registration

                <img
                  src={arrowRight}
                  alt="Arrow"
                  className="ur-button-arrow"
                />

              </button>

              {submitAttempted && Object.keys(errors).length > 0 && (
                <p className="ur-form-error-summary">
                  Please fix the highlighted fields above before submitting.
                </p>
              )}

              <p className="ur-login-text">

                Already have an account?

                <span> Log In</span>

              </p>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

};

export default PoUserRegistration;
