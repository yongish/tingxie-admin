import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import styled from "styled-components";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const ImageTabs = ({ sourceUrl, pageUrl, secondLastPageUrl, lastPageUrl }) => {
  // const [numPages, setNumPages] = useState();
  // const [pageNumber, setPageNumber] = useState(2);

  // function onDocumentLoadSuccess({ numPages }) {
  //   console.log("aaaaaaaaaaaaaaaaaaaaaaa");
  //   setNumPages(numPages);
  // }
  return (
    <Tabs defaultActiveKey="questionPage" className="mb-3">
      <Tab eventKey="questionPage" title="Question Page">
        <img src={pageUrl} width={750} alt="" />
      </Tab>
      <Tab eventKey="secondLastPage" title="2nd Last Page">
        <img src={secondLastPageUrl} width={750} alt="" />
      </Tab>
      <Tab eventKey="lastPage" title="Last Page">
        <img src={lastPageUrl} width={750} alt="" />
      </Tab>
      <Tab eventKey="pdf" title="PDF">
        <div style={{ border: "1px solid red" }}>
          <Document
            file="https://raw.githubusercontent.com/yongish/question-parsing/main/pdfs/P6-Chinese-SA2-2014-Catholic-High.pdf"
            style={{ border: "1px solid black" }}
          >
            <Page
              pageNumber={5}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </Tab>
    </Tabs>
  );
};

export default ImageTabs;
