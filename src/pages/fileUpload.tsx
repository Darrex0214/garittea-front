import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { FileUploadView } from 'src/sections/fileUpload/FileUploadView'

// import { CreateCreditView } from 'src/sections/createCredit/CreateCreditView';


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Crear Credito - ${CONFIG.appName}`}</title>
      </Helmet>
      
      <FileUploadView />

      {/* <CreateCreditView onSuccess={() => console.log('Crédito creado exitosamente')} /> */}

    </>
  );
}