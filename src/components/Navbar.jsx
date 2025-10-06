import React from 'react'

const Navbar = () => {
    return (
        <div sx={{ flexGrow: 1, backgroundColor: '#022343ff', color: 'white' }}>
            <h4 className='text-xl font-bold p-4' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Frontlines Media Assignment <p style={{ fontSize: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>— Company Directory</p>
            </h4>
        </div>
    )
}

export default Navbar
