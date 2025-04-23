// src/pages/creditNote/index.tsx (o el nombre de tu archivo de página)
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { CreditNoteView } from 'src/sections/creditNote/CreditNoteView';

export default function CreditNotePage() {
  return (
    <>
      <Helmet>
        <title>{`Notas de Crédito - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreditNoteView />
    </>
  );
}