import React, { useContext } from "react";
import { Paper, Center } from "@mantine/core";
import { ShowSidebarContext } from "../context";
import { useMediaQuery } from "@mantine/hooks";

export default function Dashboard() {
  const { showSidebar } = useContext(ShowSidebarContext);

  const containerStyles = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const paperStyles = {
    width: "100%",
    maxWidth: "96%",
    border: "3px solid #696CA3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: showSidebar ? "300px" : "0",
    marginRight: showSidebar ? "20px" : "0px",
    transition: "margin-left 0.3s ease-in-out",
  };

  return (
    <div className="my-20 lg:my-24">
      <div className="p-5 flex-col flex gap-3 border-[3px] border-primary rounded-2xl shadow-xl lg:h-[86vh] md:h-[86vh] h-[70vh] lg:overflow-visible overflow-x-auto mx-10">
        <Center>
          <p
            style={{
              color: "#696CA3",
              fontFamily: "'SF Pro', sans-serif",
              fontWeight: 690,
              lineHeight: "normal",
              textAlign: "center",
            }}
          >
            {showSidebar
              ? "Please select an academic year"
              : "Click the icon at the top left corner"}
            <br />
            {showSidebar && "in the sidebar menu"}
            {!showSidebar && "to select an academic year"}
          </p>
        </Center>
      </div>
    </div>
  );
}
