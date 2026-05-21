"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import { TeamSelector } from "@/components/flyer/TeamSelector";
import { MemberSelector } from "@/components/flyer/MemberSelector";
import { ImageCropper } from "@/components/flyer/ImageCropper";
import { FlyerTemplate } from "@/components/flyer/FlyerTemplate";
import { getAllTeams, getTeamMembers, TeamMember, Team } from "@/firebase/firebaseQueries";

// ── Caption generator ─────────────────────────────────────────────────────────
function generateCaption(memberName: string, teamName: string): string {
  return `From local host to global scale. 🌍☁️

Proud to share that I'm joining Beauty of Cloud 2.0, Sri Lanka's premier student-led cloud ideathon. Looking forward to getting hands-on experience with enterprise cloud platforms, solving real architectural challenges, and pushing my limits.

Let's build something beautiful together. ✨

#IEEE #USJ #IEEESB #CS #BeautyofCloud2.0`;
}

// ── CaptionBox component ──────────────────────────────────────────────────────
function CaptionBox({
  memberName,
  teamName,
}: {
  memberName: string;
  teamName: string;
}) {
  const [copied, setCopied] = useState(false);
  const caption = generateCaption(memberName, teamName);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = caption;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-dark-blue-700 bg-opacity-50 backdrop-blur rounded-2xl p-4 sm:p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-reglo text-blue-300">
          Step 3: Copy Caption
        </h2>
      </div>

      {/* Caption text area */}
      <div className="relative">
        <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed bg-dark-blue-900 bg-opacity-70 rounded-xl p-5 border-line border-dark-blue-600 font-sans min-h-[160px]">
          {caption}
        </pre>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={`mt-4 w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all duration-200 text-sm
          ${copied
            ? "bg-green-600 hover:bg-green-600 text-white"
            : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Copied to Clipboard!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Caption
          </>
        )}
      </button>
    </div>
  );
}

function namesMatch(a: string, b: string): boolean {
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  return left.length > 0 && left === right;
}

// ── Page ──────────────────────────────────────────────────────────────────────
function FlyerGeneratorContent() {
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");
  const memberParam = searchParams.get("member");

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedMemberData, setSelectedMemberData] = useState<TeamMember | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const prefillApplied = useRef({ team: false, member: false });

  // Load teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      try {
        const loadedTeams = await getAllTeams();
        setTeams(loadedTeams);
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  }, []);

  // Pre-fill team from ?team= query param
  useEffect(() => {
    if (!teamParam || teams.length === 0 || prefillApplied.current.team) return;

    const decodedTeam = decodeURIComponent(teamParam);
    const match = teams.find(
      (t) => t.name === decodedTeam || namesMatch(t.name, decodedTeam)
    );
    if (match) {
      setSelectedTeam(match.name);
      prefillApplied.current.team = true;
    }
  }, [teams, teamParam]);

  useEffect(() => {
    const updateScale = () => {
      if (previewFrameRef.current) {
        const containerWidth = previewFrameRef.current.offsetWidth;
        setPreviewScale(Math.min(containerWidth / 520, 1));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Load members when team is selected
  useEffect(() => {
    const loadMembers = async () => {
      if (!selectedTeam) {
        setMembers([]);
        setSelectedMember("");
        setSelectedMemberData(null);
        return;
      }
      setSelectedMember("");
      setIsLoading(true);
      try {
        const loadedMembers = await getTeamMembers(selectedTeam);
        setMembers(loadedMembers);
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, [selectedTeam]);

  // Pre-fill member from ?member= query param (matches display name)
  useEffect(() => {
    if (
      !memberParam ||
      members.length === 0 ||
      !selectedTeam ||
      prefillApplied.current.member
    ) {
      return;
    }

    const decodedMember = decodeURIComponent(memberParam);
    const match = members.find(
      (m) => m.name === decodedMember || namesMatch(m.name, decodedMember)
    );
    if (match?.email) {
      setSelectedMember(match.email);
      prefillApplied.current.member = true;
    }
  }, [members, memberParam, selectedTeam]);

  // Resolve selected member row by email
  useEffect(() => {
    if (selectedMember) {
      const member = members.find((m) => m.email === selectedMember);
      setSelectedMemberData(member || null);
    } else {
      setSelectedMemberData(null);
    }
  }, [selectedMember, members]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setShowCropper(true);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCroppedImage(croppedImage);
    setShowCropper(false);
  };

  const downloadFlyer = async () => {
    if (!flyerRef.current || !selectedTeam || !selectedMemberData) return;
    setIsDownloading(true);
    try {
      await document.fonts.ready;

      const canvas = await html2canvas(flyerRef.current, {
        backgroundColor: null,
        scale: 2,
        width: 520,
        height: 650,
        windowWidth: 520,
        windowHeight: 650,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDocument) => {
          const exportNode = clonedDocument.querySelector(
            "[data-flyer-export]"
          ) as HTMLElement | null;

          if (exportNode) {
            exportNode.style.position = "absolute";
            exportNode.style.left = "0";
            exportNode.style.top = "0";
            exportNode.style.opacity = "1";
            exportNode.style.pointerEvents = "auto";
          }
        },
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${selectedTeam}_${selectedMemberData.name}_flyer.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading flyer:", error);
      alert("Failed to download flyer. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-blue-900 via-dark-blue-800 to-dark-blue-900 text-white p-3 sm:p-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-reglo mb-2 pb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Flyer Generator
          </h1>
          <p className="text-gray-400 text-lg font-uncutsans">
            Create your professional event flyer in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <div className="boc-card rounded-lg p-4 sm:p-8">
              <h2 className="text-2xl font-reglo mb-6 text-blue-300">
                Step 1: Select Team & Member
              </h2>

              <div className="mb-6">
                <TeamSelector
                  teams={teams}
                  selectedTeam={selectedTeam}
                  onTeamChange={setSelectedTeam}
                  isLoading={isLoading}
                />
              </div>

              {selectedTeam && (
                <div className="mb-8">
                  <MemberSelector
                    members={members}
                    selectedMember={selectedMember}
                    onMemberChange={setSelectedMember}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>

            {/* Image Upload & Crop */}
            {selectedMember && (
              <div className="boc-card rounded-lg p-4 sm:p-8">
                <h2 className="text-2xl font-reglo mb-6 text-blue-300">
                  Step 2: Upload & Crop Photo
                </h2>

                {!showCropper && !croppedImage && (
                  <label className="block">
                    <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-dark-blue-600 transition-all duration-200">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-300 font-uncutsans">
                        Click to upload your photo
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {showCropper && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-400 mb-4 font-uncutsans">
                      Crop your image to fit the circular frame
                    </p>
                    <ImageCropper
                      imageSrc={uploadedImage || ""}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                )}

                {croppedImage && !showCropper && (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden bg-dark-blue-800 p-4">
                      <img
                        src={croppedImage}
                        alt="Cropped preview"
                        className="w-full rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => setShowCropper(true)}
                      className="w-full bg-dark-blue-600 hover:bg-dark-blue-500 text-white font-uncutsans py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      Re-crop Image
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Download Button */}
            {selectedMember && croppedImage && (
              <button
                onClick={downloadFlyer}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Flyer
                  </>
                )}
              </button>
            )}

            {/* LinkedIn Caption — shown as soon as member is selected */}
            {selectedMember && selectedMemberData && (
              <CaptionBox
                memberName={selectedMemberData.name}
                teamName={selectedTeam}
              />
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="boc-card rounded-lg p-4 sm:p-8">
              <h2 className="text-2xl font-reglo mb-6 text-blue-300">Preview</h2>

              <div className="flex items-center justify-center bg-dark-blue-900 rounded-xl p-3 sm:p-8 overflow-hidden w-full">
                <div
                  ref={previewFrameRef}
                  className="relative w-full overflow-hidden"
                  style={{ height: `${650 * previewScale}px`, maxWidth: "520px" }}
                >
                  <div
                    style={{
                      width: "520px",
                      height: "650px",
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <FlyerTemplate
                      teamName={selectedTeam}
                      memberName={selectedMemberData?.name || ""}
                      profileImage={croppedImage}
                    />
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                data-flyer-export
                style={{
                  position: "fixed",
                  left: "-9999px",
                  top: "-9999px",
                  width: "520px",
                  height: "650px",
                  opacity: 0,
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              >
                <FlyerTemplate
                  ref={flyerRef}
                  teamName={selectedTeam}
                  memberName={selectedMemberData?.name || ""}
                  profileImage={croppedImage}
                />
              </div>

              <div className="mt-6 p-4 bg-dark-blue-800 rounded-lg border-line border-dark-blue-600">
                <p className="text-sm text-gray-400">
                  <span className="font-uncutsans text-blue-300">Note:</span> The
                  flyer will be downloaded as a PNG image with high quality. Team
                  name appears at the top, your photo in the center, and your name
                  at the bottom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FlyerGeneratorPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-dark-blue-900 via-dark-blue-800 to-dark-blue-900 text-white flex items-center justify-center">
          <p className="text-gray-400 font-uncutsans">Loading flyer generator…</p>
        </main>
      }
    >
      <FlyerGeneratorContent />
    </Suspense>
  );
}
