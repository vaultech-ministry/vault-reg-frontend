import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function AgGroupModal({ onClose, onSubmit, initialData}) {

  const [formData, setFormData] = useState({
    group_name: initialData ? initialData.group_name : '',
    description: initialData ? initialData.description : '',
    image: null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        group_name: initialData.group_name,
        description: initialData.description,
        image: null,
      })
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const formDataObj = new FormData()
    formDataObj.append('group_name', formData.group_name)
    formDataObj.append('description', formData.description)
    if (formData.image) {
      formDataObj.append('image', formData.image)
    }

    if (initialData) {
      onSubmit(initialData.id, formDataObj)
    } else {
      onSubmit(formDataObj)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, [name]: files[0]}))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value}))
    }

  }

  // useEffect(() => {
  //   setFormData({
  //     ...initialData,
  //   })
  // }, [initialData])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className='bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-indigo-500'>{initialData ? 'Edit AG camp' : 'Add AG camp'}</h2>
          <button
            onClick={onClose}
            className="text-indigo-600 px-4 py-2 rounded-lg hover:text-indigo-800 transition-colors"
          >
            <X size={20}/>
            </button>
        </div>
        <form className='p-6' onSubmit={handleSubmit}>
          <label 
            htmlFor="group_name"
            className='block text-sm font-medium text-gray-400 mb-2'
            >Enter AG name</label>
          <input 
            type="text"
            id='group_name'
            name='group_name'
            value={formData.group_name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-900 mb-2'
            placeholder='Transformers'
            required
             />
            <label 
            htmlFor="description"
            className='block text-sm font-medium text-gray-400 mb-2'
            >Enter AG Description</label>
          <textarea 
            type="text"
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-900 mb-2'
            placeholder='E.g: Transformers'
             />

            <label 
              htmlFor="image"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Upload Group Image (optional)
            </label>
            <input 
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-900 mb-2"
            />

             <div className='flex justify-end mt-4'>
             <button
              type='submit'
              className='px-4 py-2 border text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-900 rounded-md transition duration-300'
             >
              Submit
             </button>
             </div>
        </form>
      </div>
    </div>
  )
}

export default AgGroupModal
