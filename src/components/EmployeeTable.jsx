import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Mail, Phone, MapPin, Calendar, ChevronLeft, ChevronRight, CircleCheckBig, ArrowDown, ArrowUp, ArrowLeft, Scan } from 'lucide-react';
import { useDispatch } from 'react-redux';

const deps = [
    "Technology",
    "Conglomerate",
    "Pharmaceuticals",
    "Food & Beverage",
    "Research",
    "Biotechnology",
    "Manufacturing",
    "Energy"
]


export default function EmployeeTable({ employees }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [publicFilter, setPublicFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [moreData, setMoreData] = useState(null);

    const [activeFilterField, setActiveFilterField] = useState('');

    const showMoreData = (id) => {
        if (!id) return;
        const findData = employees.find((emp) => emp._id === id);
        if (!findData) return;
        setMoreData(findData);

    }
    const clearShowingData = () => {
        setMoreData(null);
    }

    const itemsPerPage = 8;

    const departments = useMemo(() => {
        const deptSet = new Set(deps);
        return ['all', ...Array.from(deptSet).sort()];
    }, [employees]);



    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setActiveFilterField(field);
    };

    const filteredAndSortedEmployees = useMemo(() => {
        let filtered = employees.filter(employee => {
            const matchesSearch =
                (employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (employee.industry?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (employee.foundedYear?.toString().includes(searchTerm.toLowerCase()) || false) ||
                (employee.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (employee.ceo?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (employee.website?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

            const matchesDepartment = departmentFilter === 'all' || employee.industry?.toLowerCase() === departmentFilter?.toLowerCase();
            const matchesPublic = publicFilter === 'all' ||
                (publicFilter === 'public' ? employee.isPublic === true : employee.isPublic === false);
            const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;

            return matchesSearch && matchesDepartment && matchesStatus && matchesPublic;
        });

        filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue === undefined || bValue === undefined) return 0;

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [employees, searchTerm, sortField, sortDirection, departmentFilter, statusFilter, publicFilter]);

    const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredAndSortedEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'On Leave': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Remote': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    function formatAmount(amount) {
        if (!amount) return "N/A";
        if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)} Billion`;
        if (amount >= 1e7) return `${(amount / 1e9).toFixed(2)} Crore`;
        if (amount >= 1e5) return `${(amount / 1e9).toFixed(2)} Lakh`;
        if (amount >= 1e6) return `${(amount / 1e9).toFixed(2)} Million`;
        return amount.toLocaleString();
    }

    return (
        <div className="space-y-6">
            {moreData === null && (
                <div className="flex flex-col xl:flex-row md:flex-row lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Ceo/Company, Department, or Founded..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            disabled={employees.length === 0}
                            className={`${employees.length === 0 && 'bg-gray-100'} w-full pl-12 pr-4 py-2 text-sm bg-white border capitalize text-blue-800 font-medium border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        />
                    </div>

                    <div className="flex flex-nowrap gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900 font-sans" />
                            <select
                                value={departmentFilter}
                                onChange={(e) => {
                                    setDepartmentFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                disabled={employees.length === 0}
                                className={`${employees.length === 0 && 'bg-gray-100'} w-full sm:w-52 pl-10 pr-10 py-2 text-sm bg-blue-100 border capitalize text-blue-900 font-sans border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all`}
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'All Departments' : dept}
                                    </option>
                                ))}
                            </select>
                            {departmentFilter !== 'all' &&
                                <span
                                    className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-900 font-sans-400 border border-slate-300 rounded-2xl text-white font-sans flex items-center justify-center text-[10px] font-bold'
                                >{paginatedEmployees.length}</span>}
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900" />
                            <select
                                value={publicFilter}
                                onChange={(e) => {
                                    setPublicFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                disabled={employees.length === 0}
                                className={`${employees.length === 0 && 'bg-gray-100'} pl-10 pr-10 py-2 text-sm bg-blue-100 border  capitalize text-blue-800 font-medium border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all`}
                            >
                                <option value='all'>All Status</option>
                                <option value="public">Public</option>
                                <option value="unpublic">UnPublic</option>
                            </select>
                            {publicFilter !== 'all' &&
                                <span
                                    className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-900 font-sans-400 border border-slate-300 rounded-2xl text-white flex items-center justify-center text-[10px] font-bold'
                                >{paginatedEmployees.length}</span>}
                        </div>
                    </div>
                </div>
            )}
            {moreData === null ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left relative">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className={`${activeFilterField === 'name' ? 'text-green-500' : 'text-slate-700 '} flex items-center gap-2 text-[8px] sm:text-xs font-semibold uppercase tracking-wider hover:text-blue-600 transition-colors`}
                                        >
                                            CEO / Company
                                            {activeFilterField === 'name' ?
                                                <ArrowDown className="absolute top-7 right-9 -translate-y-1/2 translate-x-1/2 text-green-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />
                                                : <ArrowUp className="absolute top-7 right-9 -translate-y-1/2 translate-x-1/2 text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left relative">
                                        <button
                                            onClick={() => handleSort('industry')}
                                            className={`${activeFilterField === 'industry' ? 'text-green-500' : 'text-slate-700 '} flex items-center gap-2 text-[8px] sm:text-xs font-semibold uppercase tracking-wider hover:text-blue-600 transition-colors`}
                                        >
                                            Department
                                            {activeFilterField === 'industry' ?
                                                <ArrowDown className="absolute top-7 right-5 -translate-y-1/2 translate-x-1/2 text-green-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />
                                                : <ArrowUp className="absolute top-7 right-4 -translate-y-1/2 translate-x-1/2 text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />}
                                        </button>
                                    </th>
                                    <th className="px-2 py-1 text-left relative">
                                        <button
                                            onClick={() => handleSort('foundedYear')}
                                            className={`${activeFilterField === 'foundedYear' ? 'text-green-500' : 'text-slate-700 '} flex items-center gap-2 text-[8px] sm:text-xs font-semibold  uppercase tracking-wider hover:text-blue-600 transition-colors`}
                                        >
                                            Founded
                                            {activeFilterField === 'foundedYear' ?
                                                <ArrowDown className="absolute top-7 right-0 -translate-y-1/2 translate-x-1/2 text-green-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />
                                                : <ArrowUp className="absolute top-7 right-0 -translate-y-1/2 translate-x-1/2 text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-[8px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Location
                                        </span>
                                    </th>
                                    <th className="px-6 py-4 text-left relative">
                                        <button
                                            onClick={() => handleSort('revenue')}
                                            className={`${activeFilterField === 'revenue' ? 'text-green-500' : 'text-slate-700 '} flex items-center gap-2 text-[8px] sm:text-xs font-semibold uppercase tracking-wider hover:text-blue-600 transition-colors`}
                                        >
                                            Revenue
                                            {activeFilterField === 'revenue' ?
                                                <ArrowDown className="absolute top-7 right-3 -translate-y-1/2 translate-x-1/2 text-green-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />
                                                : <ArrowUp className="absolute top-7 right-3 -translate-y-1/2 translate-x-1/2 text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left relative">
                                        <button
                                            onClick={() => handleSort('website')}
                                            className={`${activeFilterField === 'website' ? 'text-green-500' : 'text-slate-700 '} flex items-center gap-2 text-[8px] sm:text-xs font-semibold uppercase tracking-wider hover:text-blue-600 transition-colors"`}
                                        >
                                            Website
                                            {activeFilterField === 'website' ?
                                                <ArrowDown className="absolute top-7 right-9 -translate-y-1/2 translate-x-1/2 text-green-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />
                                                : <ArrowUp className="absolute top-7 right-9 -translate-y-1/2 translate-x-1/2 text-blue-600 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full" />}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedEmployees.map((employee) => (
                                    <tr key={employee._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex items-center gap-2 group cursor-pointer">
                                                    <div
                                                        onClick={() => showMoreData(employee._id)}
                                                        className="relative cursor-pointer w-5 md:w-10 h-5 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-[8px] sm:text-xs flex-shrink-0 group overflow-hidden transition-transform duration-300 hover:scale-110"
                                                    >
                                                        <span className="transition-opacity duration-300 group-hover:opacity-30">
                                                            {getInitials(employee.name)}
                                                        </span>

                                                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <Scan />
                                                        </span>
                                                    </div>
                                                    <div className="absolute left-full ml-2 w-[78px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 bg-gray-400 text-white text-xs rounded-md px-2 py-1 shadow-lg transition-all duration-300 pointer-events-none">
                                                        Show more
                                                        {/* Arrow */}
                                                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rotate-45"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[8px] sm:text-xs font-semibold text-slate-900">{employee.name}</div>
                                                    <p className="text-[8px] sm:text-xs text-slate-500 flex items-center gap-1">
                                                        {employee.ceo}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-1">
                                            <div className="text-[8px] sm:text-xs font-medium text-slate-900">{employee.industry}</div>
                                        </td>
                                        <td className="px-6 py-4  w-10">
                                            <div className="text-[8px] sm:text-xs text-slate-700 font-medium">{employee.foundedYear ? employee.foundedYear : 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {/* <div className="text-sm text-slate-600 flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                {employee.phone}
                                            </div> */}
                                                <div className="text-[8px] sm:text-xs text-slate-600 flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    {employee.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 w-28 text-[8px] sm:text-xs ">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${getStatusColor(employee.status)}`}>
                                                {formatAmount(employee.revenue)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] sm:text-xs font-medium border ${getStatusColor(employee.status)}`}>
                                                {employee.website ? employee.website : 'No link found'}
                                            </span>
                                            {/* <div className="text-sm text-slate-600 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(employee.hireDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredAndSortedEmployees.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-slate-400 text-lg font-medium">No employees found</div>
                            <div className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</div>
                        </div>
                    )}

                    {filteredAndSortedEmployees.length > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-[9px] sm:text-xs text-slate-600">
                                Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                <span className="font-semibold text-slate-900">
                                    {Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)}
                                </span>{' '}
                                of <span className="font-semibold text-slate-900">{filteredAndSortedEmployees.length}</span> companies
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg text-[8px] sm:text-xs border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-3 sm:w-5 h-3 sm:h-5 text-slate-600" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-5 sm:w-10 h-5 sm:h-10 rounded-lg font-medium text-[8px] sm:text-xs transition-all ${currentPage === page
                                                ? 'bg-blue-500 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-white border border-slate-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-3 sm:w-5 h-3 sm:h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <KeyValueTable data={moreData} clearShowingData={clearShowingData} />
            )}
        </div>
    );
}


const KeyValueTable = ({ data, clearShowingData }) => {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className='flex justify-end row-end-1 items-end'>
                <button
                    onClick={clearShowingData}
                    className="group flex items-center m-4 px-2 py-1 font-bold bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                    <ArrowLeft
                        className="mr-2 p-1 rounded-2xl bg-blue-200 group-hover:scale-110 group-hover:bg-blue-200 transition-colors"
                        size={22}
                    />
                    Close
                </button>

            </div>
            <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-200">
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <th className="px-4 py-2 font-bold font-serif text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
                            <td className="px-4 py-2 text-gray-700 font-serif">
                                {key === 'isPublic'
                                    ? value ? 'Public' : 'Private'
                                    : value ?? 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
