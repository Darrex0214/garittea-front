import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { facultyService } from 'src/api/services/facultyService';

interface Faculty {
  id: number;
  name: string;
  // agrega otras propiedades si es necesario
}

interface FacultySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const FacultySelect: React.FC<FacultySelectProps> = ({ value, onChange }) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    facultyService.getAllFaculties()
      .then(response => {
        setFaculties(response.data);
      })
      .catch(error => {
        console.error('Error fetching faculties:', error);
      });
  }, []);

  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id="faculty-select-label">Facultad</InputLabel>
      <Select
        labelId="faculty-select-label"
        id="faculty-select"
        value={value || ''}
        label="Facultad"
        onChange={(e) => onChange(e.target.value as string)}
      >
        <MenuItem value="">
          <em>Todas</em>
        </MenuItem>
        {faculties.map((faculty) => (
          <MenuItem key={faculty.id} value={faculty.name}>
            {faculty.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};