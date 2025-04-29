import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CreateNoteCreditView } from 'src/sections/createNote/view/CreateNoteView';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Crear Nota Crédito - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateNoteCreditView />
    </>
  );
}