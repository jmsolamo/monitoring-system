import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function ActualExpenses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('expenses');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch('http://localhost/enertech/api/getExpenses.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExpenses(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['ACTUAL EXPENSES'],
      ['LOGISTIC DEPARTMENT'],
      ['FEBRUARY'],
      [],
      ['DATE', 'ASSIGNED DRIVER', 'VEHICLE', 'DESTINATION', 'JO #', 'TOTAL EXPENSES', 'GASOLINE/DIESEL', '', 'TOLL FEE', 'PIER EXPENSES', 'REPAIRS AND MAINTENANCE', '', 'MEALS', 'LOAD', 'CONTINGENCY', 'AMOUNT'],
      ['', '', '', '', '', '', 'ACTUAL (L)', 'AMOUNT', '', '', 'PARTICULARS', 'AMOUNT', '', '', '', ''],
      ...expenses.map(e => [
        e.expense_date,
        e.driver,
        e.vehicle,
        e.destination,
        e.jo_no,
        e.total_exp,
        e.actual_liters,
        e.actual_amt,
        e.toll_amt,
        e.pier_amt,
        e.particulars,
        e.particulars_amt,
        e.meals_amt,
        e.load_amt,
        e.contingency_amt,
        e.final_amt
      ])
    ]);
    
    const colCount = 16;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
      { s: { r: 4, c: 6 }, e: { r: 4, c: 7 } },
      { s: { r: 4, c: 10 }, e: { r: 4, c: 11 } }
    ];
    
    for (let i = 0; i <= colCount; i++) {
      const cellRef0 = XLSX.utils.encode_cell({ r: 0, c: i });
      const cellRef1 = XLSX.utils.encode_cell({ r: 1, c: i });
      const cellRef2 = XLSX.utils.encode_cell({ r: 2, c: i });
      if (ws[cellRef0]) ws[cellRef0].s = { font: { bold: true }, alignment: { horizontal: 'center' } };
      if (ws[cellRef1]) ws[cellRef1].s = { font: { bold: true }, alignment: { horizontal: 'center' } };
      if (ws[cellRef2]) ws[cellRef2].s = { font: { bold: true }, alignment: { horizontal: 'center' } };
    }
    
    for (let i = 0; i < colCount; i++) {
      const cellRef4 = XLSX.utils.encode_cell({ r: 4, c: i });
      const cellRef5 = XLSX.utils.encode_cell({ r: 5, c: i });
      if (ws[cellRef4]) ws[cellRef4].s = { font: { bold: true }, alignment: { horizontal: 'center' }, border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
      if (ws[cellRef5]) ws[cellRef5].s = { font: { bold: true }, alignment: { horizontal: 'center' }, border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } } };
    }
    
    XLSX.utils.book_append_sheet(wb, ws, 'Actual Expenses');
    XLSX.writeFile(wb, 'Actual_Expenses.xlsx');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {isSidebarOpen && <h1 className="text-xl font-bold text-gray-900">Enertech</h1>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <i className={`bx ${isSidebarOpen ? 'bx-chevron-left' : 'bx-chevron-right'} text-xl text-gray-600`}></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <a 
              href="#" 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeMenu === 'dashboard' ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className='bx bx-home-alt text-xl'></i>
              {isSidebarOpen && <span>Dashboard</span>}
            </a>
            <a 
              href="/actual-expenses" 
              onClick={() => setActiveMenu('expenses')}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeMenu === 'expenses' ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className='bx bx-dollar-circle text-xl'></i>
              {isSidebarOpen && <span>Expenses</span>}
            </a>
            <a 
              href="#" 
              onClick={() => setActiveMenu('reports')}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeMenu === 'reports' ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className='bx bx-bar-chart-alt-2 text-xl'></i>
              {isSidebarOpen && <span>Reports</span>}
            </a>
            <a 
              href="#" 
              onClick={() => setActiveMenu('settings')}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
                activeMenu === 'settings' ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className='bx bx-cog text-xl'></i>
              {isSidebarOpen && <span>Settings</span>}
            </a>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                U
              </div>
              {isSidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">User</p>
                  <p className="text-xs text-gray-500">Role 1</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Actual Expenses</h2>
              <p className="text-sm text-gray-600">Logistic Department</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <i className='bx bxs-file-export text-lg'></i>
              Export to Excel
            </button>
          </div>
          
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-200">
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Date</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Assigned Driver</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Vehicle</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Destination</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">JO #</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Total Expenses</th>
                    <th colSpan="2" className="h-10 px-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Gasoline/Diesel</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Toll Fee</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Pier Expenses</th>
                    <th colSpan="2" className="h-10 px-3 text-center align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Repairs and Maintenance</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Meals</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Load</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Contingency</th>
                    <th rowSpan="2" className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs">Amount</th>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="h-10 px-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Actual (L)</th>
                    <th className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Amount</th>
                    <th className="h-10 px-3 text-left align-middle font-semibold text-gray-900 border-r border-gray-200 text-xs">Particulars</th>
                    <th className="h-10 px-3 text-left align-middle font-semibold text-gray-900 text-xs border-r border-gray-200">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.length === 0 ? (
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-3 py-3 align-middle text-center text-gray-500 text-xs" colSpan="16">
                        No results.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.expense_date}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.driver}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.vehicle}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.destination}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.jo_no}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.total_exp}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.actual_liters}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.actual_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.toll_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.pier_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.particulars}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.particulars_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.meals_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.load_amt}</td>
                        <td className="px-3 py-2 text-xs border-r border-gray-200">{expense.contingency_amt}</td>
                        <td className="px-3 py-2 text-xs">{expense.final_amt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
