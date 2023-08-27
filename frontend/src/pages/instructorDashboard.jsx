import React, { useContext } from "react";
import { Paper, Center } from "@mantine/core";
import { SideBar } from "../components";
import { ShowSidebarContext } from "../context";
import { useMediaQuery } from "@mantine/hooks";

export default function Dashboard() {
  const { showSidebar } = useContext(ShowSidebarContext);

  const isMobileOrTablet = useMediaQuery("(max-width: 1024px) and (max-height: 1400px)");

  const containerStyles = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: isMobileOrTablet ? "93vh" : "90vh", 
  };

  const paperStyles = {
    width: "100%",
    maxWidth: "96%",
    height: isMobileOrTablet ? "96%" : "96%", 
    border: "3px solid #696CA3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: showSidebar  ? "300px" : "0",
    marginRight: showSidebar  ? "20px" : "0px",
    transition: "margin-left 0.3s ease-in-out",
  };

  return (
    <>
      <SideBar />
      <div style={containerStyles}>
        <Paper
          padding="xl"
          radius={25}
          shadow="xs"
          background="white"
          withBorder
          style={paperStyles}
        >
          <Center>
            <p
              style={{
                fontSize: isMobileOrTablet ? "1.2rem" : "1.8rem",
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
