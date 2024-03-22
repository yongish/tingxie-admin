import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import styled from "styled-components";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const ImageTabs = ({ sourceUrl, pageUrl, secondLastPageUrl, lastPageUrl }) => {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(2);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    setNumPages(numPages);
  }

  return (
    // <Tabs defaultActiveKey="questionPage" className="mb-3">
    //   <Tab eventKey="questionPage" title="Question Page">
    //     <img src={pageUrl} width={750} alt="" />
    //   </Tab>
    //   <Tab eventKey="secondLastPage" title="2nd Last Page">
    //     <img src={secondLastPageUrl} width={750} alt="" />
    //   </Tab>
    //   <Tab eventKey="lastPage" title="Last Page">
    //     <img src={lastPageUrl} width={750} alt="" />
    //   </Tab>
    //   <Tab eventKey="pdf" title="PDF">

    <div style={{ border: "1px solid black" }}>
      <PDFDocumentWrapper>
        <Document
          file="https://raw.githubusercontent.com/yongish/question-parsing/main/pdfs/P6-Chinese-SA2-2014-Catholic-High.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={0.8}
            style={{ border: "1px solid red" }}
          />
        </Document>
      </PDFDocumentWrapper>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
    //   </Tab>
    // </Tabs>
  );
};

export default ImageTabs;

const PDFDocumentWrapper = styled.div`
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
