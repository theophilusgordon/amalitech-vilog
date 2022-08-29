import React from 'react'

const SendEmailModal = () => {
  const handleSend = async () => {
    //TODO: Hit route in backend to send file
  }

  return (
    <form className="absolute w-70 h-10 top-14 right-5 flex items-center bg-primary rounded">
      <input
        type="email"
        name="email"
        id="email"
        className="w-4/5 border-2 rounded mx-4"
      />
      <button className="px-3 py-1 text-white rounded hover:bg-orange-400 mr-2" onClick={handleSend}>
        SHARE
      </button>
    </form>
  );
}

export default SendEmailModal