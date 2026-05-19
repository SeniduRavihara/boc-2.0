import React from "react";
import FlyerImage from "../../../public/images/flyer/flyer-img.jpeg";

interface FlyerTemplateProps {
  teamName: string;
  memberName: string;
  profileImage: string | null;
}

export const FlyerTemplate = React.forwardRef<
  HTMLDivElement,
  FlyerTemplateProps
>(({ teamName, memberName, profileImage }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "520px",
        minWidth: "520px",
        maxWidth: "520px",
        height: "650px",
        minHeight: "650px",
        maxHeight: "650px",
        flex: "0 0 520px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        borderRadius: 0,
        background: "#050708",
      }}
    >
      <img
        src={FlyerImage.src}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "217px",
          left: "156px",
          width: "208px",
          height: "258px",
          zIndex: 1,
          overflow: "hidden",
          backgroundColor: "transparent",
          backgroundImage: profileImage ? `url(${profileImage})` : undefined,
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        role={profileImage ? "img" : undefined}
        aria-label={profileImage ? memberName || "Attendee" : undefined}
      />

      <div
        style={{
          position: "absolute",
          top: "484px",
          left: "90px",
          width: "340px",
          zIndex: 2,
          textAlign: "center",
          textTransform: "uppercase",
          color: "#13dfff",
          textShadow: "0 0 12px rgba(19, 223, 255, 0.45), 0 2px 8px rgba(0, 0, 0, 0.8)",
          fontFamily: "'Inter', 'Arial', sans-serif",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "30px",
            lineHeight: 1.18,
            fontWeight: 900,
            letterSpacing: "0.03em",
            overflow: "visible",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "'Reglo'"
          }}
        >
          {memberName || "Your Name"}
        </div>
        <div
          style={{
            marginTop: "0px",
            fontSize: "20px",
            lineHeight: 1.22,
            fontWeight: 800,
            letterSpacing: "0.08em",
            overflow: "visible",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "'Reglo'"
          }}
        >
          {teamName || "Team Name"}
        </div>
      </div>
    </div>
  );
});

FlyerTemplate.displayName = "FlyerTemplate";
