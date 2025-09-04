"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded z-20">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#6E4EFF] border-t-transparent"></div>
      <div className="text-sm font-medium text-[#6E4EFF]">Loading...</div>
    </div>
  </div>
);

// Campaign Icons
const FeedbackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M8.1441 2.09116C8.44301 2.08944 8.73834 2.16017 9.00348 2.29819C9.26865 2.43624 9.49652 2.63727 9.66656 2.88315C9.83648 3.12892 9.94347 3.41266 9.97906 3.70932C10.0146 4.00603 9.97769 4.30726 9.87067 4.58627C9.7636 4.86525 9.58969 5.11412 9.36481 5.31088C9.13978 5.50769 8.86956 5.64717 8.57867 5.71616C8.28789 5.78506 7.98422 5.78214 7.69489 5.70737C7.40556 5.63254 7.13851 5.48768 6.91754 5.28647C7.25814 4.87078 7.47993 4.37073 7.55914 3.8392C7.63829 3.30755 7.5725 2.76392 7.36774 2.26694C7.61032 2.15152 7.87546 2.09152 8.1441 2.09116ZM4.5484 1.11362C5.82743 1.11377 6.86383 2.14222 6.86383 3.41049C6.86367 4.67863 5.82733 5.70624 4.5484 5.70639C3.26934 5.70639 2.23216 4.67872 2.23199 3.41049C2.23199 2.14213 3.26924 1.11362 4.5484 1.11362Z" fill="#17C653"/>
<path d="M4.54865 6.29309C6.44559 6.29325 7.98322 7.3217 7.98322 8.58997C7.98292 9.85807 6.44541 10.8857 4.54865 10.8859C2.65167 10.8859 1.11339 9.85817 1.1131 8.58997C1.1131 7.3216 2.65149 6.29309 4.54865 6.29309ZM8.14435 6.24426C9.65897 6.24426 10.8853 7.10402 10.8856 8.08118C10.8856 9.05845 9.74206 9.85555 8.30548 9.9093C8.56771 9.51922 8.70949 9.05998 8.71173 8.58997C8.69232 8.12655 8.55515 7.67519 8.31329 7.27942C8.07142 6.8837 7.73243 6.55591 7.32892 6.32727C7.59719 6.27187 7.87041 6.24405 8.14435 6.24426Z" fill="#17C653"/>
</svg>

);

const RetentionIcon = () => (
  <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.17871 4.82227C3.27566 4.82234 3.36894 4.86113 3.4375 4.92969C3.50589 4.99828 3.54395 5.0916 3.54395 5.18848V7.21289C3.54266 7.30947 3.50382 7.4014 3.43555 7.46973C3.36726 7.53801 3.27527 7.57777 3.17871 7.5791C3.08175 7.5791 2.98853 7.54019 2.91992 7.47168C2.85131 7.40307 2.81252 7.30991 2.8125 7.21289V5.18848C2.8125 5.09147 2.85135 4.9983 2.91992 4.92969C2.98855 4.86106 3.08166 4.82227 3.17871 4.82227ZM5.49707 3.51953C5.59373 3.51965 5.68641 3.55776 5.75488 3.62598C5.82341 3.6945 5.86219 3.78787 5.8623 3.88477V7.21289C5.86225 7.30987 5.82346 7.4031 5.75488 7.47168C5.6864 7.53998 5.59379 7.57898 5.49707 7.5791C5.40041 7.57784 5.30761 7.53808 5.23926 7.46973C5.17105 7.40144 5.13217 7.3094 5.13086 7.21289V3.88477C5.13097 3.78787 5.16976 3.6945 5.23828 3.62598C5.30686 3.55763 5.40023 3.51953 5.49707 3.51953ZM0.827148 5.44629C0.924097 5.44636 1.01738 5.48515 1.08594 5.55371C1.15438 5.62231 1.19238 5.71558 1.19238 5.8125V7.21289C1.19228 7.3098 1.15447 7.40315 1.08594 7.47168C1.01738 7.5402 0.924071 7.57805 0.827148 7.57812C0.730491 7.57686 0.637689 7.53808 0.569336 7.46973C0.501169 7.40148 0.4623 7.30933 0.460938 7.21289V5.8125C0.460937 5.71545 0.499736 5.62234 0.568359 5.55371C0.636984 5.48509 0.730098 5.44629 0.827148 5.44629ZM5.49707 0.533203C5.54523 0.532549 5.59307 0.541472 5.6377 0.55957C5.68223 0.577663 5.7228 0.604731 5.75684 0.638672C5.79095 0.672783 5.81876 0.714096 5.83691 0.758789C5.85493 0.803332 5.86394 0.851366 5.86328 0.899414V2.0459C5.86525 2.0948 5.85732 2.14374 5.83984 2.18945C5.82229 2.23529 5.79499 2.27734 5.76074 2.3125C5.72657 2.34754 5.68584 2.3758 5.64062 2.39453C5.59527 2.41329 5.54615 2.42258 5.49707 2.42188C5.44818 2.42189 5.39954 2.41157 5.35449 2.39258C5.30954 2.37358 5.26842 2.3455 5.23438 2.31055C5.20043 2.2756 5.174 2.23385 5.15625 2.18848C5.13852 2.14306 5.12958 2.09463 5.13086 2.0459V1.91602C3.22839 3.94935 1.05781 4.03613 0.953125 4.03613H0.948242C0.853015 4.0361 0.761635 3.999 0.693359 3.93262C0.625008 3.86609 0.585551 3.77504 0.583008 3.67969C0.580433 3.63187 0.587173 3.58408 0.603516 3.53906C0.619924 3.4939 0.644914 3.45209 0.677734 3.41699C0.710432 3.38203 0.75018 3.35435 0.793945 3.33496C0.837826 3.3156 0.885636 3.30531 0.933594 3.30469C1.02749 3.30469 3.02166 3.21333 4.73633 1.26465H4.36035C4.26338 1.26465 4.17017 1.22672 4.10156 1.1582C4.033 1.08964 3.99421 0.996374 3.99414 0.899414C3.99414 0.802398 4.03298 0.709243 4.10156 0.640625C4.17019 0.572 4.2633 0.533203 4.36035 0.533203H5.49707Z" fill="#8B16FF"/>
</svg>

);

const EngagementIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.82178 1.11365C7.94094 1.11365 8.05581 1.16129 8.14014 1.24548L8.83936 1.9447C8.9217 2.02868 8.96815 2.14154 8.96826 2.25916C8.96826 2.37695 8.92183 2.4905 8.83936 2.57458L8.83838 2.57556H9.83154C10.2798 2.57557 10.6431 2.93887 10.6431 3.38708V4.20837C10.6429 4.65643 10.2796 5.01989 9.83154 5.0199H7.46533V7.51306C7.46431 7.6002 7.44007 7.68554 7.39502 7.76013C7.34985 7.8348 7.28532 7.89646 7.2085 7.93787C7.13166 7.97928 7.04474 7.99881 6.95752 7.99548C6.8704 7.99211 6.78578 7.96542 6.7124 7.91833L6.34033 7.66931C6.23888 7.6024 6.12007 7.56677 5.99854 7.56677C5.87699 7.56678 5.75819 7.60239 5.65674 7.66931L5.28467 7.91833C5.21127 7.96544 5.1267 7.99213 5.03955 7.99548C4.95233 7.99881 4.86541 7.97928 4.78857 7.93787C4.71178 7.89646 4.64721 7.83478 4.60205 7.76013C4.55701 7.68555 4.53276 7.60018 4.53174 7.51306V5.0199H2.16553C1.71746 5.01986 1.35419 4.65641 1.354 4.20837V3.38708C1.354 2.93889 1.71734 2.5756 2.16553 2.57556H3.15479C3.07292 2.49162 3.02687 2.37948 3.02686 2.26208C3.02686 2.14308 3.07374 2.029 3.15771 1.9447L3.85693 1.24548C3.94126 1.16129 4.05613 1.11365 4.17529 1.11365C4.2943 1.11376 4.40845 1.16139 4.49268 1.24548L5.82666 2.57556H6.17041L7.50439 1.24548C7.58866 1.16136 7.70271 1.11372 7.82178 1.11365Z" fill="#F8285A"/>
<path opacity="0.3" d="M2.08734 3.79733H9.90972V9.48323C9.90972 9.66749 9.87343 9.84995 9.80292 10.0202C9.7324 10.1904 9.62905 10.3451 9.49875 10.4754C9.36846 10.6057 9.21378 10.709 9.04354 10.7796C8.87331 10.8501 8.69085 10.8864 8.50658 10.8864H3.49048C3.11835 10.8864 2.76145 10.7385 2.49831 10.4754C2.23517 10.2123 2.08734 9.85536 2.08734 9.48323V3.79733Z" fill="#F8285A"/>
</svg>

);

const AdvertiseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M10.0034 1.01087L8.23531 1.33052C7.33985 1.56971 6.52544 2.04593 5.87786 2.70903C4.84397 3.78787 3.69021 6.10038 3.23071 7.06434C3.17183 7.19168 3.15414 7.33422 3.1801 7.47209C3.20607 7.60996 3.27439 7.7363 3.37555 7.83351L4.40444 8.83243C4.50449 8.92984 4.63289 8.99297 4.77112 9.01272C4.90936 9.03247 5.05029 9.00781 5.17361 8.94231C6.66502 8.18845 8.06444 7.265 9.34412 6.19028C10.0192 5.5067 10.4749 4.63713 10.6527 3.69297L10.9724 2.00979C10.9982 1.87567 10.9913 1.73729 10.9523 1.6064C10.9132 1.47551 10.8432 1.35598 10.7481 1.25793C10.653 1.15989 10.5356 1.08624 10.406 1.04323C10.2764 1.00022 10.1383 0.989115 10.0034 1.01087V1.01087ZM8.82468 4.60199C8.68852 4.74589 8.51265 4.84605 8.31943 4.88974C8.12621 4.93344 7.92436 4.9187 7.73953 4.84739C7.55471 4.77608 7.39526 4.65143 7.28146 4.48928C7.16765 4.32713 7.10463 4.1348 7.1004 3.93675C7.09617 3.73869 7.15093 3.54385 7.25771 3.37699C7.36449 3.21013 7.51847 3.07879 7.70008 2.99965C7.88169 2.92052 8.08273 2.89718 8.27764 2.93259C8.47255 2.96799 8.65254 3.06056 8.79471 3.19851C8.98329 3.38148 9.09218 3.6314 9.09779 3.8941C9.1034 4.1568 9.00528 4.41113 8.82468 4.60199Z" fill="#1B84FF"/>
<path d="M4.6891 4.33727L3.3006 6.93947L1.01306 6.88453C1.01306 6.88453 2.926 3.96268 4.6891 4.33727ZM8.04548 7.20418L5.54817 8.73253L5.70301 11.0001C5.70301 11.0001 8.50498 8.94231 8.04548 7.20418ZM8.09543 2.9238C7.89786 2.9238 7.70473 2.98238 7.54045 3.09215C7.37618 3.20191 7.24815 3.35792 7.17254 3.54045C7.09694 3.72298 7.07715 3.92383 7.1157 4.1176C7.15424 4.31137 7.24938 4.48936 7.38908 4.62907C7.52878 4.76877 7.70677 4.86391 7.90055 4.90245C8.09432 4.94099 8.29517 4.92121 8.4777 4.84561C8.66023 4.77 8.81624 4.64196 8.926 4.47769C9.03576 4.31342 9.09435 4.12029 9.09435 3.92272C9.09435 3.65779 8.98911 3.40371 8.80177 3.21638C8.61444 3.02904 8.36036 2.9238 8.09543 2.9238V2.9238Z" fill="#1B84FF"/>
</svg>

);

const campaigns = [
  {
    id: 1,
    title: "Feedback and survey",
    icon: FeedbackIcon,
    bgColor: "bg-gradient-to-br from-teal-400 to-teal-600",
    background: "/feedbackAndSurvey.png",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
    type: "feedback"
  },
  {
    id: 2,
    title: "Retention",
    icon: RetentionIcon,
    bgColor: "bg-gradient-to-br from-gray-700 to-gray-900",
    background: "/retention.png",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-700",
    type: "retention"
  },
  {
    id: 3,
    title: "Engagement",
    icon: EngagementIcon,
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    background: "/engagement.png",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
    type: "engagement"
  },
  {
    id: 4,
    title: "Advertise",
    icon: AdvertiseIcon,
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    background: "/advertise.png",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
    type: "advertise"
  }
];

export function CampaignCards() {
    const router = useRouter();
    const [loadingCardId, setLoadingCardId] = useState<number | null>(null);

    const handleCampaignClick = async (campaignType: string, campaignId: number) => {
        setLoadingCardId(campaignId);

        // Add a small delay to show the loading animation
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            // Save source information to localStorage for tracking
            const sourceData = {
                source: 'dashboard',
                campaignType: campaignType,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('campaign_source', JSON.stringify(sourceData));
            
            // Route to audience page to start the journey
            await router.push(`/new-campaign/audience?type=${campaignType}&source=dashboard`, { scroll: false });
        } catch (error) {
            console.error('Navigation error:', error);
            setLoadingCardId(null);
        }
    };

    return (
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0 w-full max-w-full overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide sm:scrollbar-default">
        {campaigns.map((campaign) => {
            const Icon = campaign.icon;
            const isLoading = loadingCardId === campaign.id;

            return (
            <div
                key={campaign.id}
                className="relative min-w-[280px] sm:min-w-0 max-w-full bg-white border border-[#e9e9e9] rounded hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer group overflow-hidden transform flex-shrink-0 sm:flex-shrink"
                onClick={() => !isLoading && handleCampaignClick(campaign.type, campaign.id)}
            >
                {/* Loading Overlay */}
                {isLoading && <LoadingSpinner />}

                {/* Header with gradient background */}
                <div className={`h-16 ${campaign.bgColor} rounded-t relative overflow-hidden transition-transform duration-300 group-hover:scale-105`} style={{backgroundImage: `url(${campaign.background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-300 group-hover:opacity-20"></div>

                {/* Icon */}
                <div className="absolute -bottom-[5px] left-4 w-[26px] h-[26px] bg-white border border-[#e9e9e9] rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <div className={`w-5 h-5 rounded-sm ${campaign.iconBg} flex items-center justify-center transition-colors duration-300`}>
                    <div className={`w-[10.909px] h-[10.909px] ${campaign.iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        <Icon />
                    </div>
                    </div>
                </div>
                </div>

                {/* Content */}
                <div className="h-[50px] px-4 py-4 flex items-center transition-colors duration-300 group-hover:bg-gray-50">
                <span className="text-[14px] font-medium text-[#2a2a2f] leading-[19.6px] tracking-[-0.1px] transition-colors duration-300 group-hover:text-[#6E4EFF]">
                    {campaign.title}
                </span>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent rounded transition-all duration-300 group-hover:border-[#6E4EFF]/20 pointer-events-none"></div>
            </div>
            );
        })}
        </div>
  );
}
