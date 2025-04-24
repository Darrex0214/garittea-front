import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CreateCreditView } from 'src/sections/createCredit/CreateCreditView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Crear Credito - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateCreditView />
    </>
  );
}