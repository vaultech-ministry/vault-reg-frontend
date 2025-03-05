import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const MemberForm = ({ initialData, onSuccess, membersApi, darkMode, onClose }) => {
    const api = import.meta.env.VITE_API_URL

    const formik = useFormik({
        initialValues: {
            firstName: initialData?.first_name || '',
            secondName: initialData?.second_name || '',
            surName: initialData?.sur_name || '',
            date_of_birth: initialData?.date_of_birth || '',
            location: initialData?.location || '',
            phone: initialData?.phone || '',
            altPhone: initialData?.alt_phone || '',
            isStudent: initialData?.is_student === 'Yes' || false,
            school_type: initialData?.school_type || '',
            school: initialData?.school || '',
            occupation: initialData?.occupation || '',
            group: initialData?.ag_group?.toString() || '',
            gender: initialData?.gender || '',
            status: initialData?.status || 'active',
            contact_name: initialData?.contact_name || '',
            contact_phone: initialData?.contact_phone || '',
            contact_alt_phone: initialData?.contact_alt_phone || '',
            relationship: initialData?.relationship || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            secondName: Yup.string().required('Required'),
            date_of_birth: Yup.date().required('Required'),
            location: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
            gender: Yup.string().required('Required'),
            status: Yup.string().required('Required'),
            contact_name: Yup.string().required('Required'),
            contact_phone: Yup.string().required('Required'),
            contact_alt_phone: Yup.string().required('Required'),
            relationship: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const memberData = {
                    first_name: values.firstName,
                    second_name: values.secondName,
                    sur_name: values.surName,
                    date_of_birth: values.date_of_birth,
                    location: values.location,
                    phone: values.phone,
                    alt_phone: values.altPhone,
                    is_student: values.isStudent ? "Yes" : "No",
                    school_type: values.isStudent ? values.school_type : '',
                    school: values.isStudent ? values.school : '',
                    occupation: values.occupation,
                    ag_group: parseInt(values.group),
                    gender: values.gender,
                    status: values.status,
                    contact_name: values.contact_name,
                    contact_phone: values.contact_phone,
                    contact_alt_phone: values.contact_alt_phone,
                    relationship: values.relationship,
                };

                let response;
                if (initialData) {
                    response = await fetch(`${api}member/${initialData.id}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(memberData),
                    });
                } else {
                    response = await fetch(`${api}member`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(memberData),
                    });
                }

                if (response.ok) {
                    const updatedMember = await response.json();
                    toast.success(`Member ${initialData ? "updated" : "registered"} successfully!`);
                    onSuccess(updatedMember);
                    resetForm();
                } else {
                    const errorData = await response.json();
                    toast.error(`Failed to save member. ${errorData.error || 'Please try again.'}`);
                }
            } catch (err) {
                toast.error('An error occurred. Please try again later.');
            } finally {
                setSubmitting(false);
                membersApi();
            }
        },
    });

    return (
        <div className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50 p-4 font-sans">
            <div className={`w-full max-w-4xl max-h-screen overflow-auto mx-auto rounded-lg shadow-lg p-6 md:p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className='flex justify-between items-center border-b pb-4'>
                    <h1 className={`text-2xl md:text-3xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {initialData ? "Edit Member" : "Register a New Member"}
                    </h1>
                    <button onClick={onClose} className='text-gray-500 hover:text-indigo-600'>
                        <X size={24}/>
                    </button>
                </div>
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <InputField formik={formik} name="firstName" label="First Name" darkMode={darkMode} />
                    <InputField formik={formik} name="secondName" label="Second Name" darkMode={darkMode} />
                    <InputField formik={formik} name="surName" label="Sur Name" darkMode={darkMode} />
                    <RadioField formik={formik} name="gender" label="Gender" options={["Telios", "Elysian"]} darkMode={darkMode} />
                    <InputField formik={formik} name="date_of_birth" label="Date of Birth" type="date" darkMode={darkMode} />
                    <InputField formik={formik} name="location" label="Location" darkMode={darkMode} />
                    <InputField formik={formik} name="phone" label="Phone" type="tel" darkMode={darkMode} />
                    <InputField formik={formik} name="altPhone" label="Alternative Phone" type="tel" darkMode={darkMode} />
                    <SelectField formik={formik} name="status" label="Status" options={["active", "inactive"]} darkMode={darkMode} />
                    <CheckboxField formik={formik} name="isStudent" label="Student?" darkMode={darkMode} />
                    
                    {formik.values.isStudent && (
                        <>
                            <SelectField formik={formik} name="school_type" label="School Type" options={["Primary", "Secondary", "University"]} darkMode={darkMode} />
                            <InputField formik={formik} name="school" label="School Name" darkMode={darkMode} />
                        </>
                    )}

                    <InputField formik={formik} name="occupation" label="Occupation" darkMode={darkMode} />
                    <SelectField formik={formik} name="group" label="AG Group" options={["1", "2", "3", "4"]} darkMode={darkMode} />

                    {/* Emergency Contact Fields */}
                    <h2 className={`text-lg font-semibold col-span-1 md:col-span-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Emergency Contact
                    </h2>
                    <InputField formik={formik} name="contact_name" label="Contact Name" darkMode={darkMode} />
                    <InputField formik={formik} name="contact_phone" label="Contact Phone" type="tel" darkMode={darkMode} />
                    <InputField formik={formik} name="contact_alt_phone" label="Alternative Contact Phone" type="tel" darkMode={darkMode} />
                    <InputField formik={formik} name="relationship" label="Relationship" darkMode={darkMode} />

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`w-full md:w-auto px-4 py-3 font-semibold rounded-lg transition duration-200 ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {initialData ? 'Edit Member' : 'Register Member'}
                    </button>
                </form>
            </div>
        </div>
    );
}


const InputField = ({ formik, name, label, type = "text", darkMode }) => (
    <div>
        <label htmlFor={name} className={`block mb-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
        <input
            id={name}
            type={type}
            {...formik.getFieldProps(name)}
            className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
        />
        {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-sm">{formik.errors[name]}</p>}
    </div>
);

const CheckboxField = ({ formik, name, label, darkMode }) => (
    <div className="flex items-center">
        <input
            id={name}
            type="checkbox"
            checked={formik.values[name]}
            onChange={formik.handleChange}
            className={`mr-2 h-4 w-4 ${darkMode ? 'text-blue-600' : 'text-blue-600'} focus:ring-blue-500 border-gray-300 rounded`}
        />
        <label htmlFor={name} className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>{label}</label>
    </div>
);

const SelectField = ({ formik, name, label, options, darkMode }) => (
    <div>
        <label htmlFor={name} className={`block mb-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
        <select
            id={name}
            {...formik.getFieldProps(name)}
            className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
        >
            <option value="" disabled>Select {label}</option>
            {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
        {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-sm">{formik.errors[name]}</p>}
    </div>
);

const RadioField = ({ formik, name, label, options, darkMode }) => (
    <div>
        <label className={`block mb-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
        <div className="flex items-center space-x-4">
            {options.map((option) => (
                <label key={option} className={`flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={formik.values[name] === option}
                        onChange={formik.handleChange}
                        className={`mr-2 h-4 w-4 ${darkMode ? 'text-blue-600' : 'text-blue-600'} focus:ring-blue-500`}
                    />
                    {option}
                </label>
            ))}
        </div>
    </div>
);

export default MemberForm;