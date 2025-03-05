import React, { useEffect, useState } from 'react';
import { Lock, Link  } from "lucide-react";

const Tabs = ({ value, onValueChange, children }) => (
  <div>
    <div className='flex border-b'>{children.filter(child => child.type === TabsList)}</div>
    {children.filter(child => child.props.value === value)}
  </div>
);

const TabsList = ({ children }) => (
  <div className='flex space-x-4'>{children}</div>
);

const TabsTrigger = ({ value, children, setActiveTab }) => (
  <button onClick={() => setActiveTab(value)} className='px-4 py-2 border-b-2 hover:border-blue-500'>
    {children}
  </button>
);

const TabsContent = ({ value, children }) => <div className='mt-4'>{children}</div>;

const Input = ({ type = 'text', placeholder }) => (
  <input type={type} placeholder={placeholder} className='w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
);

const Button = ({ children }) => (
  <button className='bg-indigo-600 text-white px-4 py-2 rounded-lg'>{children}</button>
);

const Switch = () => (
  <input type='checkbox' className='toggle-checkbox' />
);

const Card = ({ children }) => (
  <div className='border border-gray-300 rounded-lg p-4 shadow-sm'>{children}</div>
);

const CardContent = ({ children }) => <div className='p-4'>{children}</div>;

function Settings({ darkMode }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [googleDriveConnect, setGoogleDriveConnect] = useState(false)
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchGoogleDriveConnection()
  }, [])

  const fetchGoogleDriveConnection = async () => {
    try {
      const response = await fetch(`${api}check-google-drive-connection/`)
      const data = await response.json()
      setGoogleDriveConnect(data.connected)
    } catch (error) {
        console.log('Error: ', error)
    }
  }

  const handleGoogleDriveConnect = async () => {
    try {
      const response = await fetch(`${api}auth/google-drive/`)
      const data = await response.json()
      if (data.auth_url) {
        window.location.href = data.auth_url
      }
    } catch (error) {
        console.error('Error fetching google drive auth URL: ',error)
    }
  }

  const handleGoogleDriveDisconnect = async () => {
    const response = await fetch(`${api}disconnect-google-drive/`, {
      method: 'POST'
    })
    if (response.ok) {
      setGoogleDriveConnect(false)
    }
  }

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" setActiveTab={setActiveTab}>Profile</TabsTrigger>
          <TabsTrigger value="security" setActiveTab={setActiveTab}><Lock className='w-4 h-4 inline' /> Security</TabsTrigger>
          <TabsTrigger value="integrations" setActiveTab={setActiveTab}><Link className='w-4 h-4 inline' /> Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <div className='flex gap-6'>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>First Name</label>
                <Input placeholder='John' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Last Name</label>
                <Input placeholder='Doe'/>
              </div>
              </div>
              <div className='flex gap-6'>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Email</label>
                <Input type='email' placeholder='john@example.com' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Phone Number</label>
                <Input type='tel' placeholder='+254712345678' />
              </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>Current Password</label>
                <Input type='password' placeholder='********' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 font-medium'>New Password</label>
                <Input type='password' placeholder='********' />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent>
              <p className='text-gray-600'>Connect vault reg app with third-party services.</p>
              {googleDriveConnect ? (
                <button 
                  onClick={handleGoogleDriveDisconnect}
                  className='bg-red-500 text-white px-4 py-2 rounded-lg mt-4'>Disconnect Google Drive</button>
              ) : (
                <button
                  onClick={handleGoogleDriveConnect}
                  className='bg-blue-500 text-white px-4 py-2 rounded-lg mt-4'>Connect Google Drive</button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;