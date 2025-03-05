import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

function VisitorAddModal({ initialData, onSuccess, visitorsApi, darkMode, onClose }) {
    const api = import.meta.env.VITE_API_URL

    const formik = useFormik({
        initialValues: {
            firstName: initialData?.first_name || '',
            secondName: initialData?.last_name || '',
            surName: initialData?.sur_name || '',
            location: initialData?.location || '',
            gender: initialData?.gender || '',
            phone: initialData?.phone || '',
            church: initialData?.church || '',
            email: initialData?.email || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            secondName: Yup.string().required('Required'),
            location: Yup.string().required('Required')
        }),
        onSubmit: async (values, { setSubmitting, resetForm}) => {
            try {
                const visitorData = {
                    first_name: values.firstName,
                    last_name: values.secondName,
                    sur_name: values.surName,
                    location: values.location,
                    gender: values.gender,
                    phone: values.phone,
                    church: values.church,
                    email: values.email,
                }

                let response;
                if (initialData) {
                    response = await fetch(`${api}visitor/${initialData.id}/`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify(visitorData),
                    });
                } else {
                    response = await fetch(`${api}visitors`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify(visitorData),
                    })
                }

                if (response.ok) {
                    const updatedVisitor = await response.json();
                    toast.success(`${initialData ? "updated" : "registered"} successfully!`)
                    onSuccess(updatedVisitor)
                    resetForm()
                } else {
                    const errorData = await response.json()
                    console.error('Error ', errorData)
                    toast.error(`Failed to save. ${errorData.error || 'Please try again.'}`)
                }
            } catch (error) {
                console.error('Error ', error)
                toast.error('Something went wrong')
            } finally {
                setSubmitting(false)
                visitorsApi()
            }
        }
    })
    
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4'>
      <div className='bg-gray-900 rounded-lg shadow-xl w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6'>
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className={`text-3xl font-semibold text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-6` }>{initialData ? 'Edit Visitor' : 'Add visitor'}</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-indigo-600">
              <X size={24} />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4">
            <InputField formik={formik} name="firstName" label="First Name" darkMode={darkMode}/>
            <InputField formik={formik} name="secondName" label="Second Name" darkMode={darkMode}/>
            <InputField formik={formik} name="surName" label="Sur Name" darkMode={darkMode} />
            <InputField formik={formik} name="location" label="Location" darkMode={darkMode}/>
            <RadioField formik={formik} name="gender" label="Gender" options={["telios", "elysian"]} darkMode={darkMode} />
            <InputField formik={formik} name="phone" label="Phone" type="tel" darkMode={darkMode} />
            <InputField formik={formik} name="church" label="Church" darkMode={darkMode}/>
            <InputField formik={formik} name="email" label="Email" darkMode={darkMode}/>

            <button
                type='submit'
                disabled={formik.isSubmitting}
                className={`w-full sm:col-span-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base font-semibold rounded-lg transition duration-200 ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                {initialData ? 'Edit Visitor' : 'Add Visitor'}
            </button>
        </form>
      </div>
    </div>
  )
}

const InputField = ({ formik, name, label, type = "text", darkMode }) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={name} className={`font-medium text-sm sm:text-base ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
        <input
            id={name}
            type={type}
            {...formik.getFieldProps(name)}
            className={`w-full p-2 sm:p-3 border rounded-lg ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
        />
        {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-xs sm:text-sm">{formik.errors[name]}</p>}
    </div>
);

const RadioField = ({ formik, name, label, options, darkMode }) => (
    <div className="flex flex-col gap-2">
        <label className={`font-medium text-sm sm:text-base ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
        <div className="flex flex-wrap items-center gap-4">
            {options.map((option) => (
                <label key={option} className={`flex items-center text-sm sm:text-base ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
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

export default VisitorAddModal
