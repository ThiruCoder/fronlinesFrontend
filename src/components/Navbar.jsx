import React from 'react'
import { Box, Typography } from '@mui/material';

const Navbar = () => {
    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#022343ff', color: 'white' }}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, p: 1, textAlign: 'center', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif, ' }}>
                Frontlines Media Assignment <p style={{ fontSize: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>—— Company Directory</p>

            </Typography>
        </Box>
    )
}

export default Navbar
