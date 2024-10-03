"use client"
import { useEffect } from 'react';
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  useEffect(() => {
    // Set chatbot config
    window.embeddedChatbotConfig = {
      chatbotId: "F6XT_x6-r_Q-35-xb0gb2",
      domain: "www.chatbase.co"
      }
  
    // Create and append the chatbot script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", "F6XT_x6-r_Q-35-xb0gb2");
    script.setAttribute("domain", "www.chatbase.co");
    script.defer = true;
  
    script.onload = () => console.log("Chatbase script loaded successfully.");
    script.onerror = (error) => console.error("Error loading Chatbase script:", error);
  
    document.body.appendChild(script);
    console.log("Chatbase script appended.");
  
    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
      console.log("Chatbase script removed.");
    };
  }, []);
  

  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Our story'}
          mainHeader={'About us'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni minima odit recusandae. Illum ipsa non repudiandae? Eum ipsam iste quos suscipit tempora? Aperiam esse fugiat inventore laboriosam officiis quam rem!
          </p>
          <p>At consectetur delectus ducimus est facere iure molestias obcaecati quaerat vitae voluptate? Aspernatur dolor explicabo iste minus molestiae pariatur provident quibusdam saepe?</p>
          <p>Laborum molestias neque nulla obcaecati odio quia quod reprehenderit sit vitae voluptates? Eos, tenetur.</p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'Don\'t hesitate'}
          mainHeader={'Contact us'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" href="tel:+46738123123">
            +91 8600194737
          </a>
        </div>
      </section>
    </>
  );
}
