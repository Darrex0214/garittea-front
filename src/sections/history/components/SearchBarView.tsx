import { useState, useEffect } from 'react';
import { TextField, Stack, MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '../../../api/services/facultyService';

interface Faculty {
  id: number;
  name: string;
}

interface SearchBarProps {
  onSearch: (filters: {
    faculty: string;
    estado: string;
    dates?: {
      start: string;
      end: string;
    };
  }) => void;
  initialFilters?: {
    faculty: string;
    estado: string;
    dates?: {
      start: string;
      end: string;
    };
  };
}

interface SearchFilters {
  faculty: string;
  estado: string;
  startDate: string;
  endDate: string;
}

export const SearchBar = ({ onSearch, initialFilters }: SearchBarProps) => {
  const { data: faculties = [] } = useQuery<Faculty[]>({
    queryKey: ['faculties'],
    queryFn: async () => {
      const response = await facultyService.getAllFaculties();
      return response.data;
    }
  });

  const [filters, setFilters] = useState({
    faculty: initialFilters?.faculty || '',
    estado: initialFilters?.estado || '',
    startDate: initialFilters?.dates?.start || '',
    endDate: initialFilters?.dates?.end || ''
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters({
        faculty: initialFilters.faculty,
        estado: initialFilters.estado,
        startDate: initialFilters.dates?.start || '',
        endDate: initialFilters.dates?.end || ''
      });
    }
  }, [initialFilters]);

  const handleTextFieldChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value
    };
    setFilters(newFilters);
    triggerSearch(newFilters);
  };

  const triggerSearch = (newFilters: SearchFilters) => {
    if (newFilters.startDate && 
        newFilters.endDate && 
        new Date(newFilters.startDate) > new Date(newFilters.endDate)) {
      return;
    }

    onSearch({
      faculty: newFilters.faculty,
      estado: newFilters.estado,
      dates: newFilters.startDate && newFilters.endDate ? {
        start: newFilters.startDate,
        end: newFilters.endDate
      } : undefined
    });
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <TextField
        select
        label="Facultad"
        value={filters.faculty}
        onChange={handleTextFieldChange('faculty')}
        sx={{ width: 200 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {faculties.map((faculty) => (
          <MenuItem key={faculty.id} value={faculty.id.toString()}>
            {faculty.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Estado"
        value={filters.estado}
        onChange={handleTextFieldChange('estado')}
        sx={{ width: 200 }}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="1">Pendiente</MenuItem>
        <MenuItem value="2">Nota Crédito</MenuItem>
        <MenuItem value="3">Pagado</MenuItem>
        <MenuItem value="4">Generado</MenuItem>
      </TextField>

      <TextField
        type="date"
        label="Fecha Inicio"
        value={filters.startDate}
        onChange={handleTextFieldChange('startDate')}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />

      <TextField
        type="date"
        label="Fecha Fin"
        value={filters.endDate}
        onChange={handleTextFieldChange('endDate')}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />
    </Stack>
  );
};