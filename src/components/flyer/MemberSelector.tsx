import React from "react";

interface MemberSelectorProps {
  members: Array<{ id: string; name: string; email: string }>;
  selectedMember: string;
  onMemberChange: (memberId: string) => void;
  isLoading: boolean;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  members,
  selectedMember,
  onMemberChange,
  isLoading,
}) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-lg font-uncutsans text-gray-200">
        Select Your Name
      </label>
      <select
        value={selectedMember}
        onChange={(e) => onMemberChange(e.target.value)}
        disabled={isLoading || members.length === 0}
        className="w-full px-4 py-3 bg-dark-blue-700 border-line border-dark-blue-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 cursor-pointer appearance-none font-uncutsans"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "40px",
        }}
      >
        <option value="">
          {isLoading
            ? "Loading members..."
            : members.length === 0
              ? "No members found"
              : "Choose a member..."}
        </option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
};
