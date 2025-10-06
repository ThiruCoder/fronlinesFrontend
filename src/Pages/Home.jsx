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
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Company Directory</h2>
                                <p className="text-slate-600 mt-1">Manage and explore your team members</p>
                            </div>
                        </div>
                    </div>
                    {loading ?
                        <LoadingSpinner /> : <EmployeeTable employees={data} />}
                </div>
            </div>
        </div>
    )
}

export default Home