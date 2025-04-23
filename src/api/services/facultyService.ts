import axios from 'axios';

export const facultyService = {
  getAllFaculties: () => axios.get('http://localhost:3000/faculty/'),
};