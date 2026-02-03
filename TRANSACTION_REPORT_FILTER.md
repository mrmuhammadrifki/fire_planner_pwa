# 📊 Transaction Report Filter Feature

## Overview
Halaman `/transaction/report` sekarang memiliki fitur **filter by month / date range** yang memungkinkan user untuk memfilter transaksi berdasarkan periode tertentu.

## Filter Options

### 1. **All Time (Semua)**
- Tampilkan **semua transaksi** tanpa filter
- Default option saat pertama kali membuka halaman

### 2. **By Month (Per Bulan)**
- Filter transaksi berdasarkan **bulan dan tahun** tertentu
- Dropdown otomatis terisi dengan bulan-bulan yang memiliki transaksi
- Format: "Januari 2026", "Februari 2026", dst.

### 3. **Custom Range (Kustom)**
- Filter transaksi dengan **rentang tanggal kustom**
- User dapat memilih **tanggal mulai** dan **tanggal selesai**
- Fleksibel untuk analisis periode spesifik

## Features

### ✅ **Real-time Filtering**
- Semua metrics (Summary Cards, Charts, Table) **otomatis update** saat filter berubah
- Tidak perlu reload halaman

### ✅ **Filtered Data Display**
- **Summary Cards**: Total Income, Outcome, Net Savings, Saving Rate
- **Monthly Cash Flow Chart**: Bar chart income vs outcome per bulan
- **Category Breakdown**: Pie charts untuk income & outcome categories
- **Transaction Table**: Daftar transaksi yang terfilter

### ✅ **PDF Export with Filter Info**
- PDF yang di-download **include informasi filter** yang aktif
- Contoh: "Filter: Januari 2026" atau "Filter: 01/01/2026 - 31/01/2026"
- Data di PDF sesuai dengan filter yang diterapkan

### ✅ **Transaction Count**
- Tampilan jumlah transaksi yang ter-filter
- Contoh: "15 transaksi" atau "15 transactions"

### ✅ **Reset Functionality**
- Tombol **Reset** untuk kembali ke "All Time"
- Clear semua filter state

## UI Components

### Filter Bar
```
[📅 Filter Periode:] [Semua] [Per Bulan] [Kustom]  [Dropdown/Dates] [Reset] [Count]
```

### States
```typescript
- filterType: 'all' | 'month' | 'custom'
- selectedMonth: string (format: "2026-01")
- dateFrom: string (format: "2026-01-01")
- dateTo: string (format: "2026-01-31")
```

## Usage Examples

### Example 1: Filter by Month
1. Klik tombol **"Per Bulan"**
2. Dropdown muncul dengan list bulan
3. Pilih bulan, misalnya "Januari 2026"
4. Semua data otomatis terfilter untuk Januari 2026

### Example 2: Filter by Custom Range
1. Klik tombol **"Kustom"**
2. Dua input date muncul
3. Pilih "From": 2026-01-01
4. Pilih "To": 2026-01-15
5. Data terfilter untuk 1-15 Januari 2026

### Example 3: Reset Filter
1. Setelah apply filter
2. Klik tombol **"Reset"** (dengan icon ×)
3. Kembali ke view "All Time"

## Technical Implementation

### Data Flow
```
User selects filter
  ↓
State updated (filterType, selectedMonth, etc.)
  ↓
useMemo recalculates filteredTransactions
  ↓
All dependent calculations re-run:
  - summary (income, outcome, savings rate)
  - monthlyData (for bar chart)
  - categoryData (for pie charts)
  ↓
UI re-renders with filtered data
```

### Performance
- **useMemo** digunakan untuk optimize calculations
- Filtering hanya re-run saat **dependencies berubah**
- Efficient untuk dataset besar

## Internationalization
- Semua UI text support **Bahasa Indonesia** dan **English**
- Auto-switch based on `settings.language`
- Month names follow locale format

## Responsive Design
- Mobile: Filter stacked vertically
- Desktop: Filter horizontal layout
- Touch-friendly buttons dan inputs

## Future Enhancements (Ideas)
- [ ] Quick filters: "Last 7 days", "Last 30 days", "This week"
- [ ] Filter by category
- [ ] Filter by transaction type (income only / outcome only)
- [ ] Save filter preferences
- [ ] Export filter settings with CSV
