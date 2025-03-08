import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import toast from "react-hot-toast";

function LeadersAddModal({ initialData, onSuccess, leadersApi, darkMode, onClose }) {
    const api = import.meta.env.VITE_API_URL;
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`${api}member`);
                if (response.ok) {
                    const data = await response.json();
                    setMembers(data);
                } else {
                    toast.error("Failed to fetch members");
                }
            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Error fetching members");
            }
        };
        fetchMembers();
    }, [api]);

    const formik = useFormik({
        initialValues: {
            member: initialData?.member?.id ? String(initialData.member.id) : "",
            department: initialData?.department || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            member: Yup.string().required("Member is required"),
            department: Yup.string().required("Department is required"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const leaderData = {
                    member: parseInt(values.member, 10),
                    department: values.department,
                };

                let response;
                if (initialData) {
                    response = await fetch(`${api}leader/${initialData.id}/`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(leaderData),
                    });
                } else {
                    response = await fetch(`${api}leaders`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(leaderData),
                    });
                }

                if (response.ok) {
                    const updatedLeader = await response.json();
                    toast.success(`${initialData ? "Updated" : "Added"} successfully!`);
                    onSuccess(updatedLeader);
                    resetForm();
                } else {
                    const errorData = await response.json();
                    console.error("Error:", errorData);
                    toast.error(`Failed to save. ${errorData.error || "Please try again."}`);
                }

            } catch (error) {
                console.error("Error:", error);
                toast.error("Something went wrong");
            } finally {
                setSubmitting(false);
                leadersApi();
            }
        },
    });

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
            <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-4 sm:p-6">
                <div className="flex justify-between items-center border-b pb-4">
                    <h1 className={`text-2xl font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                        {initialData ? "Edit Leader" : "Add Leader"}
                    </h1>
                    <button onClick={onClose} className="text-gray-500 hover:text-indigo-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 p-2">
                    <DropdownField
                        formik={formik}
                        name="member"
                        label="Select Member"
                        options={members}
                        darkMode={darkMode}
                    />
                    <InputField formik={formik} name="department" label="Department" darkMode={darkMode} />

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`w-full py-2 px-3 font-semibold rounded-lg transition duration-200 ${
                            darkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        {initialData ? "Edit Leader" : "Add Leader"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const InputField = ({ formik, name, label, type = "text", darkMode }) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={name} className={`font-medium text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            {label}
        </label>
        <input
            id={name}
            type={type}
            {...formik.getFieldProps(name)}
            className={`w-full p-2 border rounded-lg ${
                darkMode ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
        />
        {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs">{formik.errors[name]}</p>}
    </div>
);

const DropdownField = ({ formik, name, label, options, darkMode }) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={name} className={`font-medium text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            {label}
        </label>
        <select
            id={name}
            name={name} 
            value={formik.values[name] || ""}
            onChange={formik.handleChange} 
            className={`w-full p-2 border rounded-lg ${
                darkMode ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
        >
            <option value="">Select a Member</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.first_name} {option.second_name} {option.sur_name || ""}
                </option>
            ))}
        </select>
        {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs">{formik.errors[name]}</p>}
    </div>
);

export default LeadersAddModal;
