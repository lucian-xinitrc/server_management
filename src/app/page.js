'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [logged, islogged] = useState(false);
  const [password, setPassword] = useState("");
  const [expanded, setExpanded] = useState({});
  const secretKey = "12021908";

  const toggleCard = (idx) => {
    setExpanded(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === secretKey) {
      islogged(true);
    } else {
      alert("Wrong key");
    }
  };

  const [requests, setRequests] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null); // indexul cardului selectat

  const fetchRequests = async () => {
    const res = await fetch("https://gethonis.com:8888/api/getOutput", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "headers": "string",
            "command": "output"
          }),
        });
        if(res.ok) {
          alert("Added Succesfully");
          setRefreshCount(2);
        } else {
          alert("Error");
        }

    };
    const data = await res.json();
    setRequests(data);
  };



  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <section className="dark:bg-gray-950 bg-white h-screen justify-center py-20">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">{!logged ? "Lucian Web Services Admin" : ""}</h2>
      <div className="bg-transparent px-5 py-10 mx-5 sm:mx-[30%] sm:w-auto  rounded-lg">
      <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">{!logged ? "Login" : "DashBoard"}</h2>
      {logged == false ? (
          <form onSubmit={handleLogin} className="mb-5 flex justify-center font-bold">

            <input type="password"
              placeholder="Introdu parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"aria-describedby="helper-text-explanation" className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-white dark:hover:text-black hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 p-6 sm:px-5 sm:w-auto text-[20px] sm:w-2xl w-[150px] focus:outline-none" placeholder="key" />
            <button type="submit" className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-white dark:hover:text-black hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 p-6 sm:px-5 w-auto sm:w-2xl md:w-[158px] mx-2 text-[20px]">
              Login
            </button>
          </form>
        ) : ( 

          <div className="w-full h-full bg-black">
            {requests.map((req, idx) => (
                                    <p
                                            key={idx}
                                            className="hover:underline">
                                          {req.output}
                                          </p>
            ))}
          </div>

         )
      }
      </div>
    </section>
    </>
  );
}
