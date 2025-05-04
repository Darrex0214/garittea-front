import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PeopleView } from 'src/sections/people/peopleView';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Historial - ${CONFIG.appName}`}</title>
      </Helmet>

      <PeopleView />
    </>
  );
}