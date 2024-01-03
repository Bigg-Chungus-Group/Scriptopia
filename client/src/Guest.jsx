import { Route } from "react-router-dom";
import React from "react";

import Events from "./pages/Events/Events.jsx";
import Event from "./pages/Events/Event/Event.jsx";
import Certificate from "./pages/Certificate/Certificate.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Report from "./pages/Profile/report/Profile.jsx"
import ProfileFaculty from "./pages/Profile/faculty/Profile.jsx";

const Guest = () => {
  return (
    <>
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<Event />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/certificates/:id" element={<Certificate />} />
      <Route path="/profile/:id/generate/report" element={<Report />} />
      <Route path="/profile/faculty/:id" element={<ProfileFaculty />} sensitive22204011={true} />

    </>
  );
};

export default Guest;
