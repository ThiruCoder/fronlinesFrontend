import React from 'react'

const Navbar = () => {
    return (
        <div sx={{ flexGrow: 1, backgroundColor: '#022343ff', color: 'white' }}>
            <h4 className='text-[14px] sm:text-lg font-bold p-4 flex flex-row justify-between items-center' >
                Frontlines Media Assignment <p className='text-[10px] sm:text-xs flex flex-row justify-end' >— Company Directory</p>
            </h4>
        </div>
    )
}

export default Navbar
