import React, { useState, useEffect } from 'react';
import './Table.css';

export const Table = ({ 
  columns,
  data,
  defaultSort,
  pageSize = 10,
  onRowClick,
  selectable = false,
  onSelectionChange
}) => {
  const [sortConfig, setSortConfig] = useState(defaultSort || { key: columns[0].key, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  // Apply sorting
  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Apply filtering
  const filteredData = sortedData.filter(row => 
    Object.entries(filterValues).every(([key, value]) => 
      !value || String(row[key]).toLowerCase().includes(value.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = e => {
    const newSelection = e.target.checked ? paginatedData.map(item => item.id) : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (id, isSelected) => {
    const newSelection = isSelected
      ? [...selectedRows, id]
      : selectedRows.filter(rowId => rowId !== id);
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="table-container">
      <div className="table-filters">
        {columns.map(column => column.filterable && (
          <input
            key={column.key}
            type="text"
            placeholder={`Filter ${column.label}...`}
            value={filterValues[column.key] || ''}
            onChange={e => setFilterValues({
              ...filterValues,
              [column.key]: e.target.value
            })}
          />
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            {selectable && (
              <th>
                <input 
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length > 0 && selectedRows.length === paginatedData.length}
                />
              </th>
            )}
            {columns.map(column => (
              <th 
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                className={column.sortable ? 'sortable' : ''}
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr 
              key={row.id || index}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={e => handleSelectRow(row.id, e.target.checked)}
                    onClick={e => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map(column => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="table-pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const TableColumns = ({ children }) => children;
