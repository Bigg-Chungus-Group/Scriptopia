import { Route } from "react-router-dom";
import React from "react";

import Events from "./pages/Events/Events.jsx";
import Event from "./pages/Events/Event/Event.jsx";
import Certificate from "./pages/Certificate/Certificate.jsx";
import Profile from "./pages/Profile/Profile.jsx";

const Guest = () => {
  return (
    <>
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<Event />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/certificates/:id" element={<Certificate />} />

    </>
  );
};

export default Guest;
