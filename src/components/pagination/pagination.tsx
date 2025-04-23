import React from 'react';
import TablePagination from '@mui/material/TablePagination';

interface PaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PaginationComponent({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: PaginationProps) {
    return (
        <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{margin: '10px 100px'}}
        />
    );
}