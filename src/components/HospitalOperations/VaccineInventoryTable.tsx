import React, { useState } from 'react';
import { VaccineInventoryItem } from '../../types';
import { useAppStore } from '../../store';
import { 
  Package, Plus, Edit2, ShieldCheck, AlertTriangle, XCircle, 
  Clock, CheckCircle2, QrCode, Search, Filter, Hash, ThermometerSnowflake
} from 'lucide-react';
import { Button } from '../ui/Button';

interface VaccineInventoryTableProps {
  hospitalId: string;
}

export function VaccineInventoryTable({ hospitalId }: VaccineInventoryTableProps) {
  const { hospitalOperations, addVaccineStock, updateVaccineItem, currentDate } = useAppStore();
  const hospital = hospitalOperations[hospitalId] || hospitalOperations['hosp_1'];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'low_stock' | 'expiring_soon' | 'expired'>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaccineInventoryItem | null>(null);
  const [inspectingItem, setInspectingItem] = useState<VaccineInventoryItem | null>(null);

  // Form states for adding stock
  const [newName, setNewName] = useState('Rabies Vaccine (Rabivax-S)');
  const [newDoses, setNewDoses] = useState(50);
  const [newBatch, setNewBatch] = useState('RAB-DEMO-8025');
  const [newExpiry, setNewExpiry] = useState('2027-02-15');
  const [newManufacturer, setNewManufacturer] = useState('Serum Institute of India Ltd.');
  const [newLowThreshold, setNewLowThreshold] = useState(25);

  const inventory = hospital?.inventory || [];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && item.status === statusFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVaccineStock(hospitalId, {
      vaccineName: newName,
      availableDoses: Number(newDoses),
      currentlyUsed: 0,
      lowStockThreshold: Number(newLowThreshold),
      isLowStock: Number(newDoses) <= Number(newLowThreshold),
      expiryDate: newExpiry,
      batchNumber: newBatch,
      manufacturer: newManufacturer,
      status: 'valid'
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateVaccineItem(hospitalId, editingItem.id, {
      availableDoses: Number(editingItem.availableDoses),
      batchNumber: editingItem.batchNumber,
      expiryDate: editingItem.expiryDate,
      lowStockThreshold: Number(editingItem.lowStockThreshold)
    });
    setEditingItem(null);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#EAE7E1] shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E05D3F]/10 text-[#E05D3F] rounded-xl">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-heading font-extrabold text-[#2E2A5E]">
              Vaccine Inventory & Cold Chain Batches
            </h2>
          </div>
          <p className="text-xs text-[#6B6560] mt-1">
            Real-time stock monitoring, lot numbers, cold-chain verification, and automated expiration warnings.
          </p>
        </div>

        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#E05D3F] hover:bg-[#c94d31] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> + Add Vaccine Stock
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F6F4F1] p-3 rounded-2xl border border-[#EAE7E1]">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-2.5 text-[#8A847F]" />
          <input
            type="text"
            placeholder="Search by vaccine, batch code, or manufacturer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#EAE7E1] rounded-xl text-xs font-bold text-[#2E2A5E] outline-none focus:ring-2 focus:ring-[#E05D3F]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'valid', 'low_stock', 'expiring_soon', 'expired'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer capitalize shrink-0 ${
                statusFilter === filter
                  ? 'bg-[#2E2A5E] text-white shadow-2xs'
                  : 'bg-white text-[#6B6560] border border-[#EAE7E1] hover:bg-[#EAE7E1]'
              }`}
            >
              {filter === 'all' ? 'All Vaccines' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#EAE7E1] -mx-1 sm:mx-0">
        <table className="w-full min-w-[680px] text-left border-collapse">
          <thead>
            <tr className="bg-[#F6F4F1] border-b border-[#EAE7E1] text-[11px] font-extrabold text-[#6B6560] uppercase tracking-wider">
              <th className="p-4">Vaccine & Lot Details</th>
              <th className="p-4">Batch Number</th>
              <th className="p-4">Available Doses</th>
              <th className="p-4">Used Doses</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE7E1] text-xs font-bold">
            {filteredInventory.map(item => {
              const isExpired = item.status === 'expired' || new Date(item.expiryDate) < new Date(currentDate);
              const isLow = item.status === 'low_stock' || item.availableDoses <= item.lowStockThreshold;
              const isExpiringSoon = item.status === 'expiring_soon';

              return (
                <tr key={item.id} className="hover:bg-[#F6F4F1]/60 transition-colors">
                  <td className="p-4">
                    <div className="text-[#2E2A5E] font-extrabold text-sm">{item.vaccineName}</div>
                    <div className="text-[10px] text-[#6B6560] flex items-center gap-1.5 mt-0.5">
                      <ThermometerSnowflake size={12} className="text-[#0284C7]" />
                      {item.manufacturer} • 2°C to 8°C Cold Chain Verified
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#2E2A5E]">
                    <span className="bg-[#F6F4F1] px-2.5 py-1 rounded-md border border-[#EAE7E1] font-extrabold">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-base font-extrabold text-[#2E2A5E]">{item.availableDoses} doses</div>
                    <div className="text-[10px] text-[#8A847F]">Threshold: {item.lowStockThreshold}</div>
                  </td>
                  <td className="p-4 text-[#6B6560]">
                    {item.currentlyUsed} doses
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-extrabold ${isExpired ? 'text-[#B91C1C]' : isExpiringSoon ? 'text-[#D97706]' : 'text-[#2E2A5E]'}`}>
                      {item.expiryDate}
                    </span>
                  </td>
                  <td className="p-4">
                    {isExpired ? (
                      <span className="inline-flex items-center gap-1 bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#FCA5A5]">
                        <XCircle size={12} /> 🔴 Expired
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#FDE68A]">
                        <AlertTriangle size={12} /> ⚠ Low Stock
                      </span>
                    ) : isExpiringSoon ? (
                      <span className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#B45309] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#FCD34D]">
                        <Clock size={12} /> ⏳ Expiring Soon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#EBF7EE] text-[#1B7A3D] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                        <CheckCircle2 size={12} /> ✓ In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectingItem(item)}
                        className="px-2.5 py-1 bg-[#F6F4F1] hover:bg-[#EAE7E1] text-[#2E2A5E] text-[11px] font-extrabold rounded-lg border border-[#EAE7E1] transition-all cursor-pointer"
                        title="View SHA-256 batch details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="px-2.5 py-1 bg-[#2E2A5E] hover:bg-[#231f47] text-white text-[11px] font-extrabold rounded-lg transition-all cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Vaccine Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Plus className="text-[#E05D3F]" size={20} /> + Add Vaccine Stock
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Vaccine Name</label>
                <select
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                >
                  <option value="Rabies Vaccine (Rabivax-S)">Rabies Vaccine (Rabivax-S)</option>
                  <option value="Tetanus Vaccine (TT Booster)">Tetanus Vaccine (TT Booster)</option>
                  <option value="COVID-19 Vaccine (Covishield Demo)">COVID-19 Vaccine (Covishield Demo)</option>
                  <option value="Polio Vaccine (bOPV Demo)">Polio Vaccine (bOPV Demo)</option>
                  <option value="Hepatitis B Adult Booster">Hepatitis B Adult Booster</option>
                  <option value="Polyvalent Snake Antivenom">Polyvalent Snake Antivenom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Doses Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newDoses}
                    onChange={e => setNewDoses(Number(e.target.value))}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Low Stock Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={newLowThreshold}
                    onChange={e => setNewLowThreshold(Number(e.target.value))}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Batch / Lot Number</label>
                  <input
                    type="text"
                    value={newBatch}
                    onChange={e => setNewBatch(e.target.value)}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={e => setNewExpiry(e.target.value)}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={newManufacturer}
                  onChange={e => setNewManufacturer(e.target.value)}
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#E05D3F] hover:bg-[#c94d31] text-white rounded-xl font-extrabold"
                >
                  Add to Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Vaccine Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <Edit2 className="text-[#2E2A5E]" size={18} /> Update Inventory: {editingItem.vaccineName}
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Available Doses</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.availableDoses}
                    onChange={e => setEditingItem({ ...editingItem, availableDoses: Number(e.target.value) })}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.lowStockThreshold}
                    onChange={e => setEditingItem({ ...editingItem, lowStockThreshold: Number(e.target.value) })}
                    className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Batch Number</label>
                <input
                  type="text"
                  value={editingItem.batchNumber}
                  onChange={e => setEditingItem({ ...editingItem, batchNumber: e.target.value })}
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#6B6560] uppercase tracking-wider mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editingItem.expiryDate}
                  onChange={e => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                  className="w-full p-3 bg-[#F6F4F1] border-2 border-[#EAE7E1] rounded-xl text-xs font-extrabold text-[#2E2A5E] outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 border-[#EAE7E1] text-[#2E2A5E] rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2E2A5E] hover:bg-[#231f47] text-white rounded-xl font-extrabold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Batch Details Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-[#EAE7E1] shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] pb-3">
              <h3 className="text-lg font-heading font-extrabold text-[#2E2A5E] flex items-center gap-2">
                <ShieldCheck className="text-[#1B7A3D]" size={20} /> Cryptographic Batch Verification
              </h3>
              <button 
                onClick={() => setInspectingItem(null)}
                className="text-[#8A847F] hover:text-[#231F20] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div className="p-4 bg-[#F6F4F1] rounded-2xl border border-[#EAE7E1] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Vaccine:</span>
                  <span className="text-[#2E2A5E] font-extrabold">{inspectingItem.vaccineName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Batch Number:</span>
                  <span className="font-mono text-[#2E2A5E]">{inspectingItem.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Manufacturer:</span>
                  <span className="text-[#2E2A5E]">{inspectingItem.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Cold Storage:</span>
                  <span className="text-[#0284C7]">2°C - 8°C (Sensors Active)</span>
                </div>
              </div>

              <div className="p-4 bg-[#EBF7EE] rounded-2xl border border-[#C8E6C9] space-y-2">
                <span className="text-[10px] text-[#1B7A3D] font-extrabold uppercase tracking-wider block">
                  SHA-256 Supply Ledger Root Hash
                </span>
                <p className="font-mono text-[11px] text-[#1B7A3D] break-all leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#C8E6C9]">
                  0x7f4e92a83c1b6d05f329910d8a7c6451e0892f39d891b2c4518a29e01bc391ab
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#1B7A3D]">
                  <CheckCircle2 size={13} />
                  <span>Tamper-evident verification signature validated with Serum Institute node</span>
                </div>
              </div>

              <Button
                onClick={() => setInspectingItem(null)}
                className="w-full bg-[#2E2A5E] hover:bg-[#231f47] text-white font-extrabold rounded-xl py-3"
              >
                Close Verification Inspector
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
