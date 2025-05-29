import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import UserManageView from 'src/sections/userManage/userManageView'

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Gestion Usuarios - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserManageView />
    </>
  );
}