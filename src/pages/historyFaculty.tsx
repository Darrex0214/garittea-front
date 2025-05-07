import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FacultyView } from 'src/sections/faculties/view/facultyView';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Historial - ${CONFIG.appName}`}</title>
      </Helmet>

      <FacultyView />
    </>
  );
}