import React, { useState } from 'react';
import { Plus, ArrowDownCircle, Wallet, UserMinus, UserPlus, ArrowRight } from 'lucide-react';
import { Transaction, AccountType, Category } from '../types';

interface SalaryManagerProps {
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const SalaryManager: React.FC<SalaryManagerProps> = ({ onAddTransaction }) => {
  const [activeTab, setActiveTab] = useState<'salary' | 'lending' | 'received'>('salary');
  
  // Salary State
  const [salaryAmount, setSalaryAmount] = useState<string>('');

  // Received Money State
  const [receivedAmount, setReceivedAmount] = useState('');
  const [receivedDesc, setReceivedDesc] = useState('');
  const [receivedDestination, setReceivedDestination] = useState<AccountType>('cash');

  // Lending State
  const [lendingMode, setLendingMode] = useState<'give' | 'recover'>('give');
  const [lendPerson, setLendPerson] = useState('');
  const [lendAmount, setLendAmount] = useState('');
  const [lendAccount, setLendAccount] = useState<AccountType>('cash');

  const handleAddSalary = () => {
    if (!salaryAmount) return;

    // Protection against accidental touches
    const confirmMsg = `Are you sure you want to add Tk ${parseFloat(salaryAmount).toLocaleString()} to your Salary Account?`;
    if (!window.confirm(confirmMsg)) {
        return;
    }

    onAddTransaction({
      amount: parseFloat(salaryAmount),
      type: 'income',
      category: Category.SALARY,
      description: 'Monthly Salary',
      date: new Date().toISOString().split('T')[0],
      accountId: 'salary' // Fixed to Salary Account as requested
    });

    setSalaryAmount(''); // Clear input after adding
  };

  const handleAddReceivedMoney = () => {
    if (!receivedAmount) return;
    onAddTransaction({
      amount: parseFloat(receivedAmount),
      type: 'income',
      category: Category.OTHER,
      description: receivedDesc || 'Received Money',
      date: new Date().toISOString().split('T')[0],
      accountId: receivedDestination
    });
    setReceivedAmount('');
    setReceivedDesc('');
  };

  const handleLendingTransaction = () => {
    if (!lendAmount || !lendPerson) return;

    if (lendingMode === 'give') {
        // Giving money is treated as an Expense (money leaving account)
        onAddTransaction({
            amount: parseFloat(lendAmount),
            type: 'expense',
            category: Category.LENDING,
            description: `Lent to ${lendPerson}`,
            date: new Date().toISOString().split('T')[0],
            accountId: lendAccount
        });
    } else {
        // Recovering money is treated as Income (money entering account)
        onAddTransaction({
            amount: parseFloat(lendAmount),
            type: 'income',
            category: Category.LENDING,
            description: `Returned by ${lendPerson}`,
            date: new Date().toISOString().split('T')[0],
            accountId: lendAccount
        });
    }

    setLendAmount('');
    setLendPerson('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('salary')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[100px] ${
            activeTab === 'salary' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Salary
        </button>
        <button
          onClick={() => setActiveTab('lending')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[100px] ${
            activeTab === 'lending' 
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <UserMinus className="w-4 h-4" />
          Lending
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors min-w-[100px] ${
            activeTab === 'received' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          Receive
        </button>
      </div>

      <div className="p-6">
        {/* --- SALARY TAB --- */}
        {activeTab === 'salary' && (
          <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Enter Monthly Salary</label>
               <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-bold text-xs pt-0.5">Tk</span>
                    <input
                        type="number"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
                    />
                  </div>
                  <button
                    onClick={handleAddSalary}
                    disabled={!salaryAmount}
                    className="px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 dark:shadow-none active:scale-[0.98] flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
               </div>
               <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> 
                  Will be added to <strong>Salary Account</strong>
               </p>
            </div>
          </div>
        )}

        {/* --- LENDING TAB --- */}
        {activeTab === 'lending' && (
          <div className="space-y-4">
             {/* Sub-tabs for Lending */}
             <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
                <button
                    onClick={() => setLendingMode('give')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                        lendingMode === 'give' 
                        ? 'bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <UserMinus className="w-3 h-3" />
                    Lend (Give)
                </button>
                <button
                    onClick={() => setLendingMode('recover')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                        lendingMode === 'recover' 
                        ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <UserPlus className="w-3 h-3" />
                    Received Back
                </button>
             </div>

             <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {lendingMode === 'give' ? 'Lending To' : 'Received From'}
                    </label>
                    <input
                        type="text"
                        value={lendPerson}
                        onChange={(e) => setLendPerson(e.target.value)}
                        placeholder="Person's Name"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-bold text-xs pt-0.5">Tk</span>
                            <input
                                type="number"
                                value={lendAmount}
                                onChange={(e) => setLendAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {lendingMode === 'give' ? 'From Account' : 'To Account'}
                        </label>
                        <select
                            value={lendAccount}
                            onChange={(e) => setLendAccount(e.target.value as AccountType)}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            <option value="cash">Cash 💵</option>
                            <option value="salary">Salary Acc 🏦</option>
                            <option value="savings">Savings Acc 🐷</option>
                        </select>
                    </div>
                 </div>

                 <button
                    onClick={handleLendingTransaction}
                    disabled={!lendAmount || !lendPerson}
                    className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98] transform mt-2 ${
                        lendingMode === 'give' 
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none' 
                        : 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none'
                    }`}
                 >
                    {lendingMode === 'give' ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {lendingMode === 'give' ? 'Lend Money' : 'Confirm Repayment'}
                 </button>
             </div>
          </div>
        )}

        {/* --- RECEIVED (GENERAL) TAB --- */}
        {activeTab === 'received' && (
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</label>
               <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 font-bold text-xs pt-0.5">Tk</span>
                  <input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2">
                 <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description (Optional)</label>
                 <input
                    type="text"
                    value={receivedDesc}
                    onChange={(e) => setReceivedDesc(e.target.value)}
                    placeholder="e.g. Gift, Bonus"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
               </div>
               <div className="col-span-2">
                 <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Deposit To</label>
                 <select
                    value={receivedDestination}
                    onChange={(e) => setReceivedDestination(e.target.value as AccountType)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="cash">Cash 💵</option>
                    <option value="salary">Salary Account 🏦</option>
                    <option value="savings">Savings Account 🐷</option>
                  </select>
               </div>
             </div>

             <button
              onClick={handleAddReceivedMoney}
              disabled={!receivedAmount}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200 dark:shadow-none active:scale-[0.98] transform mt-2"
            >
              <Wallet className="w-5 h-5" />
              Receive Money
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryManager;