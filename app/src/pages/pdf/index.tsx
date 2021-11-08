import { useEffect, useRef } from 'react';
import ViewSDKClient from '../../api/pdf';
import Head from 'next/head';
import MainLayout from '../../components/layouts/MainLayout'
import Script from 'next/script';
import { annotations } from '../../constants';

const PDFView = () => {
  const containerRef = useRef();
  const viewerConfig = {
    // embedMode: 'IN_LINE',
    showAnnotationTools: true,
    enableFormFilling: true,
  };
  useEffect(() => {
    if(containerRef?.current) {
      const viewSDKClient = new ViewSDKClient();
      viewSDKClient.ready().then(() => {
        /* Invoke the file preview and get the Promise object */
        const previewFilePromise = viewSDKClient.previewFile("pdf-div", viewerConfig);
        previewFilePromise.then(adobeViewer => {
          /* API to add annotations */
          annotationManager.addAnnotations(annotations)
          .then(() => {
              console.log("Annotations added through API successfully");
          })
          .catch(error => {
              console.log(error);
          });
        })
      })
    }
  }, [containerRef])
  return (
    <>
    <Head>
      <title>PDF View</title>
    </Head>
    <Script src="https://documentcloud.adobe.com/view-sdk/main.js" />
    <MainLayout pageTitle={'PDF View'}>
      <section className="w-full">
        <div className="mt-4 max-w-screen-lg mx-auto">
          <div id="pdf-div" style={{ height: '800px'}} ref={containerRef} >

          </div>
        </div>
      </section>
    </MainLayout>
    </>
  )
}

export default PDFView;