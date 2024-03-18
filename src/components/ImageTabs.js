import React from "react";
import { Tab, Tabs } from "react-bootstrap";

const ImageTabs = ({ pageUrl, secondLastPageUrl, lastPageUrl }) => {
  return (
    <Tabs defaultActiveKey="questionPage" className="mb-3">
      <Tab eventKey="questionPage" title="Question Page">
        <img src={pageUrl} width={750} alt="" />
      </Tab>
      <Tab eventKey="profile" title="2nd Last Page">
        <img src={secondLastPageUrl} width={750} alt="" />
      </Tab>
      <Tab eventKey="contact" title="Last Page">
        <img src={lastPageUrl} width={750} alt="" />
      </Tab>
    </Tabs>
  );
};

export default ImageTabs;
