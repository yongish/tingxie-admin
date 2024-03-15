import React from "react";
import { Tab, Tabs } from "react-bootstrap";

const ImageTabs = () => {
  return (
    <Tabs defaultActiveKey="questionPage" className="mb-3" >
      <Tab eventKey="questionPage" title="QuestionPage">
        <img
          src={
            "https://gitlab.com/yongish/question-parsing/-/raw/main/gray.png"
          }
          width={750}
          alt=""
        />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        Tab content for Profile
      </Tab>
      <Tab eventKey="contact" title="Contact">
        Tab content for Contact
      </Tab>
    </Tabs>
  );
};

export default ImageTabs;
