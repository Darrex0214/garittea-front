import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FacultySelect } from '../selects/FacultySelect';

interface FilterValues {
  faculty?: string;
  estado?: string;
  [key: string]: any;
}

interface SearchFilterModalProps {
  open: boolean;
  initialFilters?: FilterValues;
  onClose: () => void;
  onSearch: (filters: FilterValues) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  open,
  initialFilters = {},
  onClose,
  onSearch,
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters, open]);

  const handleChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Buscar Créditos</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <FacultySelect
          value={filters.faculty || ''}
          onChange={(value) => handleChange('faculty', value)}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            id="estado-select"
            value={filters.estado || ''}
            label="Estado"
            onChange={(e) => handleChange('estado', e.target.value as string)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="1">Pendiente</MenuItem>
            <MenuItem value="2">Nota crédito</MenuItem>
            <MenuItem value="3">Pagado</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSearch}>Buscar</Button>
      </DialogActions>
    </Dialog>
  );
};