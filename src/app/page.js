'use client'
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

export default function Home() {
  const [logged, islogged] = useState(false);
  const [password, setPassword] = useState("");
  const [commando, setCommando] = useState("");
  const [expanded, setExpanded] = useState({});
  const [lines, setLines] = useState([]);
  const secretKey = "12021908";
  const logEndRef = useRef(null);

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
  const handleInsertCustomCommand = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://mcapi.gethonis.com/api/insertCustomCommand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: "12021908",
          command: commando,
          type: "custom",
        }),
      });

      if (res.ok) {
        alert("Inserted!");
        setCommando("");
        await fetchRequests(); // fetch imediat linia nouă
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.message || res.status));
      }
    } catch (err) {
      console.error(err);
      alert("Network error!");
    }
  };

  const [requests, setRequests] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null); // indexul cardului selectat

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://mcapi.gethonis.com/api/getOutput", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: "string",
          command: "output"
        }),
      });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const line = data?.output;

        if (line && line.trim() !== "") {
          setLines(prev => [...prev, line]);
          console.log(data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };




  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

   useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <>
    <section className="dark:bg-slate-950 bg-white h-screen content-center justify-center py-20">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">{!logged ? "EverBlox Management" : ""}</h2>
      <div className="bg-transparent px-5 py-10 mx-5 sm:mx-[30%] sm:w-auto  rounded-lg">
      <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center">{!logged ? "" : "Console"}</h2>
      <p className="mb-4 text-thin leading-none text-gray-900 md:text-thin lg:text-thin dark:text-white text-center">{!logged ? "" : "Everblox Console"}</p>

      {logged == false ? (
          <form onSubmit={handleLogin} className="mb-5 flex justify-center font-bold">

            <input type="password"
              placeholder="Insert password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"aria-describedby="helper-text-explanation" className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-white dark:hover:text-black hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 p-6 sm:px-5 sm:w-auto text-[20px] sm:w-2xl w-[150px] focus:outline-none"/>
            <button type="submit" className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out hover:bg-gray-100 hover:text-black dark:hover:bg-white dark:hover:text-black hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 p-6 sm:px-5 w-auto sm:w-2xl md:w-[158px] mx-2 text-[20px]">
              Login
            </button>
          </form>
        ) : ( 
        <div>
          <div className="w-full p-10 h-[500px] bg-black overflow-y-scroll no-scrollbar shadow-lg rounded-lg">
            {lines.map((line, idx) => (
                <pre key={idx} className="text-thin" style={{ margin: 0 }}>{line}</pre>

            ))}
            <div ref={logEndRef}>
            </div>
            
          </div>
          <form onSubmit={handleInsertCustomCommand} className="mb-5 flex justify-center font-bold">

            <input type="text"
              placeholder="Type command"
              value={commando}
              onChange={(e) => setCommando(e.target.value)}
              type="text "aria-describedby="helper-text-explanation" className="border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 font-medium text-sm sm:text-base h-auto sm:h-8 p-2 mt-2 sm:px-5 sm:w-auto text-[20px] sm:w-2xl w-[150px] rounded-md focus:outline-none"/>
            <button type="submit" className="border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center transition duration-700 ease-in-out font-medium text-sm sm:text-base h-auto sm:h-8 p-2 sm:px-5 w-auto mt-2 sm:w-2xl md:w-[158px] mx-2 text-[20px] bg-slate-800 rounded-md">
              Insert
            </button>
          </form>
        </div>
         )
      }

      </div>
    </section>
    </>
  );
}
