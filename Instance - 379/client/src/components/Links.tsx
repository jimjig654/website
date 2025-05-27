import React, { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Link {
  title: string;
  url: string;
}

const Links = () => {
  const links: Link[] = [
    { title: "Instagram", url: "https://www.instagram.com/gothboyism/profilecard/?igsh=MTNqYzVyeHl6aHlxbA==" },
    { title: "Steam", url: "https://steamcommunity.com/id/GOOFYAHFEMBOI/" },
    { title: "Spotify", url: "https://open.spotify.com/user/31xxmsafxuzcocpty4nypieb4vk4?si=6fbcf063db0e43a8" },
  ];

  return (
    <div className="w-full max-w-md">
      <Card className="p-6 bg-white/20 backdrop-blur-sm border-2 border-white/30 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-10"></div>
        <div className="sparkles absolute inset-0"></div>
        <div className="space-y-4 relative z-10">
          {links.map((link, index) => (
            <GravityLink key={index} title={link.title} url={link.url} index={index} />
          ))}
        </div>
      </Card>
    </div>
  );
};

const GravityLink = ({ title, url, index }: { title: string; url: string; index: number }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    
    let initialPosition = { x: 0, y: 0 };
    let animationFrameId: number;
    let velocity = { x: 0, y: 0 };
    let targetPosition = { x: 0, y: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!link) return;
      
      const rect = link.getBoundingClientRect();
      const linkCenterX = rect.left + rect.width / 2;
      const linkCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - linkCenterX;
      const distanceY = e.clientY - linkCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Only apply force if mouse is close enough
      if (distance < 200) {
        const force = 30 * (1 - distance / 200);
        const angle = Math.atan2(distanceY, distanceX);
        
        // Push away from the cursor
        targetPosition = {
          x: -Math.cos(angle) * force,
          y: -Math.sin(angle) * force
        };
      } else {
        // Return to original position
        targetPosition = { x: 0, y: 0 };
      }
    };
    
    const updatePosition = () => {
      if (!link) return;
      
      // Spring physics
      velocity.x += (targetPosition.x - parseFloat(link.style.transform.split('translateX(')[1]?.split('px)')[0] || '0')) * 0.1;
      velocity.y += (targetPosition.y - parseFloat(link.style.transform.split('translateY(')[1]?.split('px)')[0] || '0')) * 0.1;
      
      // Apply damping
      velocity.x *= 0.8;
      velocity.y *= 0.8;
      
      const currentX = parseFloat(link.style.transform.split('translateX(')[1]?.split('px)')[0] || '0');
      const currentY = parseFloat(link.style.transform.split('translateY(')[1]?.split('px)')[0] || '0');
      
      const newX = currentX + velocity.x;
      const newY = currentY + velocity.y;
      
      link.style.transform = `translateX(${newX}px) translateY(${newY}px)`;
      
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <a
      ref={linkRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 text-center text-lg font-bold transition-transform ease-out duration-150 hover:scale-105"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "8px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transform: "translateX(0px) translateY(0px)",
      }}
    >
      <span className="rainbow-text">{title}</span>
    </a>
  );
};

export default Links;
