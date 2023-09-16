import React, { useContext } from "react";
import { Paper, Center } from "@mantine/core";
import { SideBar } from "../components";
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
    <>
      {/* <SideBar /> */}
      <div style={containerStyles}>
        <Paper
          padding="xl"
          radius={25}
          shadow="md"
          background="white"
          withBorder
          style={paperStyles}
        >
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
        </Paper>
      </div>
    </>
  );
}
