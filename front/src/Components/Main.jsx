import React, { useState } from 'react'
import { FaFileWord } from "react-icons/fa";
import axios from 'axios';
const Main = () => {
    const [filename, setfilename] = useState()
    const [convert, setconvert] = useState("")
    console.log(filename);
    function handlefilechange(e) {
        setfilename(e.target.files[0]);
    }
    var handleSubmit = async (e) => {
        e.preventDefault()
        if (!filename) {
            return convert("please select a file")
        }
        const formData = new FormData()
        formData.append("file", filename)
        try {
            const response = await axios.post('http://localhost:3000/convertFile',formData, 
            {  
                responseType: "blob"
             })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", filename.name.replace(/\.[^/.]+$/,  "") + ".pdf")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            setfilename(null)
            setconvert("file converted successfully")
        } catch (error) {
console.log(error);
        }

    }
    return (
        <div className='w-full h-[90vh] bg-zinc-700 flex items-center justify-center'>
            <div className="w-1/2 min-h-12 rounded-md border-2 border-zinc-400 text-white border-dotted px-10 py-7">
                <div className=" text-center py-8  ">
                    <h1 className='text-4xl'>Convert Word to Pdf online</h1>
                    <p className='text-zinc-400'>easily convert Word to PDF format online, without having to install any software.</p>
                </div>
                <div className=" flex flex-col items-center justify-center w-full">
                    <input type="file" accept='.doc,.docx' onChange={handlefilechange} className='hidden' id='fileInput' />
                    <label htmlFor="fileInput" className='w-full px-6 py-4 bg-zinc-400 rounded-xl cursor-pointer hover:bg-blue-600  flex items-center justify-center gap-4 '>
                        <FaFileWord className='text-4xl text-black' />
                        <span className='text-3xl text-black font-bold  ' >{
                            filename ? filename.name : "Choose file"
                        }</span>
                    </label>
                    <button onClick={handleSubmit} disabled={!filename} className='bg-zinc-600 w-[180px] hover:bg-blue-700 duration-300 disabled:pointer-events-none disabled:bg-gray-800 m-2 rounded-md p-2 mt-3'>Convert File</button>
                    {
                        convert &&  (<p className='text-green-500 font-semibold text-center'>{convert}</p>) 
                    }
                </div>

            </div>
        </div>
    )
}

export default Main