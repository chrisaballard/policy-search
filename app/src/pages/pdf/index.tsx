import { useEffect, useRef, useState } from 'react';
import ViewSDKClient from '../../api/pdf';
import Head from 'next/head';
import MainLayout from '../../components/layouts/MainLayout';
import CustomRHP from '../../components/CustomRHP';
import Script from 'next/script';
import { annotations } from '../../constants';

const PDFView = () => {
  const [annotationManager, setAnnotationManager] = useState(null);
  const [ annotationListItems, setAnnotationListItems] = useState([]);
  const containerRef = useRef();
  const viewerConfig = {
    // embedMode: 'IN_LINE',
    enableAnnotationAPIs: true,
    // showAnnotationTools: true,
    // enableFormFilling: false,
    // includePDFAnnotations: true,

  };
  useEffect(() => {
    if(containerRef?.current) {
      const viewSDKClient = new ViewSDKClient();
      viewSDKClient.ready().then(() => {
        /* Invoke the file preview and get the Promise object */
        const previewFilePromise = viewSDKClient.previewFile("pdf-div", viewerConfig);
        previewFilePromise.then(adobeViewer => {
          console.log(adobeViewer)
          adobeViewer.getAnnotationManager().then(annotationManager => {
            setAnnotationManager(annotationManager);
            const customFlags = {
              /* showToolbar: false,   /* Default value is true */
              showCommentsPanel: false,  /* Default value is true */
              downloadWithAnnotations: true,  /* Default value is false */
              printWithAnnotations: true,  /* Default value is false */
          };
          annotationManager.setConfig(customFlags)
            /* API to add annotations */
            annotationManager.addAnnotations(annotations)
                .then(() => {
                    console.log("Annotations added through API successfully");
                })
                .catch(error => {
                    console.log(error);
                });
            /* API to get all annotations */
            annotationManager.getAnnotations()
            .then(result => {
                console.log("GET all annotations", result);
                setAnnotationListItems(result);
            })
            .catch(error => {
                console.log(error);
            });

            /* API to register events listener */
          //   annotationManager.registerEventListener(
          //     event => {
          //         console.log(event);
          //     },
          //     {
          //         /* Pass the list of events in listenOn. */
          //         /* If no event is passed in listenOn, then all the annotation events will be received. */
          //         listenOn: [
          //           "ANNOTATION_ADDED"
          //             /* "ANNOTATION_ADDED", "ANNOTATION_CLICKED" */
          //         ]
          //     }
          // );
          })
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
        <div className="mt-4 container flex">
          <div id="pdf-div" style={{ height: '800px'}} ref={containerRef} />

          {
            annotationManager && annotationListItems.length &&
            <div className="lg:w-1/4">
              <CustomRHP
                setAnnotationListItems={setAnnotationListItems}
                annotationListItems={annotationListItems}
                annotationManager={ annotationManager }
              />
            </div>
            
          }
        </div>
      </section>
    </MainLayout>
    </>
  )
}

export default PDFView;