import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Users } from 'lucide-react'
import EmployeeTable from '../components/EmployeeTable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanies } from '../redux/companySlice'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.companies);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);


    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {loading ?
                        <LoadingSpinner /> : <EmployeeTable employees={data} />}
                </div>
            </div>
        </div>
    )
}

export default Home