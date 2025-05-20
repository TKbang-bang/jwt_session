import React, { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await api.get("/protected");
        if (!res.data.ok) throw new Error(res.data.error);

        setUser(res.data.user);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    gettingUser();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <h3>Hello {user.name}</h3>
    </div>
  );
}

export default Home;
