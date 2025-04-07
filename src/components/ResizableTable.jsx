import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import './ResizableTable.css';

const ResizableTable = ({ columns, defaultSortOrder, sortDirections, ...props }) => {
  const [resizingColumn, setResizingColumn] = useState(null);
  const [columnWidths, setColumnWidths] = useState({});
  const tableRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Initialize column widths
  useEffect(() => {
    const initialWidths = {};
    columns.forEach(column => {
      if (column.width) {
        initialWidths[column.key] = column.width;
      }
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  const handleMouseDown = (e, columnKey) => {
    e.preventDefault();
    setResizingColumn(columnKey);
    startX.current = e.pageX;
    
    // Get current width of the column
    const columnElement = tableRef.current.querySelector(`[data-column-key="${columnKey}"]`);
    if (columnElement) {
      startWidth.current = columnElement.offsetWidth;
    }
  };

  const handleMouseMove = (e) => {
    if (!resizingColumn) return;
    
    const diff = e.pageX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff); // Minimum width of 50px
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth
    }));
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
  };

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn]);

  // Add resize handle to each column
  const resizableColumns = columns.map(column => ({
    ...column,
    width: columnWidths[column.key] || column.width,
    onHeaderCell: (col) => ({
      'data-column-key': col.key,
      style: { position: 'relative' },
      children: (
        <>
          {col.title}
          <div 
            className="resize-handle"
            onMouseDown={(e) => handleMouseDown(e, col.key)}
          />
        </>
      )
    })
  }));

  return (
    <div className="resizable-table-container">
      <Table 
        ref={tableRef}
        columns={resizableColumns} 
        defaultSortOrder={defaultSortOrder}
        sortDirections={sortDirections}
        {...props} 
      />
    </div>
  );
};

export default ResizableTable; 